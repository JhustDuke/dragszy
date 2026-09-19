import type { CanvasElem } from "~/types";
import { findElemAndContainer } from "./utils";

/**
 * Moves the active element up or down within the array containing it.
 */
export const reorderElem = {
	moveUp(elems: CanvasElem[], activeElemId: string) {
		// find the active elem anywhere in the tree (including nested children)
		// returns the elem itself (foundElem) and the array it sits in (containingArr)
		// e.g. containingArr = [A, B, C], foundElem = C
		const search = findElemAndContainer(elems, activeElemId);

		const containingArr = search?.containingArr;
		const foundElem = search?.foundElem;

		// search can be undefined if the id doesn't exist, so nothing to move
		if (!containingArr || !foundElem) {
			console.error("elem not found or containing array is empty");
			return;
		}

		// position of the active elem inside its own array, e.g. C is at index 2
		const foundElemIndex = containingArr.findIndex(function (elem) {
			return elem.id === activeElemId;
		});

		// index 0 means already first, nowhere to move up to
		if (foundElemIndex <= 0) {
			console.warn("can't move this way");
			return;
		}

		// remove it: [A, B, C] -> [A, B]
		containingArr.splice(foundElemIndex, 1);
		// put it back one spot earlier: [A, B] -> [A, C, B]
		// splice mutates the array in place, so Vue sees the change if elems is reactive
		containingArr.splice(foundElemIndex - 1, 0, foundElem);
	},

	moveDown(elems: CanvasElem[], activeElemId: string) {
		// same lookup as moveUp
		const search = findElemAndContainer(elems, activeElemId);

		const containingArr = search?.containingArr;
		const foundElem = search?.foundElem;

		if (!containingArr || !foundElem) {
			return;
		}

		const foundElemIndex = containingArr.findIndex(function (elem) {
			return elem.id === activeElemId;
		});

		// last index means already at the end, nowhere to move down to
		if (foundElemIndex === containingArr.length - 1) {
			return;
		}

		// remove it: [A, B, C] (A active) -> [B, C]
		containingArr.splice(foundElemIndex, 1);
		// put it back one spot later: [B, C] -> [B, A, C]
		containingArr.splice(foundElemIndex + 1, 0, foundElem);
	},
};
