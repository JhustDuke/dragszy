import type { CanvasElem } from "~/types";
import { normalizer } from "./normalizer";
import type { LibraryImage } from "./normalizer";

const vueCompiler = function () {
	const { buildNormalizedTag, parseHtml } = normalizer();

	const toVueTemplate = function (html: string) {
		const vueOutput = `<template>
    ${html}
 </template>
 
 <script lang="ts" setup>
 </script>
 
 <style scoped>
 </style>
 `;
		return vueOutput;
	};

	/**
	 * Public entry point: takes the raw elems array from the store and
	 * produces a complete .vue file as a string. images is the current
	 * image library snapshot, used to resolve any userImg/userBgImg
	 * references into real relative filenames instead of raw base64.
	 * Each root-level elem is built and serialized independently, then
	 * joined as siblings — no synthetic wrapper tag is introduced, so
	 * the export stays a faithful WYSIWYG match of exactly what's on
	 * the canvas.
	 */
	const createVueFile = function (
		elems: CanvasElem[],
		images: LibraryImage[] = []
	): string {
		const normalizedTags = elems.map(function (elem) {
			return buildNormalizedTag(elem, images);
		});

		const rootSiblingMarkups = normalizedTags.map(function (rootTag) {
			return parseHtml(rootTag, 1);
		});

		const html = rootSiblingMarkups.join("\n");

		return toVueTemplate(html);
	};

	return {
		createVueFile,
	};
};

export { vueCompiler };