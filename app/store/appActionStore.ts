import { defineStore } from "pinia";
import type { AppAction } from "~/types";

export const useAppActionStore = defineStore("appAction", {
	state: function () {
		return {
			currentAction: "create" as AppAction,
			selectedElemType: "div" as keyof HTMLElementTagNameMap,
			//classes from a clicked preset (e.g. "Card" -> ["card", "p-3"])
			//empty array means no preset picked - the elem type's normal
			//default classes get used instead when it's created
			selectedPresetClasses: [] as string[],
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
	},

	actions: {
		setActiveAction: function (action: AppAction): void {
			this.currentAction = action;
		},
		setSelectedElemType: function (
			elemType: keyof HTMLElementTagNameMap
		): void {
			this.selectedElemType = elemType;
			//switching elem type clears any preset picked for the PREVIOUS
			//type - otherwise e.g. div's "Card" classes could accidentally
			//carry over onto a newly selected img
			this.selectedPresetClasses = [];
		},
		setSelectedPresetClasses: function (classes: string[]): void {
			this.selectedPresetClasses = classes;
		},
	},
});
