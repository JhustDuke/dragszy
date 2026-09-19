import type { CanvasElem } from "~/types";

export const APP_ROOT_ID = "app-root";

export const containsChild = function (
	parent: CanvasElem,
	childId: string
): boolean {
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
