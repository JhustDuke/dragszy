import type { CanvasElem } from "~/types";

export const findPositionedElemsIds = function (
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
