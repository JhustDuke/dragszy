import { defineStore } from "pinia";
import type { SupportedElemType } from "~/types";
import { frameworkPresets } from "./utils/presets";
import type { StylingFramework, Preset } from "./utils/presets";

export const usePresetStore = defineStore("presetStore", {
	state: function () {
		return {
			framework: "bs5" as StylingFramework,
			frameworkPresets,
		};
	},

	getters: {
		getPresets: function (state) {
			return function (
				elemType: SupportedElemType,
				framework?: StylingFramework
			): Preset[] {
				const targetFramework = framework ?? state.framework;

				return state.frameworkPresets[targetFramework][elemType];
			};
		},
	},

	actions: {
		setFramework: function (framework: StylingFramework): void {
			this.framework = framework;
		},
	},
});
