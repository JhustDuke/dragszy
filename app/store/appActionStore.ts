import { defineStore } from "pinia";
import type { AppAction } from "~/types";

export const useAppActionStore = defineStore("appAction", {
	state: function () {
		return {
			currentAction: "create" as AppAction,
		};
	},

	getters: {
		getActiveAction: function (state): AppAction {
			return state.currentAction;
		},
	},

	actions: {
		setActiveAction: function (action: AppAction): void {
			this.currentAction = action;
		},
	},
});
