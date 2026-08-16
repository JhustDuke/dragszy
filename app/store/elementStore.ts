import { defineStore } from "pinia";
import type { CanvasElem, SupportedElemType } from "~/types";
import { useDefaultStore } from "~/store/defaultStore";
import { useAppActionStore } from "~/store";
import { createDefault, createClone } from "./utils/canvasElemFactory";

export const useCanvasElemsStore = defineStore("canvasElems", {
	state: function () {
		return {
			lastEditedId: null as string | null,
			elems: [] as CanvasElem[],
			currentlyDragged: null as HTMLElement | null,
			currentlyHovered: null as HTMLElement | null,
			activeElemId: null as string | null,
			isDragging: false as boolean,
			//where the double-click edit modal should appear - null means
			//the modal isn't open. reuses activeElemId as "which elem is
			//being edited", so double-clicking an elem also selects it
			editModalPosition: null as { top: number; left: number } | null,
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
		addElem: function (type: keyof HTMLElementTagNameMap = "div") {
			const defaultStore = useDefaultStore();
			const appActionStore = useAppActionStore();

			//createDefault (in canvasElemFactory.ts) now owns all the
			//width/height/attribute-parsing logic internally - this action
			//just gathers the raw defaults/presets and hands them over
			const newElem = createDefault({
				type: type as any,
				defaultText: defaultStore.getDefaultTextForElemType(type as any),
				defaultClasses: defaultStore.getDefaultClassesForElemType(type as any),
				defaultAttributes: defaultStore.getDefaultsAttrForElemType(
					type as keyof HTMLElementTagNameMap
				),
				defaultWidth: defaultStore.getDefaultWidth,
				defaultHeight: defaultStore.getDefaultHeight,
				defaultWidthUnit: defaultStore.getDefaultMeasurementX,
				defaultHeightUnit: defaultStore.getDefaultMeasurementY,
				presetClasses: appActionStore.getSelectedPresetClasses,
			});

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
		},

		updateElemClasses: function (id: string, classes: string[]): void {
			const result = findElemAndContainer(this.elems, id);
			if (!result) return;

			result.elem.cssClasses = classes;
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

		//called when the user presses U - reuses activeElemId as "which elem is
		//being edited" (so double-clicking also selects), and stores where
		//the modal should appear (usually just below the clicked elem's
		//real on-screen position, measured via getBoundingClientRect at
		//the call site in NewElem.vue)
		openEditModal: function (
			id: string,
			position: { top: number; left: number }
		): void {
			this.activeElemId = id;
			this.editModalPosition = position;
		},

		closeEditModal: function (): void {
			this.editModalPosition = null;
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
	},
});

function findElemAndContainer(
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
}

function containsChild(parent: CanvasElem, childId: string): boolean {
	for (const child of parent.children) {
		if (child.id === childId) {
			return true;
		}

		if (containsChild(child, childId)) {
			return true;
		}
	}

	return false;
}
