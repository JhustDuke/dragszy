import type { CanvasElem } from "~/types";
export interface Preset {
	label: string;
	classes: string[];
}

export interface BlockPresetVariant {
	label: string;
	preset: CanvasElem;
}

//keyed by category name directly - e.g. blockPresets.card.variant
//no separate "category" field needed inside, since the key IS the name
export interface BlockPresets {
	[category: string]: {
		variant: BlockPresetVariant[];
	};
}
