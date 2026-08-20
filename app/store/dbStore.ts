import { defineStore } from "pinia";
import { db } from "../indexedDb/db";
import { useCanvasElemsStore } from "~/store";
import type { CanvasElem } from "~/types";

export interface SavedCanvasMeta {
	id: string;
	name: string;
	updatedAt: number;
}

export const useCanvasPersistenceStore = defineStore("canvasPersistence", {
	state: function () {
		return {
			//the ONE place the list of saved canvases lives. every
			//component reads this directly, always current - without this
			//field there's nowhere for the list to actually live, so any
			//own disconnected copy of the return value instead.
			savedCanvases: [] as SavedCanvasMeta[],

			currentCanvasId: null as string | null,

			//the currently loaded/saved canvas's REAL name - distinct
			//from saveNamePrompt.draftName below, which is just whatever
			//the user is currently typing into the name input. these were
			//previously the same field (saveNamePrompt.name), which meant
			//restoring a canvas would silently overwrite whatever the
			//user had mid-typed into the save-name form, and vice versa.
			canvasName: "",
			savedAt: null as number | null,

			isStartingNew: false,

			errorMessage: null as string | null,
			showRestorePrompt: false,

			saveNamePrompt: {
				show: false,
				draftName: "",
				isSaving: false,
			},

			canvasOperation: {
				restoringId: null as string | null,
				deletingId: null as string | null,
			},
		};
	},

	actions: {
		//the ONLY public entry point for syncing the saved-canvas list.
		//getDataFromDb (the actual db fetch) is a private, module-scoped
		//function above - it's not an action, so nothing outside this
		//file can call it directly. every place that needs the list
		//refreshed (startup, after save, after delete) goes through
		//refreshList, never around it.
		refreshList: async function (): Promise<void> {
			try {
				const data = await getDataFromDb();

				this.savedCanvases = data;
			} catch (error: any) {
				this.savedCanvases = [];
				this.errorMessage =
					error.message || "opps something went wrong couldnt get data from db";
			}
		},

		requestSaveCanvas: async function (): Promise<void> {
			this.errorMessage = null;

			// EXISTING CANVAS
			if (this.currentCanvasId) {
				if (!this.canvasName.trim()) {
					this.errorMessage = "This canvas has an ID but no name.";
					return;
				}

				await this.saveCanvas(this.canvasName);
				return;
			}

			// NEW CANVAS
			if (!this.saveNamePrompt.draftName.trim()) {
				this.saveNamePrompt.show = true;
				return;
			}

			await this.saveCanvas(this.saveNamePrompt.draftName.trim());
		},

		saveCanvas: async function (newName?: string): Promise<boolean> {
			this.errorMessage = null;
			this.saveNamePrompt.isSaving = true;

			try {
				if (newName !== undefined) {
					this.canvasName = newName.trim();
				}

				if (!this.canvasName.trim()) {
					console.log("thig block ran");
					this.saveNamePrompt.show = true;
					return false;
				}

				const canvasElemsStore = useCanvasElemsStore();

				const id = this.currentCanvasId ?? generateSaveId();
				const updatedAt = Date.now();

				await saveDataToDb({
					id,
					updatedAt,
					name: this.canvasName,
					elems: JSON.parse(
						JSON.stringify(canvasElemsStore.elems)
					) as CanvasElem[],
				});

				this.currentCanvasId = id;
				this.savedAt = updatedAt;

				this.saveNamePrompt.show = false;
				this.showRestorePrompt = false;

				//refresh the shared list so it reflects the new/updated
				//save immediately, everywhere it's displayed
				await this.refreshList();

				return true;
			} catch (error: any) {
				this.errorMessage =
					error.message || "Couldn't save the canvas. Please try again.";

				return false;
			} finally {
				this.saveNamePrompt.isSaving = false;
			}
		},

		restoreCanvas: async function (id: string): Promise<boolean> {
			this.errorMessage = null;
			this.canvasOperation.restoringId = id;

			try {
				const canvasElemsStore = useCanvasElemsStore();
				const savedCanvas = await db.canvases.get(id);

				if (!savedCanvas) {
					this.errorMessage = "That saved canvas could not be found.";
					return false;
				}

				canvasElemsStore.elems = savedCanvas.elems;

				this.currentCanvasId = savedCanvas.id;
				this.canvasName = savedCanvas.name;
				this.savedAt = savedCanvas.updatedAt;

				this.showRestorePrompt = false;
				this.saveNamePrompt.show = false;

				return true;
			} catch (error) {
				this.errorMessage =
					error instanceof Error
						? `Couldn't restore: ${error.message}`
						: "Couldn't restore the saved canvas. Please try again.";

				return false;
			} finally {
				this.canvasOperation.restoringId = null;
			}
		},
		checkForRestorePrompt: function (): void {
			if (this.savedCanvases.length > 0 && !this.currentCanvasId) {
				this.showRestorePrompt = true;
			}
		},
		deleteSavedCanvas: async function (id: string): Promise<boolean> {
			this.errorMessage = null;
			this.canvasOperation.deletingId = id;

			try {
				await deleteDataFromDb(id);

				if (this.currentCanvasId === id) {
					this.currentCanvasId = null;
					this.canvasName = "";
					this.savedAt = null;
				}

				//refresh the shared list so the deleted item disappears
				//from every display of it immediately
				await this.refreshList();

				return true;
			} catch (error: any) {
				this.errorMessage = error.message || "Couldn't delete the saved canvas";

				return false;
			} finally {
				this.canvasOperation.deletingId = null;
			}
		},

		startNewCanvas: async function (newName: string): Promise<boolean> {
			this.errorMessage = null;
			this.isStartingNew = true;

			try {
				const canvasElemsStore = useCanvasElemsStore();

				canvasElemsStore.elems = [];
				canvasElemsStore.setActiveElem(null);

				this.currentCanvasId = null;
				this.canvasName = newName.trim();
				this.savedAt = null;

				this.showRestorePrompt = false;
				this.saveNamePrompt.show = false;

				return true;
			} catch (error: any) {
				this.errorMessage =
					error.message || "Couldn't start a new canvas. Please try again";

				return false;
			} finally {
				this.isStartingNew = false;
			}
		},
	},
});

//---- private helpers - NOT part of the store, not reachable from
//outside this file ----

const saveDataToDb = async function ({
	name,
	id,
	updatedAt,
	elems,
}: {
	id: string;
	name: string;
	elems: CanvasElem[];
	updatedAt: number;
}): Promise<void> {
	try {
		await db.canvases.put({ id, name, elems, updatedAt });
	} catch (error: any) {
		throw new Error(error.message || "failed to save canvas to database");
	}
};

const generateSaveId = function (): string {
	return "dragzy-" + Math.random().toString(36).slice(2, 10);
};

const getDataFromDb = async function (): Promise<SavedCanvasMeta[]> {
	try {
		const rows = await db.canvases.toArray();

		return rows
			.map(function (row) {
				return { id: row.id, name: row.name, updatedAt: row.updatedAt };
			})
			.sort(function (a, b) {
				return b.updatedAt - a.updatedAt;
			});
	} catch (error: any) {
		throw new Error(
			error.message || "couldnt retrieve data or something went wrong"
		);
	}
};

const deleteDataFromDb = async function (id: string): Promise<boolean> {
	try {
		await db.canvases.delete(id);
		return true;
	} catch (error: any) {
		throw new Error(error.message || "failed to delete canvas");
	}
};
