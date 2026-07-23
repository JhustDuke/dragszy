import { defineStore } from "pinia";
import type { CanvasElem } from "~/types";
import { useDefaultNudgeStore } from "~/store/defaultStore";

export const useCanvasElemsStore = defineStore("canvasElems", {
	state: function () {
		return {
			lastEditedId: null as string | null,
			elems: [] as CanvasElem[],
			currentlyDragged: null as HTMLElement | null,
			currentlyHovered: null as HTMLElement | null,
			activeElemId: null as string | null,
			isDragging: false as boolean,
		};
	},
	getters: {
		activeElem: function (state) {
			return (
				state.elems.find(function (elem) {
					return elem.id === state.activeElemId;
				}) ?? null
			);
		},
	},
	actions: {
		addElem: function (type: keyof HTMLElementTagNameMap = "div") {
			const defaultNudgeStore = useDefaultNudgeStore();

			const newElem: CanvasElem = {
				id: Math.random().toString(36).slice(2, 10),
				elemType: type,
				children: [],
				width: defaultNudgeStore.getDefaultWidth,
				height: defaultNudgeStore.getDefaultHeight,
				widthUnit: defaultNudgeStore.getDefaultMeasurementX,
				heightUnit: defaultNudgeStore.getDefaultMeasurementY,
			};

			this.elems.push(newElem);
			this.activeElemId = newElem.id;
		},

		setActiveElem: function (id: string | null) {
			this.activeElemId = id;
		},

		updateElemWidthOrHeight: function (
			changes: Partial<Pick<CanvasElem, "width" | "height">>
		): void {
			if (!this.activeElem) return;

			Object.assign(this.activeElem, changes);
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
