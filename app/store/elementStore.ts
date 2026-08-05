import { defineStore } from "pinia";
import type { CanvasElem, SupportedElemType } from "~/types";
import { useDefaultStore } from "~/store/defaultStore";
import { useAppActionStore } from "~/store";

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

			//img (and any future self-closing elem type) carries its own
			//width/height inside its attributes (e.g. attributes.width = "50"),
			//so use those instead of the generic global default when present.
			//strip any leftover unit text (e.g. "300px") before converting to
			//a number - Number("300px") is NaN, and NaN is not null/undefined
			//so it would silently skip the ?? fallback below and get stuck
			//as NaN forever on this elem
			const attributes = defaultStore.getDefaultsAttrForElemType(
				type as keyof HTMLElementTagNameMap
			);
			const attributeWidth = attributes.width
				? Number(attributes.width.replace(/[^0-9.]/g, ""))
				: null;
			const attributeHeight = attributes.height
				? Number(attributes.height.replace(/[^0-9.]/g, ""))
				: null;

			//if a preset was clicked in the toolbar, its classes take over;
			//otherwise fall back to the elem type's normal default classes
			const presetClasses = appActionStore.getSelectedPresetClasses;
			const cssClasses =
				presetClasses.length > 0
					? presetClasses
					: defaultStore.getDefaultClassesForElemType(type as any);

			const newElem: CanvasElem = {
				id: "dragzy-" + Math.random().toString(36).slice(2, 10),
				elemType: type,
				textContent: defaultStore.getDefaultTextForElemType(type as any),
				cssClasses: cssClasses,
				props: { ...attributes },
				children: [],
				width: attributeWidth ?? defaultStore.getDefaultWidth,
				height: attributeHeight ?? defaultStore.getDefaultHeight,
				widthUnit: defaultStore.getDefaultMeasurementX,
				heightUnit: defaultStore.getDefaultMeasurementY,
			};

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

		//called on double-click - reuses activeElemId as "which elem is
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
