import type { SupportedElemType } from "~/types";
import { buildElemPresets } from "../utils";
import type { Preset } from "../utils";

const twPresets: Partial<Record<SupportedElemType, Preset[]>> = {
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
};

export const tw = buildElemPresets(twPresets);
