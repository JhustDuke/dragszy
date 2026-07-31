import { defineStore } from "pinia";
import {
	defaultTextByElemType,
	defaultClassByElemType,
	buildEmptyAttrs,
} from "./utils/defaultData";
import type { SupportedElemType, supportedElemTypes } from "~/types";

type Measurement = "%" | "px";

export const useDefaultStore = defineStore("defaultStore", {
	state: function () {
		return {
			defaultNudgeX: 0,
			defaultNudgeY: 0,

			defaultMeasurementX: "px" as Measurement,
			defaultMeasurementY: "px" as Measurement,

			defaultWidth: 100,
			defaultHeight: 100,

			defaultPaddingX: 8,
			defaultPaddingY: 8,

			defaultMarginX: 8,
			defaultMarginY: 8,

			defaultTextByElemType: {
				...defaultTextByElemType,
			},

			defaultClassByElemType: {
				...defaultClassByElemType,
			},

			defaultPropsByElemType: buildEmptyAttrs(),
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

		getDefaultPaddingX: function (state): number {
			return state.defaultPaddingX;
		},

		getDefaultPaddingY: function (state): number {
			return state.defaultPaddingY;
		},

		getDefaultMarginX: function (state): number {
			return state.defaultMarginX;
		},

		getDefaultMarginY: function (state): number {
			return state.defaultMarginY;
		},
		getDefaultTextForElemType: function (state) {
			return function (
				elemType: keyof typeof state.defaultTextByElemType
			): string {
				return state.defaultTextByElemType[elemType] ?? "";
			};
		},

		getDefaultClassesForElemType: function (state) {
			return function (
				elemType: keyof typeof state.defaultTextByElemType
			): string[] {
				return state.defaultClassByElemType[elemType] ?? [];
			};
		},

		getDefaultsAttrForElemType: function (state) {
			return function (elemType: string): Record<string, string> {
				return state.defaultPropsByElemType[elemType] ?? {};
			};
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

		setDefaultPaddingX: function (value: number): void {
			this.defaultPaddingX = value;
		},

		setDefaultPaddingY: function (value: number): void {
			this.defaultPaddingY = value;
		},

		setDefaultMarginX: function (value: number): void {
			this.defaultMarginX = value;
		},

		setDefaultMarginY: function (value: number): void {
			this.defaultMarginY = value;
		},

		setDefaultTextForElemType: function (
			elemType: keyof typeof defaultTextByElemType,
			value: string
		): void {
			this.defaultTextByElemType[elemType] = value;
		},

		setDefaultClassesForElemType: function (
			elemType: keyof typeof defaultClassByElemType,
			classes: string[]
		): void {
			this.defaultClassByElemType[elemType] = classes;
		},

		setDefaultPropForElemType: function (
			elemType: string,
			propKey: string,
			value: string
		): void {
			if (!this.defaultPropsByElemType[elemType]) {
				this.defaultPropsByElemType[elemType] = {};
			}

			this.defaultPropsByElemType[elemType][propKey] = value;
		},
	},
});
