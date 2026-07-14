<template>
	<!-- App root: toolbar + canvas + viewport toggle -->
	<div class="grey lighten-3 min-vh-100">
		<ToolBar />

		<!-- Desktop: full width, no backdrop -->
		<div
			v-if="viewportStore.activeViewport === 'desktop'"
			class="canvas-viewport">
			<CanvasArea />
		</div>

		<!-- Mobile/Tablet: backdrop + boxed preview, click backdrop to exit -->
		<div
			v-else
			class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
			style="
				background: rgba(0, 0, 0, 0.5);
				z-index: 998;
				scrollbar-width: none;
			"
			@click.self="viewportStore.setDesktop()">
			<!-- Preview box: bordered, scrollable, fixed height so surrounding backdrop stays visible -->
			<div
				class="bg-white shadow border p-1 overflow-y-scroll rounded-3"
				:style="{ width: viewportStore.activeWidth, height: '600px' }">
				<CanvasArea />
			</div>
		</div>

		<ToggleView />
	</div>
</template>

<script setup lang="ts">
	// @ts-ignore
	import ToolBar from "./components/toolbar/Toolbar.vue";
	import ToggleView from "./components/viewportToggle.vue";
	import CanvasArea from "./components/canvasArea/CanvasArea.vue";

	import { useViewportStore } from "./store";

	// Controls which layout renders: desktop vs boxed mobile/tablet preview
	const viewportStore = useViewportStore();
</script>
<style scoped></style>
