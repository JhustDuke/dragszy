import type { CanvasElem } from "~/types";
import { normalizer } from "./normalizer";
import type { LibraryImage } from "./normalizer";
import { createFullHtmlPage } from "./utils";

type HtmlExportOptions = {
	pageType?: "full-page" | "fragment";
	cssFramework: "bs5" | "tw";
	canvasElemsArr: CanvasElem[];
	images: LibraryImage[];
};

export const htmlCompiler = function ({
	canvasElemsArr,
	cssFramework = "bs5",
	images,
	pageType,
}: HtmlExportOptions) {
	const { buildNormalizedTag, parseHtml } = normalizer();

	//this create a real model of what an html looks like
	// adding all the necessary parts of a an html
	//e.g <div class,id style>nested children </div>
	const elemsHtmlModel = canvasElemsArr.map(function (elem) {
		return buildNormalizedTag(elem, images);
	});
	//this turns all the models into a real html string
	const parsedHtmlStrings = elemsHtmlModel.map(function (elem) {
		return parseHtml(elem, 1);
	});

	const finalHtmlString = parsedHtmlStrings.join("\n");

	if (pageType !== "full-page") {
		return finalHtmlString;
	}
	return createFullHtmlPage(finalHtmlString, cssFramework);
};
