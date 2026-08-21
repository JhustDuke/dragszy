// utils/tooltip.ts
import { addElemToDom } from "./addElemToDom";

const TOOLTIP_ID = "active-tooltip";
const TOOLTIP_DURATION = 1500;

interface ToolTipPosition {
	left?: number;
	right?: number;
	top?: number;
	bottom?: number;
}

const DEFAULT_POSITION: ToolTipPosition = {
	left: 0,
	right: 0,
	top: -30,
	bottom: 0,
};

/**
 * Shows a tooltip above the currently hovered element.
 *
 * Position values are pixel adjustments.
 *
 * Example:
 * showAndHideToolTip("Rectangle tool");
 *
 * showAndHideToolTip("Rectangle tool", {
 *     left: -20,
 *     top: -40,
 * });
 */
export function showAndHideToolTip(
	tip: string,
	position: ToolTipPosition = DEFAULT_POSITION
): void {
	document.getElementById(TOOLTIP_ID)?.remove();

	const finalPosition = {
		...DEFAULT_POSITION,
		...position,
	};

	addElemToDom({
		typeOfElem: "div",
		textContent: tip,
		elemAttributes: {
			id: TOOLTIP_ID,
			class: "position-fixed black white-text small px-2 py-1 rounded",
			style: "z-index:2000; pointer-events:none; max-width:200px;",
		},
		pluginFunc: function (parentElem: HTMLElement, newElem: HTMLElement) {
			const hoveredChain = document.querySelectorAll(":hover");
			const targetElem = hoveredChain[hoveredChain.length - 1] as HTMLElement;

			if (targetElem) {
				const rect = targetElem.getBoundingClientRect();

				newElem.style.left =
					rect.left + rect.width / 2 + (finalPosition.left ?? 0) + "px";

				newElem.style.top = rect.top + (finalPosition.top ?? 0) + "px";

				newElem.style.transform = "translateX(-50%)";
			}

			setTimeout(function () {
				newElem.remove();
			}, TOOLTIP_DURATION);
		},
	});
}
