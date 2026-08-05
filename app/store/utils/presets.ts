import { supportedElemTypes } from "~/types";
import type { SupportedElemType } from "~/types";

export type StylingFramework = "bs5" | "tailwind";

export interface Preset {
	label: string;
	classes: string[];
}

type ElemPresets = Record<SupportedElemType, Preset[]>;

//fills in every SupportedElemType with an empty preset list first, then
//layers the given overrides on top - so each framework below only has to
//list the elem types that actually HAVE presets, instead of repeating
//every elem type with "[]" twice (once per framework)
//e.g. buildElemPresets({ div: [...], img: [...] })
//  -> { div: [...], img: [...], span: [], p: [], a: [], ...everything else: [] }
function buildElemPresets(overrides: Partial<ElemPresets>): ElemPresets {
	const base = {} as ElemPresets;

	for (const elemType of supportedElemTypes) {
		base[elemType] = overrides[elemType] ?? [];
	}

	return base;
}

const frameworkPresets: Record<StylingFramework, ElemPresets> = {
	bs5: buildElemPresets({
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
	}),

	tailwind: buildElemPresets({
		div: [
			{ label: "Centered", classes: ["mx-auto"] },
			{ label: "Container", classes: ["max-w-screen-lg", "mx-auto"] },
			{ label: "Card", classes: ["rounded-lg", "shadow", "p-4"] },
			{ label: "Aside", classes: ["p-4"] },
		],

		form: [
			{
				label: "Inline",
				classes: ["flex", "flex-wrap", "items-center", "gap-3"],
			},
			{ label: "Bordered", classes: ["border", "rounded", "p-4"] },
		],

		img: [
			{ label: "Fluid", classes: ["w-full"] },
			{ label: "Rounded", classes: ["w-full", "rounded-full"] },
			{ label: "Thumbnail", classes: ["w-full", "border", "p-1"] },
			{ label: "Shadow", classes: ["w-full", "shadow"] },
		],
	}),
};

export { frameworkPresets };
