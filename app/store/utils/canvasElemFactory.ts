// CanvasElemFactory.ts

import type { CanvasElem, SupportedElemType } from "~/types";

export interface CreateDefaultInterface {
	type: SupportedElemType;

	defaultText: string;
	defaultClasses: string[];

	defaultAttributes: Record<string, string>;

	presetClasses?: string[];
}

export function createDefault(params: CreateDefaultInterface): CanvasElem {
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

		//always a real object, never undefined - so any code that does
		//elem.customStyles.width = "..." without a fallback check never
		//throws, even for elem types that start with nothing in here
		customStyles: {},
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

		customStyles: source.customStyles ? { ...source.customStyles } : {},

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
