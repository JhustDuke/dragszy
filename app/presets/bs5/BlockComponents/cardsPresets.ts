import type { CanvasElem } from "~/types";
import type { BlockPresets } from "~/presets/types";
//placeholder ids everywhere - createClone regenerates every one of these
//the moment a preset is actually placed, so these values never reach the canvas

//1. Basic card - title, text, one button. The default "just a card" option.
const basicCardPreset: CanvasElem = {
	id: "preset-card-basic",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "p-3"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-card-basic-title",
			elemType: "h5",
			textContent: "Card title",
			cssClasses: ["card-title"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-card-basic-text",
			elemType: "p",
			textContent:
				"Some quick example text to build on the card title and make up the bulk of the card's content.",
			cssClasses: ["card-text"],
			props: {},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-card-basic-btn",
			elemType: "button",
			textContent: "Go somewhere",
			cssClasses: ["btn", "btn-primary"],
			props: {},
			customStyles: {},
			children: [],
		},
	],
};

//2. Image-top card - img above title/text, common "product/blog" card shape.
const imageTopCardPreset: CanvasElem = {
	id: "preset-card-imgtop",
	elemType: "div",
	textContent: "",
	cssClasses: ["card"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-card-imgtop-img",
			elemType: "img",
			textContent: "",
			cssClasses: ["card-img-top"],
			props: {
				src: "https://via.placeholder.com/400x200",
				alt: "Card image",
			},
			customStyles: {},
			children: [],
		},
		{
			id: "preset-card-imgtop-body",
			elemType: "div",
			textContent: "",
			cssClasses: ["card-body"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-card-imgtop-title",
					elemType: "h5",
					textContent: "Card title",
					cssClasses: ["card-title"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-card-imgtop-text",
					elemType: "p",
					textContent:
						"Some quick example text to build on the card title and make up the bulk of the card's content.",
					cssClasses: ["card-text"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//3. Horizontal card - img beside content, side-by-side using flex utilities.
const horizontalCardPreset: CanvasElem = {
	id: "preset-card-horizontal",
	elemType: "div",
	textContent: "",
	cssClasses: ["card", "d-flex", "flex-row"],
	props: {},
	customStyles: {},
	children: [
		{
			id: "preset-card-horizontal-img",
			elemType: "img",
			textContent: "",
			cssClasses: ["img-fluid"],
			props: {
				src: "https://via.placeholder.com/150",
				alt: "Card image",
			},
			customStyles: { width: "150px", height: "auto" },
			children: [],
		},
		{
			id: "preset-card-horizontal-body",
			elemType: "div",
			textContent: "",
			cssClasses: ["card-body"],
			props: {},
			customStyles: {},
			children: [
				{
					id: "preset-card-horizontal-title",
					elemType: "h5",
					textContent: "Card title",
					cssClasses: ["card-title"],
					props: {},
					customStyles: {},
					children: [],
				},
				{
					id: "preset-card-horizontal-text",
					elemType: "p",
					textContent:
						"This is a wider card with supporting text alongside a custom image.",
					cssClasses: ["card-text"],
					props: {},
					customStyles: {},
					children: [],
				},
			],
		},
	],
};

//the ONE public export for cards, keyed by category name
export const blockPresets: BlockPresets = {
	card: {
		variant: [
			{ label: "Basic Card", preset: basicCardPreset },
			{ label: "Image Top Card", preset: imageTopCardPreset },
			{ label: "Horizontal Card", preset: horizontalCardPreset },
		],
	},
};
