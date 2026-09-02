import type { CanvasElem } from "~/types";

//placeholder ids everywhere - createClone regenerates every one of these
//the moment a preset is actually placed, so these values never reach the canvas

//1. Basic navbar - brand text + two nav links, minimal BS5 navbar.
const basicNavbarPreset: CanvasElem = {
	id: "preset-navbar-basic",
	elemType: "nav",
	textContent: "",
	cssClasses: ["navbar", "navbar-expand-lg", "navbar-light", "bg-light"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-navbar-basic-brand",
			elemType: "a",
			textContent: "Brand",
			cssClasses: ["navbar-brand"],
			props: { href: "#" },
			customStyles: {},
			children: [],
		},
		{
			id: "preset-navbar-basic-links",
			elemType: "div",
			textContent: "",
			cssClasses: ["d-flex", "gap-3"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-navbar-basic-link1",
					elemType: "a",
					textContent: "Home",
					cssClasses: ["nav-link"],
					props: { href: "#" },
					customStyles: {},
					children: [],
				},
				{
					id: "preset-navbar-basic-link2",
					elemType: "a",
					textContent: "About",
					cssClasses: ["nav-link"],
					props: { href: "#" },
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//the ONE public export - keyed by category name, matching
//blockPresets.navbar.variant. mirrors cardsPresets.ts exactly.
export const navbarPresets = {
	navbar: {
		variant: [{ label: "Basic Navbar", preset: basicNavbarPreset }],
	},
};
