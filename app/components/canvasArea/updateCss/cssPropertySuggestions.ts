//a curated, practical list of common CSS properties (camelCase, matching
//how Vue's :style binding and CanvasElem.customStyles both expect them)
//NOTE: this is a runtime array for UI autocomplete only - it exists
//because csstype's Properties type is compile-time-only and vanishes
//once the code actually runs in the browser, so there's nothing to read
//from the type itself to build a dropdown - this list has to be
//hand-maintained separately
export const commonCssProperties: string[] = [
	"display",
	"position",
	"top",
	"right",
	"bottom",
	"left",
	"zIndex",
	"width",
	"height",
	"minWidth",
	"minHeight",
	"maxWidth",
	"maxHeight",
	"margin",
	"marginTop",
	"marginRight",
	"marginBottom",
	"marginLeft",
	"padding",
	"paddingTop",
	"paddingRight",
	"paddingBottom",
	"paddingLeft",
	"backgroundColor",
	"color",
	"fontSize",
	"fontWeight",
	"fontFamily",
	"textAlign",
	"lineHeight",
	"letterSpacing",
	"border",
	"borderWidth",
	"borderColor",
	"borderStyle",
	"borderRadius",
	"boxShadow",
	"opacity",
	"overflow",
	"flexDirection",
	"flexWrap",
	"justifyContent",
	"alignItems",
	"alignSelf",
	"gap",
	"gridTemplateColumns",
	"gridTemplateRows",
	"cursor",
	"transition",
	"transform",
];

//per-property value suggestions - only filled in for properties where a
//short, well-known set of values genuinely covers most real use, so the
//value input can offer a datalist too, not just the property name input.
//properties not listed here (e.g. width, color) just get a plain text
//input with no value suggestions, since their valid values are open-ended
export const cssValueSuggestions: Record<string, string[]> = {
	display: ["block", "inline", "inline-block", "flex", "grid", "none"],
	position: ["static", "relative", "absolute", "fixed", "sticky"],
	textAlign: ["left", "center", "right", "justify"],
	overflow: ["visible", "hidden", "scroll", "auto"],
	flexDirection: ["row", "row-reverse", "column", "column-reverse"],
	flexWrap: ["nowrap", "wrap", "wrap-reverse"],
	justifyContent: [
		"flex-start",
		"flex-end",
		"center",
		"space-between",
		"space-around",
		"space-evenly",
	],
	alignItems: ["stretch", "flex-start", "flex-end", "center", "baseline"],
	alignSelf: ["auto", "stretch", "flex-start", "flex-end", "center"],
	cursor: ["pointer", "default", "text", "move", "not-allowed", "grab"],
	borderStyle: ["none", "solid", "dashed", "dotted", "double"],
	fontWeight: ["normal", "bold", "lighter", "bolder", "400", "600", "700"],
};
