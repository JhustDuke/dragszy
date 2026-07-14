import { defineStore } from "pinia";

type Measurement = "%" | "px";

export const useDefaultNudgeStore = defineStore("defaultNudge", {
	state: function () {
		return {
			defaultNudgeX: 0,
			defaultNudgeY: 0,
			defaultMeasurementX: "px" as Measurement,
			defaultMeasurementY: "px" as Measurement,
			defaultWidth: 100,
			defaultHeight: 100,
		};
	},

	getters: {
		getDefaultNudgeX: function (state): number {
			return state.defaultNudgeX;
		},

		getDefaultNudgeY: function (state): number {
			return state.defaultNudgeY;
		},

		getDefaultMeasurementX: function (state): Measurement {
			return state.defaultMeasurementX;
		},

		getDefaultMeasurementY: function (state): Measurement {
			return state.defaultMeasurementY;
		},

		getDefaultWidth: function (state): number {
			return state.defaultWidth;
		},

		getDefaultHeight: function (state): number {
			return state.defaultHeight;
		},
	},

	actions: {
		setDefaultNudgeX: function (value: number): void {
			this.defaultNudgeX = value;
		},

		setDefaultNudgeY: function (value: number): void {
			this.defaultNudgeY = value;
		},

		setDefaultMeasurementX: function (value: Measurement): void {
			this.defaultMeasurementX = value;
		},

		setDefaultMeasurementY: function (value: Measurement): void {
			this.defaultMeasurementY = value;
		},

		setDefaultWidth: function (value: number): void {
			this.defaultWidth = value;
		},

		setDefaultHeight: function (value: number): void {
			this.defaultHeight = value;
		},
	},
});
