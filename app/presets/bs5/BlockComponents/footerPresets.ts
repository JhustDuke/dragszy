import type { CanvasElem } from "~/types";

//placeholder ids everywhere - createClone regenerates every one of these
//the moment a preset is actually placed, so these values never reach the canvas

//1. Basic footer - simple centered copyright text.
const basicFooterPreset: CanvasElem = {
	id: "preset-footer-basic",
	elemType: "footer",
	textContent: "",
	cssClasses: ["text-center", "p-3", "bg-light"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-footer-basic-text",
			elemType: "p",
			textContent: "© 2026 Your Company. All rights reserved.",
			cssClasses: ["mb-0"],
			props: {},
			customStyles: {},
			children: [],
		},
	],
};

//the ONE public export - keyed by category name, matching
//blockPresets.footer.variant. mirrors cardsPresets.ts / navbarPresets.ts.
export const footerPresets = {
	footer: {
		variant: [{ label: "Basic Footer", preset: basicFooterPreset }],
	},
};
