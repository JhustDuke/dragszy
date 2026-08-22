<template>
	<!-- App root: toolbar + canvas + viewport toggle -->
	<div
		class="grey lighten-3"
		id="dragzy"
		style="height: 100%">
		<nav>
			<ToolBar />
		</nav>

		<section
			style="padding-top: 8rem"
			class="">
			<!-- Desktop: full width, no backdrop -->
			<div
				style="min-height: 5000px"
				v-if="viewportStore.activeViewport === 'desktop'"
				class="py-1 px-2"
				dragzy-root
				@dblclick="handleCanvasDblClick">
				<CanvasArea />
			</div>

			<!-- Mobile/Tablet: backdrop + boxed preview, click backdrop to exit -->
			<div
				v-else
				class="w-100 d-flex align-items-center justify-content-center grey lighten-1"
				style="z-index: 998; min-height: 100vh"
				@click.self="viewportStore.setDesktop()">
				<!-- Preview box: bordered, scrollable, fixed height so surrounding backdrop stays visible -->
				<div
					class="green lighten-5 shadow border rounded-3 overflow-auto"
					:style="{ width: viewportStore.activeWidth, height: '600px' }"
					dragzy-root
					@dblclick="handleCanvasDblClick">
					<CanvasArea />
				</div>
			</div>
		</section>
		<RestoreOrNewPrompt />
		<ToggleView />
	</div>
</template>

<script setup lang="ts">
	// @ts-ignore
	import { onMounted, watch } from "vue";
	import ToolBar from "./components/toolbar/ToolBar.vue";
	import ToggleView from "./components/viewportToggle.vue";
	import CanvasArea from "./components/canvasArea/CanvasArea.vue";
	import RestoreOrNewPrompt from "./components/indexdb/RestorePrompt.vue";

	import {
		useViewportStore,
		useAppActionStore,
		useCanvasElemsStore,
		useCanvasPersistenceStore,
	} from "./store";
	import { useHistoryStore } from "./store/historyStore";

	//App.vue is the actual root, mounted exactly once for the app's
	//lifetime - the correct, single place to start watching
	//canvasElemsStore for history tracking
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

	// Controls which layout renders: desktop vs boxed mobile/tablet preview
	const viewportStore = useViewportStore();
	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();

	const historyStore = useHistoryStore();

	function handleCanvasDblClick(event: MouseEvent): void {
		if (appActionStore.getActiveAction !== "create") return;

		const canvasRoot = event.target as HTMLElement;

		if (canvasRoot.hasAttribute("dragzy-root")) {
			canvasElemsStore.setActiveElem(null);
		}

		canvasElemsStore.addElem(appActionStore.getSelectedElemType);
	}
</script>
<style scoped></style>
