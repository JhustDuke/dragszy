<template>
	<div
		class="grey lighten-3"
		id="dragzy"
		style="height: 100%">
		<nav>
			<ToolBar class="d-none d-md-block d-sm-block" />
		</nav>

		<section
			style="padding-top: 8rem"
			class="">
			<!-- Desktop: unchanged, still the real interactive canvas -->
			<div
				style="min-height: 5000px; max-width: 1400px; margin: 0 auto"
				v-if="viewportStore.activeViewport === 'desktop'"
				class="py-1 px-2"
				dragzy-root
				@dblclick="handleCanvasDblClick">
				<CanvasArea />
			</div>

			<!-- Mobile/Tablet: now a read-only PREVIEW, rendered via iframe
				so Bootstrap's media queries evaluate against the iframe's
				own real width, matching actual browser behavior exactly -
				not a div faking a width. -->
			<div
				v-else
				class="w-100 d-flex align-items-center justify-content-center grey lighten-1"
				style="z-index: 998; min-height: 100vh"
				@click.self="viewportStore.setDesktop()">
				<iframe
					class="green lighten-5 shadow border rounded-3"
					:style="{ width: viewportStore.activeWidth, height: '600px' }"
					:srcdoc="previewHtml"
					sandbox="allow-same-origin"
					title="Responsive preview"></iframe>
			</div>
		</section>
		<RestoreOrNewPrompt />
		<ToggleView />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, watch, computed } from "vue";
	import ToolBar from "./components/toolbar/ToolBar.vue";
	import ToggleView from "./components/toolbar/viewportToggle.vue";
	import CanvasArea from "./components/canvasArea/CanvasArea.vue";
	import RestoreOrNewPrompt from "./components/indexdb/RestorePrompt.vue";
	import { normalizer } from "./compiler/normalizer";

	import {
		useViewportStore,
		useAppActionStore,
		useCanvasElemsStore,
		useCanvasPersistenceStore,
		useImageLibraryStore,
	} from "./store";
	import { useHistoryStore } from "./store/historyStore";

	onMounted(function () {
		historyStore.trackCanvasChanges();
	});

	watch(
		function () {
			return useCanvasPersistenceStore().canvasName;
		},
		function (canvasName) {
			if (!document) return;
			if (canvasName) {
				document.title = `${canvasName} — Dragzy`;
			} else {
				document.title = "dragzy";
			}
		},
		{ immediate: true }
	);

	const viewportStore = useViewportStore();
	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();
	const imageLibraryStore = useImageLibraryStore();

	const historyStore = useHistoryStore();

	//builds a full, standalone HTML document string from the current
	//canvas state - reuses the SAME normalizer/parseHtml pipeline the
	//real compiler already uses, so this preview is a faithful reflection
	//of what would actually export, not a separate guess at markup.
	//images resolve through the library the same way export does, so
	//uploaded pictures show correctly in preview too.
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
						rel="stylesheet"
						href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
				</head>
				<body>
			${bodyMarkup}

			${String(
				'<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><' +
					"/script>"
			)}
				</body>
	</html>`;
	});

	function handleCanvasDblClick(event: MouseEvent): void {
		if (
			appActionStore.getActiveAction !== "create" &&
			appActionStore.getActiveAction !== "components" &&
			appActionStore.getActiveAction !== "imports"
		)
			return;

		const canvasRoot = event.target as HTMLElement;
		if (canvasRoot.hasAttribute("dragzy-root")) {
			canvasElemsStore.setActiveElem(null);
		}

		if (appActionStore.getActiveAction === "components") {
			const stagedVariant = appActionStore.getActiveBlock.variant;
			if (!stagedVariant) return;
			canvasElemsStore.addElemFromPreset(stagedVariant);
			return;
		}

		if (appActionStore.getActiveAction === "imports") {
			const stagedImport = appActionStore.getActiveImportedElem;
			if (!stagedImport) return;
			canvasElemsStore.addElemFromPreset(stagedImport);
			return;
		}

		canvasElemsStore.addElem(appActionStore.getSelectedElemType);
	}
</script>
<style scoped></style>
