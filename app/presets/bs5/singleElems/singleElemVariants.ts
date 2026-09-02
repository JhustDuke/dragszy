import { buildSingleElemPresets } from "../../utils";

export const bootstrapElemVariants = buildSingleElemPresets({
	div: [
		{ label: "Centered", classes: ["mx-auto"] },
		{ label: "Container", classes: ["container"] },
		{ label: "Card", classes: ["card", "p-3"] },
		{ label: "Aside", classes: ["aside", "p-3"] },
	],

	form: [
		{
			label: "Inline",
			classes: ["row", "row-cols-lg-auto", "g-3", "align-items-center"],
		},
		{ label: "Bordered", classes: ["border", "rounded", "p-3"] },
	],

	img: [
		{ label: "Fluid", classes: ["img-fluid"] },
		{ label: "Rounded", classes: ["img-fluid", "rounded-circle"] },
		{ label: "Thumbnail", classes: ["img-fluid", "img-thumbnail"] },
		{ label: "Shadow", classes: ["img-fluid", "shadow"] },
	],
});
