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
		text: "dragzy-div this can be removed by selecting and pressing U",
		classes: [],
		attrs: [],
	},

	span: {
		text: "dragzy-span this can be removed by selecting and pressing U",
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
		text: "dragzy-1",
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
		text: "dragzy-text area this can be removed by selecting and pressing U and some ONLY TEXT WORKS HERE IT CAN'T CARRY CHILDREN",
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
