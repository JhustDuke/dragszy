import { defineStore } from "pinia";

type Measurement = "%" | "px";

const defaultTextByElemType: Record<string, string> = {
	div: "",
	span: "Text",
	p: "Paragraph text",
	a: "Link",
	button: "Button",
	ul: "",
	li: "List item",
	form: "",
	label: "Label",
	input: "",
	textarea: "",
	select: "",
	option: "Option",
};

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
			} as Record<string, string>,

			defaultClassByElemType: {
				...defaultClassByElemType,
			} as Record<string, string[]>,

			defaultPropsByElemType: buildEmptyPropsByElemType() as Record<
				string,
				Record<string, string>
			>,
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
			return function (elemType: string): string {
				return state.defaultTextByElemType[elemType] ?? "";
			};
		},

		getDefaultClassesForElemType: function (state) {
			return function (elemType: string): string[] {
				return state.defaultClassByElemType[elemType] ?? [];
			};
		},

		getDefaultPropsForElemType: function (state) {
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
			elemType: string,
			value: string
		): void {
			this.defaultTextByElemType[elemType] = value;
		},

		setDefaultClassesForElemType: function (
			elemType: string,
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

const defaultClassByElemType: Record<string, string[]> = {
	div: [],
	span: [],
	p: [],
	a: ["link-primary"],
	button: ["btn", "btn-primary"],
	ul: ["list-group"],
	li: ["list-group-item"],
	form: [],
	label: ["form-label"],
	input: ["form-control"],
	textarea: ["form-control"],
	select: ["form-select"],
	option: [],
};

export const propSchemaByElemType: Record<string, string[]> = {
	div: [],
	span: [],
	p: [],
	a: ["href"],
	button: ["type"],
	ul: [],
	li: [],
	form: ["action", "method"],
	label: ["for"],
	input: ["type", "placeholder", "name"],
	textarea: ["placeholder", "name"],
	select: ["name"],
	option: ["value"],
};

function buildEmptyPropsByElemType(): Record<string, Record<string, string>> {
	const result: Record<string, Record<string, string>> = {};

	for (const elemType in propSchemaByElemType) {
		const keys = propSchemaByElemType[elemType] ?? [];
		const props: Record<string, string> = {};

		for (const key of keys) {
			props[key] = "";
		}

		result[elemType] = props;
	}

	return result;
}
