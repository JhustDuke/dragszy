//pulls the COMPLETE, always-accurate list of CSS properties directly from
//the browser itself - no hand-maintained list to forget entries on, no
//external dependency needed. getComputedStyle on any element returns
//every CSS property the running browser recognizes (hundreds of them),
//and it updates itself automatically as browsers add new CSS features.
//converted from kebab-case (background-image) to camelCase
//(backgroundImage) to match how customStyles/Vue's :style expect keys.
function kebabToCamelCase(property: string): string {
	return property.replace(/-([a-z])/g, function (_, letter) {
		return letter.toUpperCase();
	});
}

//LAZY on purpose - getComputedStyle/document only exist in the browser.
//Computing this as a module-level constant would run it the instant this
//file is imported, which can happen during Nuxt's server-side render
//(no "document" yet there) and throw "getComputedStyle is not defined".
//calling this function only when actually needed (e.g. when the Inline
//Styles tab mounts) guarantees it only ever runs client-side.
let cachedCssProperties: string[] | null = null;

export function getCommonCssProperties(): string[] {
	if (cachedCssProperties) return cachedCssProperties;

	cachedCssProperties = Array.from(getComputedStyle(document.documentElement))
		//skip vendor-prefixed properties (-webkit-, -moz-, etc.) - noisy
		//and rarely what someone wants to autocomplete to
		.filter(function (property) {
			return !property.startsWith("-");
		})
		.map(kebabToCamelCase)
		.sort();

	return cachedCssProperties;
}

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
