import { defineStore } from "pinia";
import type { CanvasElem } from "~/types";

import { useAppActionStore } from "~/store";
import { createDefault, createFromPreset } from "./utils/canvasElemFactory";
import {
	findElemAndContainer,
	APP_ROOT_ID,
	findPositionedElemsIds,
} from "./utils";
import { SingleElemDataFactory } from "~/presets/bs5";
import { reorderElem } from "./reorderElem";
import { moveElem } from "./moveElem";
import { updateElem } from "./updateElem";

const createAppRoot = function (): CanvasElem {
	return {
		id: APP_ROOT_ID,
		elemType: "div",
		children: [],
		customStyles: {
			minHeight: "5000px",
		},
		cssClasses: ["w-100", "p-1"],
		excludeRootFromExport: false,
	};
};

export const useCanvasElemsStore = defineStore("canvasElems", {
	state: function () {
		return {
			lastEditedId: null as string | null,
			elems: [createAppRoot()] as CanvasElem[],
			currentlyDragged: null as HTMLElement | null,
			currentlyHovered: null as HTMLElement | null,
			activeElemId: null as string | null,
			isDragging: false as boolean,
			isEditModalOpen: false as boolean,

			positionedElemsIds: {
				relative: [] as string[],
				absolute: [] as string[],
			},
		};
	},

	getters: {
		activeElem: function (state): Readonly<CanvasElem> | null {
			if (!state.activeElemId) return null;

			return (
				findElemAndContainer(state.elems, state.activeElemId)?.foundElem ?? null
			);
		},
	},

	actions: {
		addElem: function (type: keyof HTMLElementTagNameMap) {
			const appActionStore = useAppActionStore();
			const elemData = SingleElemDataFactory.getElemData(type as any);

			//createDefault (in canvasElemFactory.ts) now owns all the
			//width/height/attribute-parsing logic internally - this action
			//just gathers the raw defaults/presets and hands them over
			const newElem = createDefault({
				type: type as any,
				defaultText: elemData.defaults.text,
				defaultClasses: elemData.defaults.classes,
				defaultAttributes: elemData.defaults.attributes,
				presetClasses: appActionStore.getSelectedPresetClasses,
				presetCustomStyles: appActionStore.getSelectedPreseCustomStyles,
			});

			//img is the one elem type that needs a real starting size seeded
			//into customStyles at creation - can't rely on a shrink-wrap/class
			//default the way other types can. only fires for THIS new elem,
			//never touches any other existing image on the canvas.
			if (newElem.elemType === "img") {
				newElem.customStyles = newElem.customStyles ?? {};
				newElem.customStyles.width = "100px";
				newElem.customStyles.height = "100px";
			}

			//find whether the newly-created element or any of its children
			//uses position relative/absolute before adding it to the canvas tree
			// findPositionedElemsIds(newElem, this.positionedElemsIds);

			if (this.activeElemId) {
				const activeResult = findElemAndContainer(
					this.elems,
					this.activeElemId
				);

				if (activeResult) {
					if (
						activeResult.foundElem.elemType === "select" &&
						!newElem.elemType.startsWith("opt")
					) {
						console.log("Select can only accept option or optgroup");
						return;
					}

					activeResult.foundElem.children.push(newElem);
					this.activeElemId = newElem.id;
					return;
				}
			}

			//by this point the root elem should have been created and thus
			//i can find it by id being app-root
			const appRoot = this.elems[0];

			if (!appRoot) {
				console.warn("Cannot add element: app-root was not found.");
				return;
			}

			appRoot.children.push(newElem);
			this.activeElemId = newElem.id;
		},

		//places a whole preset tree (card/navbar/footer) onto the canvas -
		//clones the preset via createFromPreset (createClone under the hood),
		//which regenerates every id in the tree recursively, so multiple
		//placements of the same preset never collide on id. same insertion
		//logic as addElem's tail end (into active elem's children, or root)
		addElemFromPreset: function (preset: CanvasElem) {
			const newElem = createFromPreset(preset);

			if (this.activeElemId) {
				const activeResult = findElemAndContainer(
					this.elems,
					this.activeElemId
				);

				if (activeResult) {
					activeResult.foundElem.children.push(newElem);
					this.activeElemId = newElem.id;
					return;
				}
			}

			const appRoot = this.elems[0];

			if (!appRoot) {
				console.warn("Cannot add preset: app-root was not found.");
				return;
			}

			appRoot.children.push(newElem);
			this.activeElemId = newElem.id;
		},

		setActiveElem: function (id: string | null) {
			this.activeElemId = id;
		},

		setCurrentlyDragged: function (draggedElem: HTMLElement | null) {
			this.currentlyDragged = draggedElem;
		},

		setCurrentlyHovered: function (hoveredElem: HTMLElement | null) {
			this.currentlyHovered = hoveredElem;
		},

		setLastEdited: function (elemId: string | null) {
			this.lastEditedId = elemId;
		},

		setIsDragging: function (value: boolean) {
			this.isDragging = value;
		},

		appendToNewParent: function (draggedId: string, parentId: string): boolean {
			return moveElem.appendToNewParent(this.elems, draggedId, parentId);
		},

		unparentElem: function (id: string): boolean {
			return moveElem.unparent(this.elems, id);
		},

		deleteElem: function (id: string) {
			const containingArr = moveElem.remove(this.elems, id);
			if (!containingArr) return;

			if (this.activeElemId === id) {
				this.activeElemId =
					containingArr.length > 0 ? containingArr[0]?.id ?? null : APP_ROOT_ID;
			}

			// //rebuild the positioned element IDs after removing an element
			// this.refreshPositionedElemsIds();
		},

		updateElemClasses: function (id: string, classes: string[]): void {
			updateElem.classes(this.elems, id, classes);

			// //classes may have added or removed the relative/absolute class
			// this.refreshPositionedElemsIds();
		},

		//REPLACES customStyles entirely (not merged) - the caller
		//(InlineStylesTab.vue) always sends the complete, current set of
		//styles built from every row, not just what changed. merging here
		//would mean a deleted style could never actually disappear, since
		//spreading the old object back in would silently restore it.
		updateElemInlineStyles: function (
			id: string,
			customStyles: CanvasElem["customStyles"]
		): void {
			updateElem.inlineStyles(this.elems, id, customStyles);

			//inline styles may have added or removed position: relative/absolute
			// this.refreshPositionedElemsIds();
		},

		updateElemTextContent: function (id: string, textContent: string): void {
			updateElem.textContent(this.elems, id, textContent);
		},

		updateElemCustomId: function (id: string, customId: string): void {
			updateElem.customId(this.elems, id, customId);
		},

		updateElemAttribute: function (
			id: string,
			attrName: string,
			value: string
		): void {
			updateElem.attribute(this.elems, id, attrName, value);
		},

		//called when the user presses U - reuses activeElemId as "which elem is
		//being edited" (so double-clicking also selects), and stores where
		//the modal should appear (usually just below the clicked elem's
		//real on-screen position, measured via getBoundingClientRect at
		//the call site in NewElem.vue)
		openEditModal: function (id: string): void {
			this.activeElemId = id;
			this.isEditModalOpen = true;
		},

		closeEditModal: function (): void {
			this.isEditModalOpen = false;
		},

		duplicateActiveElem: function (): void {
			if (!this.activeElemId) return;

			const clone = moveElem.duplicate(this.elems, this.activeElemId);
			if (!clone) return;

			this.activeElemId = clone.id;
			this.lastEditedId = clone.id;

			//the cloned element may contain position relative/absolute
			// this.refreshPositionedElemsIds();
		},

		//called once per resize, right when the drag ENDS (not during) -
		//createResize.ts mutates width/height directly on every mousemove
		//for speed, bypassing this store entirely while dragging. this is
		//the one real action call that "checks in" with the store once
		//the resize is finished, so $onAction/historyStore can pick it up
		//automatically like any other action - covers EVERY resize, not
		//just the first one on a given elem.
		commitElemSize: function (
			id: string,
			changes: {
				width?: number;
				height?: number;
			}
		): void {
			updateElem.size(this.elems, id, changes);
		},

		//rebuilds both lists from the complete canvas tree so removed
		//positioned elements or elements that no longer have position
		//relative/absolute cannot remain in either array
		refreshPositionedElemsId: function () {
			this.positionedElemsIds = { relative: [], absolute: [] };

			for (const elem of this.elems) {
				findPositionedElemsIds(elem, this.positionedElemsIds);
			}
		},

		//this is used in the inline tab to set bg-image
		setElemBgImageId: function (id: string, imageId: string | null): void {
			updateElem.bgImageId(this.elems, id, imageId);
		},

		moveElemUp: function (): void {
			if (!this.activeElemId) return;

			reorderElem.moveUp(this.elems, this.activeElemId);
		},

		moveElemDown: function (): void {
			if (!this.activeElemId) return;

			reorderElem.moveDown(this.elems, this.activeElemId);
		},
	},
});
