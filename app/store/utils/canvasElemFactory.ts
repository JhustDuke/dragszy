// CanvasElemFactory.ts

import type { CanvasElem, SupportedElemType } from "~/types";

export interface CreateDefaultInterface {
	type: SupportedElemType;

	defaultText: string;
	defaultClasses: string[];

	defaultAttributes: Record<string, string>;

	defaultWidth: number;
	defaultHeight: number;

	defaultWidthUnit: CanvasElem["widthUnit"];
	defaultHeightUnit: CanvasElem["heightUnit"];

	presetClasses?: string[];
}

export function createDefault(params: CreateDefaultInterface): CanvasElem {
	const attributeWidth = params.defaultAttributes.width
		? Number(params.defaultAttributes.width.replace(/[^0-9.]/g, ""))
		: null;

	const attributeHeight = params.defaultAttributes.height
		? Number(params.defaultAttributes.height.replace(/[^0-9.]/g, ""))
		: null;

	return {
		id: generateId(),

		elemType: params.type,

		textContent: params.defaultText,

		cssClasses:
			params.presetClasses && params.presetClasses.length > 0
				? [...params.presetClasses]
				: [...params.defaultClasses],

		props: {
			...params.defaultAttributes,
		},

		children: [],

		width: attributeWidth ?? params.defaultWidth,

		height: attributeHeight ?? params.defaultHeight,

		widthUnit: params.defaultWidthUnit,

		heightUnit: params.defaultHeightUnit,
	};
}

export function createClone(source: CanvasElem): CanvasElem {
	return {
		...source,

		id: generateId(),

		cssClasses: source.cssClasses ? [...source.cssClasses] : [],

		props: {
			...source.props,
		},

		customStyles: source.customStyles ? { ...source.customStyles } : undefined,

		children: source.children.map(function (child) {
			return createClone(child);
		}),
	};
}

export function createFromJson(source: CanvasElem): CanvasElem {
	return createClone(source);
}

export function createFromPreset(preset: CanvasElem): CanvasElem {
	return createClone(preset);
}

export function generateId(): string {
	return "dragzy-" + Math.random().toString(36).slice(2, 10);
}
