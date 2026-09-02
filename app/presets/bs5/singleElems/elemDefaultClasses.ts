import { allElems, type AllElemType } from "../../common";

//keyed directly off allElems - if allElems gains or loses an elem type,
//this object breaks at compile time until every key is accounted for.
//no separate SupportedElemType import, so there's only one place
//(allElems) that defines what elem types exist at all
export const defaultClasses: Record<AllElemType, string[]> = {
	div: [
		"d-flex",
		"container-fluid green ",
		"p-3 ",
		"justify-content-between",
		"my-2",
		"border",
		"border-dark",
	],
	span: [],
	p: [],
	a: ["link-primary"],
	button: ["btn", "btn-primary"],
	ul: ["list-group"],
	li: ["list-group-item"],
	form: [],
	label: ["form-label"],
	input: ["form-control"],
	textarea: ["form-control"],
	select: ["form-select"],
	img: ["img-fluid "],
	option: [],
};
