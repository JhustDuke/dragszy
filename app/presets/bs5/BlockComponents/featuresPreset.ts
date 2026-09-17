import type { CanvasElem } from "~/types";

//placeholder ids everywhere - createClone regenerates every one of these

//the moment a preset is actually placed, so these values never reach the canvas

//1. Features grid - 3-across icon, title, text blocks. "Why choose us" style section.

const featuresGridPreset: CanvasElem = {
	id: "preset-features-grid",
	elemType: "div",
	textContent: "",
	cssClasses: [
		"d-flex",
		"flex-column",
		"flex-md-row",
		"gap-4",
		"py-5",
		"px-3",
		"w-100",
	],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-features-grid-item-1",
			elemType: "div",
			textContent: "",
			cssClasses: ["text-center", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-features-grid-item-1-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-bolt", "fa-2x", "text-primary", "mb-3"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-features-grid-item-1-title",
					elemType: "h5",
					textContent: "Fast",
					cssClasses: ["fw-bold"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-features-grid-item-1-text",
					elemType: "p",
					textContent:
						"A short line describing this feature and why it matters.",
					cssClasses: ["text-muted", "small"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-features-grid-item-2",
			elemType: "div",
			textContent: "",
			cssClasses: ["text-center", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-features-grid-item-2-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-shield", "fa-2x", "text-primary", "mb-3"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-features-grid-item-2-title",
					elemType: "h5",
					textContent: "Secure",
					cssClasses: ["fw-bold"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-features-grid-item-2-text",
					elemType: "p",
					textContent:
						"A short line describing this feature and why it matters.",
					cssClasses: ["text-muted", "small"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
		{
			id: "preset-features-grid-item-3",
			elemType: "div",
			textContent: "",
			cssClasses: ["text-center", "flex-fill"],
			props: {},
			customStyles: { minWidth: "0" },
			children: [
				{
					id: "preset-features-grid-item-3-icon",
					elemType: "span",
					textContent: "",
					cssClasses: ["fa", "fa-heart", "fa-2x", "text-primary", "mb-3"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-features-grid-item-3-title",
					elemType: "h5",
					textContent: "Reliable",
					cssClasses: ["fw-bold"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-features-grid-item-3-text",
					elemType: "p",
					textContent:
						"A short line describing this feature and why it matters.",
					cssClasses: ["text-muted", "small"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

export const featuresPresets = {
	features: {
		variant: [
			{
				label: "Features Grid — 3 Icon, Title & Text Blocks",
				preset: featuresGridPreset,
			},
		],
	},
};
