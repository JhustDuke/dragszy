import { defineStore } from "pinia";
import type { AppAction, CanvasElem } from "~/types";

export const useAppActionStore = defineStore("appAction", {
	state: function () {
		return {
			currentAction: "create" as AppAction,
			selectedElemType: "div" as keyof HTMLElementTagNameMap,

			//classes from a clicked SINGLE-elem preset (e.g. "Card" ->
			//["card", "p-3"]) - empty array means no preset picked, the
			//elem type's normal default classes get used instead
			selectedPresetClasses: [] as string[],

			//a full BLOCK preset tree (navbar/card/footer etc.) staged for
			//placement - null means no block preset picked, double-click
			//falls back to the normal selectedElemType + selectedPresetClasses
			//flow instead. mutually exclusive with selectedPresetClasses:
			//only one placement mode is ever "armed" at a time.
			selectedBlockPreset: null as CanvasElem | null,
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
		getSelectedBlockPreset: function (state): CanvasElem | null {
			return state.selectedBlockPreset;
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

			//switching elem type clears any single-elem preset picked for
			//the PREVIOUS type - otherwise e.g. div's "Card" classes could
			//accidentally carry over onto a newly selected img
			this.selectedPresetClasses = [];

			//also clears any staged BLOCK preset - picking a bare elem
			//type means the user is now in "create a plain elem" mode,
			//not "place a whole component" mode
			this.selectedBlockPreset = null;
		},

		setSelectedPresetClasses: function (classes: string[]): void {
			this.selectedPresetClasses = classes;

			//picking a single-elem preset means we're NOT placing a block
			//preset anymore - clear it so double-click doesn't accidentally
			//place a stale block preset instead of this elem type
			this.selectedBlockPreset = null;
		},

		//called when the user picks a block component (navbar/card/footer)
		//from the block presets panel - stages the WHOLE tree for the next
		//double-click to place, via addElemFromPreset instead of addElem
		setSelectedBlockPreset: function (preset: CanvasElem | null): void {
			this.selectedBlockPreset = preset;

			//mutually exclusive with the single-elem preset path - staging
			//a block preset means any previously-picked single-elem preset
			//classes are no longer relevant
			this.selectedPresetClasses = [];
		},
	},
});
