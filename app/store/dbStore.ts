import { defineStore } from "pinia";
import { db } from "../indexedDb/db";
import { useCanvasElemsStore } from "~/store";
import type { CanvasElem } from "~/types";

export interface SavedCanvasMeta {
	id: string;
	name: string;
	updatedAt: number;
}

function generateSaveId(): string {
	return "canvas-" + Math.random().toString(36).slice(2, 10);
}

export const useCanvasPersistenceStore = defineStore("canvasPersistence", {
	state: function () {
		return {
			savedCanvases: [] as SavedCanvasMeta[],

			currentCanvasId: null as string | null,

			showSaveNamePrompt: false,
			showRestorePrompt: false,

			canvasName: "",
			savedAt: null as number | null,

			isSaving: false,
			isStartingNew: false,

			restoringCanvasId: null as string | null,
			deletingCanvasId: null as string | null,

			errorMessage: null as string | null,
		};
	},

	actions: {
		listSavedCanvases: async function (): Promise<void> {
			try {
				const rows = await db.canvases.toArray();

				this.savedCanvases = rows
					.map(function (row) {
						return {
							id: row.id,
							name: row.name,
							updatedAt: row.updatedAt,
						};
					})
					.sort(function (a, b) {
						return b.updatedAt - a.updatedAt;
					});

				this.showRestorePrompt = this.savedCanvases.length > 0;
			} catch (error) {
				this.savedCanvases = [];
				this.showRestorePrompt = false;

				this.errorMessage =
					error instanceof Error
						? `Couldn't list saved canvases: ${error.message}`
						: "Couldn't list saved canvases. Please try again.";
			}
		},

		requestSaveCanvas: async function (): Promise<void> {
			this.errorMessage = null;

			if (!this.currentCanvasId && !this.canvasName.trim()) {
				this.showSaveNamePrompt = true;
				return;
			}

			this.showSaveNamePrompt = false;

			await this.saveCanvas();
		},

		saveCanvas: async function (newName?: string): Promise<boolean> {
			this.errorMessage = null;
			this.isSaving = true;

			try {
				const canvasElemsStore = useCanvasElemsStore();

				if (newName !== undefined) {
					this.canvasName = newName.trim();
				}

				const id = this.currentCanvasId ?? generateSaveId();

				const now = Date.now();

				await db.canvases.put({
					id,
					name: this.canvasName,
					elems: JSON.parse(
						JSON.stringify(canvasElemsStore.elems)
					) as CanvasElem[],
					updatedAt: now,
				});

				this.currentCanvasId = id;
				this.savedAt = now;

				this.showSaveNamePrompt = false;

				await this.listSavedCanvases();

				return true;
			} catch (error) {
				this.errorMessage =
					error instanceof Error
						? `Couldn't save: ${error.message}`
						: "Couldn't save the canvas. Please try again.";

				return false;
			} finally {
				this.isSaving = false;
			}
		},

		restoreCanvas: async function (id: string): Promise<boolean> {
			this.errorMessage = null;
			this.restoringCanvasId = id;

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
				this.showSaveNamePrompt = false;

				return true;
			} catch (error) {
				this.errorMessage =
					error instanceof Error
						? `Couldn't restore: ${error.message}`
						: "Couldn't restore the saved canvas. Please try again.";

				return false;
			} finally {
				this.restoringCanvasId = null;
			}
		},

		deleteSavedCanvas: async function (id: string): Promise<boolean> {
			this.errorMessage = null;
			this.deletingCanvasId = id;

			try {
				await db.canvases.delete(id);

				if (this.currentCanvasId === id) {
					this.currentCanvasId = null;
					this.canvasName = "";
					this.savedAt = null;
				}

				await this.listSavedCanvases();

				return true;
			} catch (error) {
				this.errorMessage =
					error instanceof Error
						? `Couldn't delete the saved canvas: ${error.message}`
						: "Couldn't delete the saved canvas. Please try again.";

				return false;
			} finally {
				this.deletingCanvasId = null;
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
				this.showSaveNamePrompt = false;

				return true;
			} catch (error) {
				this.errorMessage =
					error instanceof Error
						? `Couldn't start a new canvas: ${error.message}`
						: "Couldn't start a new canvas. Please try again.";

				return false;
			} finally {
				this.isStartingNew = false;
			}
		},
	},
});
