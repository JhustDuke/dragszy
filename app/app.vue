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
	import { usePreviewHtml } from "./composables";

	import {
		useViewportStore,
		useAppActionStore,
		useCanvasElemsStore,
		useCanvasPersistenceStore,
		useHistoryStore,
	} from "./store";

	const { previewHtml } = usePreviewHtml();

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

	const historyStore = useHistoryStore();

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
