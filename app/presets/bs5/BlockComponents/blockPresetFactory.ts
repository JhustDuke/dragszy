import { blockPresets } from "./cardsPresets";
import type { BlockPresetVariant } from "~/presets/types";
import type { CanvasElem } from "~/types";

export const blockPresetFactory = (function () {
	const categoryNames = Object.keys(blockPresets);
	const defaultCategory = categoryNames[0] ?? null;
	const defaultVariant = defaultCategory
		? blockPresets[defaultCategory]?.variant[0]?.preset ?? null
		: null;

	//everything that doesn't need an argument - one call, bundled,
	//same "one call in, everything out" idea as elemDataFactory's
	//getElemData
	const blockElemsData = function () {
		return {
			presets: blockPresets,
			categoryNames,
			defaultCategory,
			defaultVariant,
		};
	};

	//the one thing that genuinely needs an argument - stays separate,
	//same reasoning as getElemData(type) taking a type argument
	const getVariants = function (categoryName: string): BlockPresetVariant[] {
		return blockPresets[categoryName]?.variant ?? [];
	};

	return { blockElemsData, getVariants };
})();
