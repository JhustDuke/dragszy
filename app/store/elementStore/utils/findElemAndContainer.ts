import type { CanvasElem } from "~/types";

export const findElemAndContainer = function (
	elems: CanvasElem[],
	id: string
): { foundElem: CanvasElem; containingArr: CanvasElem[] } | null {
	for (const elem of elems) {
		if (elem.id === id) {
			return {
				foundElem: elem,
				containingArr: elems,
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
