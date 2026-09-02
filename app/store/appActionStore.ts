import { defineStore } from "pinia";
import type { AppAction, CanvasElem } from "~/types";
import { blockPresetFactory } from "~/presets/bs5";

export const useAppActionStore = defineStore("appAction", {
	state: function () {
		const blockData = blockPresetFactory.blockElemsData();

		return {
			currentAction: "create" as AppAction,
			selectedElemType: "div" as keyof HTMLElementTagNameMap,

			selectedPresetClasses: [] as string[],

			//category is the STRING KEY (e.g. "card"), matching the
			//blockPresets.card.variant shape. variant is the actual
			//staged CanvasElem. defaults to the first real category/
			//variant, same "always a real value" reasoning as
			//selectedElemType defaulting to "div".
			activeBlock: {
				category: blockData.defaultCategory as string | null,
				variant: blockData.defaultVariant as CanvasElem | null,
			},
		};
	},
	getters: {
		getActiveAction: function (state): AppAction {
			return state.currentAction;
		},
		getSelectedElemType: function (state): keyof HTMLElementTagNameMap {
			return state.selectedElemType;
		},
		getSelectedPresetClasses: function (state): string[] {
			return state.selectedPresetClasses;
		},
		getActiveBlock: function (state) {
			return state.activeBlock;
		},
	},
	actions: {
		setActiveAction: function (action: AppAction): void {
			this.currentAction = action;
		},

		setSelectedElemType: function (
			elemType: keyof HTMLElementTagNameMap
		): void {
			this.selectedElemType = elemType;
			this.selectedPresetClasses = [];
		},

		setSelectedPresetClasses: function (classes: string[]): void {
			this.selectedPresetClasses = classes;
		},

		//picking a category changes WHICH VARIANTS are shown, and stages
		//that category's first variant automatically - category and
		//variant always update together, never left out of sync
		setActiveBlockCategory: function (categoryName: string): void {
			this.activeBlock.category = categoryName;
			this.activeBlock.variant =
				blockPresetFactory.getVariants(categoryName)[0]?.preset ?? null;
		},

		//picking a specific variant within the current category - category
		//itself doesn't change, only which variant is staged for placement
		setActiveBlockVariant: function (variant: CanvasElem): void {
			this.activeBlock.variant = variant;
		},
	},
});
