import { defineStore } from "pinia";
import type { AppAction } from "~/types";

export const useAppActionStore = defineStore("appAction", {
	state: function () {
		return {
			currentAction: "create" as AppAction,
			selectedElemType: "div" as keyof HTMLElementTagNameMap,
		};
	},

	getters: {
		getActiveAction: function (state): AppAction {
			return state.currentAction;
		},
		getSelectedElemType: function (state): keyof HTMLElementTagNameMap {
			return state.selectedElemType;
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
		},
	},
});
