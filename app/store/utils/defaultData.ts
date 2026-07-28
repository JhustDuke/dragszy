import type { SupportedElemType } from "~/types";

//starting textContent for each elem type when it's dragged onto the canvas
//e.g. div gets "dragzy-div", form/select/img get "" because they don't show text
export const defaultTextByElemType: Record<SupportedElemType, string> = {
	div: "dragzy-div",
	span: "dragzy-span",
	p: "dragzy-p",
	a: "dragzy-a",
	button: "dragzy-Button",
	ul: "dragzy-ul",
	li: "dragzy-List item",
	form: "",
	label: "dragzy-Label",
	input: "dragzy-input",
	textarea: "dragzy",
	select: "",
	img: "",
	option: "dragzy-Option",
};

//starting BS5 classes for each elem type when it's dragged onto the canvas
//e.g. img-fluid makes the image scale to its container instead of overflowing
export const defaultClassByElemType: Record<SupportedElemType, string[]> = {
	div: [],
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
	option: [],
	img: ["img-fluid "],
};

//which props each elem type is allowed to have
//e.g. img can have src/alt/width/height, a can only have href
export const attrByElemType: Record<SupportedElemType, string[]> = {
	img: ["src", "alt", "width", "height"],
	div: [],
	span: [],
	p: [],
	a: ["href"],
	button: ["type"],
	ul: [],
	li: [],
	form: ["action", "method"],
	label: ["for"],
	input: ["type", "placeholder", "name"],
	textarea: ["placeholder", "name"],
	select: ["name"],
	option: ["value"],
};

//builds a fresh props object for every elem type, all values blank ("")
//img is the ONE exception: it gets a real src/width/height so it doesn't show
//as a broken image the moment it's dropped on the canvas
export function buildEmptyPropsByElemType(): Record<
	string,
	Record<string, string>
> {
	const result: Record<string, Record<string, string>> = {};

	for (const elemType in attrByElemType) {
		const keys = attrByElemType[elemType as keyof typeof attrByElemType] ?? [];
		const props: Record<string, string> = {};

		for (const key of keys) {
			//everything defaults to blank...
			props[key] = "";
		}

		//...except img, which needs real values or it renders broken
		if (elemType === "img") {
			props.src = "/dragzy.jpg";
			props.alt = "dragzy-image";
		}

		result[elemType] = props;
	}

	return result;
}
