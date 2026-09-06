import { defineStore } from "pinia";
import type { CanvasElem } from "~/types";

import { useAppActionStore } from "~/store";
import {
	createDefault,
	createClone,
	createFromPreset,
} from "./utils/canvasElemFactory";
import { elemDataFactory } from "~/presets/bs5";

export const useCanvasElemsStore = defineStore("canvasElems", {
	state: function () {
		return {
			lastEditedId: null as string | null,
			elems: [] as CanvasElem[],
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
		activeElem: function (state) {
			if (!state.activeElemId) return null;

			return (
				findElemAndContainer(state.elems, state.activeElemId)?.elem ?? null
			);
		},
	},
	actions: {
		addElem: function (type: keyof HTMLElementTagNameMap) {
			const appActionStore = useAppActionStore();
			const elemData = elemDataFactory.getElemData(type as any);
			//createDefault (in canvasElemFactory.ts) now owns all the
			//width/height/attribute-parsing logic internally - this action
			//just gathers the raw defaults/presets and hands them over
			const newElem = createDefault({
				type: type as any,
				defaultText: elemData.defaults.text,
				defaultClasses: elemData.defaults.classes,
				defaultAttributes: elemData.defaults.attributes,
				presetClasses: appActionStore.getSelectedPresetClasses,
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
					activeResult.elem.children.push(newElem);
					this.activeElemId = newElem.id;
					return;
				}
			}

			this.elems.push(newElem);
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
					activeResult.elem.children.push(newElem);
					this.activeElemId = newElem.id;
					return;
				}
			}

			this.elems.push(newElem);
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
			if (draggedId === parentId) return false;

			const draggedResult = findElemAndContainer(this.elems, draggedId);
			if (!draggedResult) return false;

			const parentResult = findElemAndContainer(this.elems, parentId);
			if (!parentResult) return false;

			// Prevent creating circular trees.
			if (containsChild(draggedResult.elem, parentId)) return false;

			const draggedIndex = draggedResult.container.findIndex(function (elem) {
				return elem.id === draggedId;
			});

			if (draggedIndex === -1) return false;

			const draggedElem = draggedResult.container.splice(draggedIndex, 1)[0];

			if (!draggedElem) return false;

			parentResult.elem.children.push(draggedElem);
			return true;
		},

		unparentElem: function (id: string): boolean {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return false;

			// already top-level, nothing to do
			if (result.container === this.elems) return false;

			const index = result.container.findIndex(function (elem) {
				return elem.id === id;
			});

			if (index === -1) return false;

			const movedElem = result.container.splice(index, 1)[0];

			if (!movedElem) return false;

			this.elems.push(movedElem);
			return true;
		},

		deleteElem: function (id: string) {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			const index = result.container.findIndex(function (elem) {
				return elem.id === id;
			});

			if (index === -1) return;

			result.container.splice(index, 1);

			if (this.activeElemId === id) {
				this.activeElemId =
					result.container.length > 0 ? result.container[0]?.id ?? null : null;
			}

			// //rebuild the positioned element IDs after removing an element
			// this.refreshPositionedElemsIds();
		},

		updateElemClasses: function (id: string, classes: string[]): void {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			result.elem.cssClasses = classes;

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
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			result.elem.customStyles = customStyles;

			//inline styles may have added or removed position: relative/absolute
			// this.refreshPositionedElemsIds();
		},

		updateElemTextContent: function (id: string, textContent: string): void {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			result.elem.textContent = textContent;
		},

		updateElemCustomId: function (id: string, customId: string): void {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			result.elem.customId = customId;
		},

		//this is used in the inline tab to set bg-image
		setElemBgImageId: function (id: string, imageId: string | null): void {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			result.elem.userBgImg = imageId ?? undefined;
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

			const result = findElemAndContainer(this.elems, this.activeElemId);

			if (!result) return;

			const clone = createClone(result.elem);

			const index = result.container.findIndex(function (elem) {
				return elem.id === result.elem.id;
			});

			if (index === -1) return;

			result.container.splice(index + 1, 0, clone);

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
				isWidthAdjusted?: boolean;
				isHeightAdjusted?: boolean;
			}
		): void {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			Object.assign(result.elem, changes);
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
	},
});

const findPositionedElemsIds = function (
	elem: CanvasElem,
	ids: { relative: string[]; absolute: string[] }
) {
	// Bootstrap 5 uses "position-relative"/"position-absolute".
	// Tailwind uses "relative"/"absolute".
	// Keep both checks here so Absolute-To works regardless of
	// which framework is currently active.
	if (
		elem.cssClasses?.includes("position-relative") ||
		elem.cssClasses?.includes("relative")
	) {
		ids.relative.push(elem.id);
	}

	if (
		elem.cssClasses?.includes("position-absolute") ||
		elem.cssClasses?.includes("absolute")
	) {
		ids.absolute.push(elem.id);
	}

	// An inline style with position: relative/absolute should also count,
	// regardless of the active framework.
	if (elem.customStyles?.position === "relative") {
		ids.relative.push(elem.id);
	}

	if (elem.customStyles?.position === "absolute") {
		ids.absolute.push(elem.id);
	}

	// Check nested children because a positioned element can exist
	// anywhere inside the canvas element tree.
	for (const child of elem.children) {
		findPositionedElemsIds(child, ids);
	}
};

const findElemAndContainer = function (
	elems: CanvasElem[],
	id: string
): { elem: CanvasElem; container: CanvasElem[] } | null {
	for (const elem of elems) {
		if (elem.id === id) {
			return {
				elem: elem,
				container: elems,
			};
		}

		if (elem.children.length > 0) {
			const found = findElemAndContainer(elem.children, id);

			if (found) {
				return found;
			}
		}
	}

	return null;
};

const containsChild = function (parent: CanvasElem, childId: string): boolean {
	for (const child of parent.children) {
		if (child.id === childId) {
			return true;
		}

		if (containsChild(child, childId)) {
			return true;
		}
	}

	return false;
};
