import type { CanvasElem } from "~/types";
import { createClone } from "./utils/canvasElemFactory";
import { findElemAndContainer, containsChild, APP_ROOT_ID } from "./utils";

export const dragMethod = {
	appendToNewParent: function (
		elems: CanvasElem[],
		draggedId: string,
		parentId: string
	): boolean {
		if (draggedId === parentId) return false;

		//app-root is the permanent canvas root and cannot itself
		//be moved into another element.
		if (draggedId === APP_ROOT_ID) return false;

		const draggedResult = findElemAndContainer(elems, draggedId);
		if (!draggedResult) return false;

		const parentResult = findElemAndContainer(elems, parentId);
		if (!parentResult) return false;

		if (
			parentResult.foundElem.elemType === "select" &&
			!draggedResult.foundElem.elemType.startsWith("opt")
		) {
			console.log("Select can only accept option or optgroup");
			return false;
		}

		// Prevent creating circular trees.
		if (containsChild(draggedResult.foundElem, parentId)) return false;

		const draggedIndex = draggedResult.containingArr.findIndex(function (elem) {
			return elem.id === draggedId;
		});

		if (draggedIndex === -1) return false;

		const draggedElem = draggedResult.containingArr.splice(draggedIndex, 1)[0];

		if (!draggedElem) return false;

		parentResult.foundElem.children.push(draggedElem);
		return true;
	},

	unparent: function (elems: CanvasElem[], id: string): boolean {
		//app-root is already the permanent top-level container
		//and can never be unparented.
		if (id === APP_ROOT_ID) return false;

		const result = findElemAndContainer(elems, id);
		if (!result) return false;

		//already a direct child of app-root, so there is nowhere
		//higher in the canvas tree to move it.
		const appRoot = findElemAndContainer(elems, APP_ROOT_ID);

		if (!appRoot) return false;

		if (result.containingArr === appRoot.foundElem.children) return false;

		const index = result.containingArr.findIndex(function (elem) {
			return elem.id === id;
		});

		if (index === -1) return false;

		const movedElem = result.containingArr.splice(index, 1)[0];

		if (!movedElem) return false;

		appRoot.foundElem.children.push(movedElem);
		return true;
	},

	//returns the array the elem was removed from (the store needs it to
	//pick the next active elem), or null if nothing was deleted
	remove: function (elems: CanvasElem[], id: string): CanvasElem[] | null {
		//app-root is the permanent canvas root and cannot be deleted.
		if (id === APP_ROOT_ID) {
			elems[0]!.children = [];
			console.log("clearing canvas");
			return null;
		}

		const result = findElemAndContainer(elems, id);
		if (!result) return null;

		const index = result.containingArr.findIndex(function (elem) {
			return elem.id === id;
		});

		if (index === -1) return null;

		result.containingArr.splice(index, 1);
		return result.containingArr;
	},

	//returns the new clone so the store can make it the active elem,
	//or null if nothing was duplicated
	duplicate: function (elems: CanvasElem[], id: string): CanvasElem | null {
		const result = findElemAndContainer(elems, id);

		if (!result) return null;

		//app-root is structural and must never be duplicated.
		if (result.foundElem.id === APP_ROOT_ID) return null;

		const clone = createClone(result.foundElem);

		const index = result.containingArr.findIndex(function (elem) {
			return elem.id === result.foundElem.id;
		});

		if (index === -1) return null;

		result.containingArr.splice(index + 1, 0, clone);

		return clone;
	},
};
