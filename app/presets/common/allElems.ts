import type { SupportedElemType } from "~/types";

export type ElemStruc = {
	text: string;
	classes: string[];
	attrs: string[];
};

export type DefaultStruc = Record<SupportedElemType, ElemStruc>;

/**
 * this is the default struc of all elems
 * DON'T ADD CLASSES HERE
 * ADD CLASSES IN THE DEFAULT CLASS FILE
 * text and attr alone are needed here
 */
export const allElems: DefaultStruc = {
	div: {
		text: "",
		classes: [],
		attrs: [],
	},

	span: {
		text: "span",
		classes: [],
		attrs: [],
	},

	p: {
		text: "dragzy-p this can be removed by selecting and pressing U",
		classes: [],
		attrs: [],
	},

	a: {
		text: "dragzy-a",
		classes: [],
		attrs: ["href"],
	},

	button: {
		text: "dragzy-Button",
		classes: [],
		attrs: ["type"],
	},

	ul: {
		text: "",
		classes: [],
		attrs: [],
	},

	li: {
		text: "dragzy-li",
		classes: [],
		attrs: [],
	},

	form: {
		text: "",
		classes: [],
		attrs: ["action", "method"],
	},

	label: {
		text: "dragzy-Label",
		classes: [],
		attrs: ["for"],
	},

	input: {
		text: "dragzy-input",
		classes: [],
		attrs: ["type", "placeholder", "name"],
	},

	textarea: {
		text: "",
		classes: [],
		attrs: ["name", "placeholder", "rows", "cols", "maxlength", "minlength"],
	},

	select: {
		text: "",
		classes: [],
		attrs: ["name"],
	},

	img: {
		text: "",
		classes: [],
		attrs: ["src", "alt", "width", "height"],
	},

	option: {
		text: "dragzy-Option",
		classes: [],
		attrs: ["value"],
	},
	h1: {
		text: "Heading 1",
		classes: [],
		attrs: [],
	},

	h2: {
		text: "Heading 2",
		classes: [],
		attrs: [],
	},

	h3: {
		text: "Heading 3",
		classes: [],
		attrs: [],
	},

	h4: {
		text: "Heading 4",
		classes: [],
		attrs: [],
	},

	h5: {
		text: "Heading 5",
		classes: [],
		attrs: [],
	},

	h6: {
		text: "Heading 6",
		classes: [],
		attrs: [],
	},
};
export type AllElemType = keyof typeof allElems;
