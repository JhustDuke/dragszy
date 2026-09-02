import { blockPresets as cardBlockPresets } from "./cardsPresets";
import { navbarPresets } from "./navbarPresets";
import { footerPresets } from "./footerPresets";
import type { BlockPresetVariant, BlockPresets } from "~/presets/types";

const blockPresets: BlockPresets = {
	...cardBlockPresets,
	...navbarPresets,
	...footerPresets,
};

export const blockPresetFactory = (function () {
	const categoryNames = Object.keys(blockPresets);
	const defaultCategory = categoryNames[0] ?? null;
	const defaultVariant = defaultCategory
		? blockPresets[defaultCategory]?.variant[0]?.preset ?? null
		: null;

	const blockElemsData = function () {
		return {
			presets: blockPresets,
			categoryNames,
			defaultCategory,
			defaultVariant,
		};
	};

	const getVariants = function (categoryName: string): BlockPresetVariant[] {
		return blockPresets[categoryName]?.variant ?? [];
	};

	return { blockElemsData, getVariants };
})();
