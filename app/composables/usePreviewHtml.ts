import { computed } from "vue";
import { normalizer } from "~/compiler/normalizer";
import { useCanvasElemsStore, useImageLibraryStore } from "~/store";

//builds a full, standalone HTML document string from the current
//canvas state - reuses the SAME normalizer/parseHtml pipeline the
//real compiler already uses, so this preview is a faithful reflection
//of what would actually export, not a separate guess at markup.
//images resolve through the library the same way export does, so
//uploaded pictures show correctly in preview too.
export function usePreviewHtml() {
	const canvasElemsStore = useCanvasElemsStore();
	const imageLibraryStore = useImageLibraryStore();

	const previewHtml = computed(function () {
		const { buildNormalizedTag, parseHtml } = normalizer();

		const normalizedTags = canvasElemsStore.elems.map(function (elem) {
			return buildNormalizedTag(elem, imageLibraryStore.getImages);
		});

		const bodyMarkup = normalizedTags
			.map(function (tag) {
				return parseHtml(tag, 0);
			})
			.join("\n");

		//Bootstrap's CDN link included so classes actually render - adjust
		//the version/link if your project pins a specific Bootstrap build
		return `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link
			href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
			rel="stylesheet" />
		<link
			href="https://cdn.jsdelivr.net/npm/materializecss-colors-alone@0.1.0/colors.css"
			rel="stylesheet" />

		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
	</head>
	<body>
		${bodyMarkup}
	</body>
</html>`;
	});

	return {
		previewHtml,
	};
}
