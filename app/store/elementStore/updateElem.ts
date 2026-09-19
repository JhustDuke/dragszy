import type { CanvasElem } from "~/types";
import { findElemAndContainer } from "./utils";

export const updateElem = {
	classes: function (elems: CanvasElem[], id: string, classes: string[]): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		result.foundElem.cssClasses = classes;
	},

	//REPLACES customStyles entirely (not merged) - the caller
	//(InlineStylesTab.vue) always sends the complete, current set of
	//styles built from every row, not just what changed. merging here
	//would mean a deleted style could never actually disappear, since
	//spreading the old object back in would silently restore it.
	inlineStyles: function (
		elems: CanvasElem[],
		id: string,
		customStyles: CanvasElem["customStyles"]
	): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		result.foundElem.customStyles = customStyles;
	},

	textContent: function (
		elems: CanvasElem[],
		id: string,
		textContent: string
	): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		result.foundElem.textContent = textContent;
	},

	customId: function (elems: CanvasElem[], id: string, customId: string): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		result.foundElem.customId = customId;
	},

	attribute: function (
		elems: CanvasElem[],
		id: string,
		attrName: string,
		value: string
	): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		result.foundElem.props = result.foundElem.props ?? {};
		result.foundElem.props[attrName] = value;
	},

	size: function (
		elems: CanvasElem[],
		id: string,
		changes: {
			width?: number;
			height?: number;
			isWidthAdjusted?: boolean;
			isHeightAdjusted?: boolean;
		}
	): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		Object.assign(result.foundElem, changes);
	},

	//this is used in the inline tab to set bg-image
	bgImageId: function (
		elems: CanvasElem[],
		id: string,
		imageId: string | null
	): void {
		const result = findElemAndContainer(elems, id);
		if (!result) return;

		result.foundElem.userBgImg = imageId ?? undefined;
	},
};
