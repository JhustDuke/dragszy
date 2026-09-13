// utils/tooltip.ts
import { addElemToDom } from "./addElemToDom";

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
const TOOLTIP_ID = "active-tooltip";
const TOOLTIP_DELAY = 500;

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

export function showAndHideToolTip(
	tip: string,
	position: ToolTipPosition = DEFAULT_POSITION
): void {
	const hoveredChain = document.querySelectorAll(":hover");
	const targetElem = hoveredChain[hoveredChain.length - 1] as HTMLElement;

	if (!targetElem) {
		return;
	}

	const finalPosition = {
		...DEFAULT_POSITION,
		...position,
	};

	let tooltipTimer: ReturnType<typeof setTimeout>;

	function removeToolTip(): void {
		clearTimeout(tooltipTimer);
		document.getElementById(TOOLTIP_ID)?.remove();
		targetElem.removeEventListener("mouseleave", removeToolTip);
	}

	tooltipTimer = setTimeout(function () {
		if (!targetElem.matches(":hover")) {
			return;
		}

		document.getElementById(TOOLTIP_ID)?.remove();

		addElemToDom({
			typeOfElem: "div",
			textContent: tip,
			elemAttributes: {
				id: TOOLTIP_ID,
				class: "position-fixed black white-text small px-2 py-1 rounded",
				style: "z-index:2000; pointer-events:none; max-width:200px;",
			},
			pluginFunc: function (parentElem: HTMLElement, newElem: HTMLElement) {
				const rect = targetElem.getBoundingClientRect();

				newElem.style.left =
					rect.left + rect.width / 2 + (finalPosition.left ?? 0) + "px";

				newElem.style.top = rect.top + (finalPosition.top ?? 0) + "px";

				newElem.style.transform = "translateX(-50%)";
			},
		});
	}, TOOLTIP_DELAY);

	targetElem.addEventListener("mouseleave", removeToolTip);
}
