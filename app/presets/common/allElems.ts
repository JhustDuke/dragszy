import type { SupportedElemType } from "~/types";

export type ElemStruc = {
	text: string;
	classes: string[];
	attrs: string[];
};

export type DefaultStruc = Record<SupportedElemType, ElemStruc>;

export const allElems: DefaultStruc = {
	div: {
		text: "",
		classes: [],
		attrs: [],
	},

	span: {
		text: "dragzy-span",
		classes: [],
		attrs: [],
	},

	p: {
		text: "dragzy-p",
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
		text: "",
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
		text: "dragzy",
		classes: [],
		attrs: ["placeholder", "name"],
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
};
export type AllElemType = keyof typeof allElems;
