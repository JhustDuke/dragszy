// utils/tooltip.ts
import { addElemToDom } from "./addElemToDom";

const TOOLTIP_ID = "active-tooltip";
const TOOLTIP_DURATION = 1500; // ms before auto-hide

/**
 * Shows a tooltip with the given text, auto-positioned above
 * whatever element is currently hovered, and auto-hides after
 * TOOLTIP_DURATION. No event needs to be passed in - call as
 * showAndHideToolTip('Rectangle tool').
 */
export function showAndHideToolTip(tip: string): void {
	// remove any existing tooltip first (fast mouse movement guard)
	document.getElementById(TOOLTIP_ID)?.remove();

	addElemToDom({
		typeOfElem: "div",
		textContent: tip,
		elemAttributes: {
			id: TOOLTIP_ID,
			class: "position-fixed black white-text small px-2 py-1 rounded",
			style: "z-index:2000; pointer-events:none;max-width:200px;",
		},
		pluginFunc: function (parentElem: HTMLElement, newElem: HTMLElement) {
			// traverse to whatever element is currently hovered -
			// last entry is the deepest (actual icon/button hovered)
			const hoveredChain = document.querySelectorAll(":hover");
			const targetElem = hoveredChain[hoveredChain.length - 1] as HTMLElement;

			if (targetElem) {
				const rect = targetElem.getBoundingClientRect();
				newElem.style.left = rect.left + rect.width / 2 + "px";
				newElem.style.top = rect.top - 30 + "px";
				newElem.style.transform = "translateX(-50%)";
			}

			// auto-hide
			setTimeout(function () {
				newElem.remove();
			}, TOOLTIP_DURATION);
		},
	});
}
