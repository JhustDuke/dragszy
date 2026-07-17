<template>
	<!-- App root: toolbar + canvas + viewport toggle -->
	<div class="grey lighten-3">
		<nav>
			<ToolBar />
		</nav>

		<section>
			<!-- Desktop: full width, no backdrop -->
			<div
				v-if="viewportStore.activeViewport === 'desktop'"
				class="min-vh-100"
				:style="{
					paddingLeft: defaultNudgeStore.getDefaultPaddingX + 'px',
					paddingRight: defaultNudgeStore.getDefaultPaddingX + 'px',
					paddingTop: defaultNudgeStore.getDefaultPaddingY + 'px',
					paddingBottom: defaultNudgeStore.getDefaultPaddingY + 'px',
					marginLeft: defaultNudgeStore.getDefaultMarginX + 'px',
					marginRight: defaultNudgeStore.getDefaultMarginX + 'px',
					marginTop: defaultNudgeStore.getDefaultMarginY + 'px',
					marginBottom: defaultNudgeStore.getDefaultMarginY + 'px',
				}"
				@dblclick="handleCanvasDblClick">
				<CanvasArea />
			</div>

			<!-- Mobile/Tablet: backdrop + boxed preview, click backdrop to exit -->
			<div
				v-else
				class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
				style="background: rgba(0, 0, 0, 0.5); z-index: 998"
				@click.self="viewportStore.setDesktop()">
				<!-- Preview box: bordered, scrollable, fixed height so surrounding backdrop stays visible -->
				<div
					class="white green lighten-5 shadow border rounded-3 overflow-auto"
					:style="{ width: viewportStore.activeWidth, height: '600px' }"
					@dblclick="handleCanvasDblClick">
					<CanvasArea />
				</div>
			</div>
		</section>

		<ToggleView />
	</div>
</template>

<script setup lang="ts">
	// @ts-ignore
	import ToolBar from "./components/toolbar/Toolbar.vue";
	import ToggleView from "./components/viewportToggle.vue";
	import CanvasArea from "./components/canvasArea/CanvasArea.vue";

	import {
		useViewportStore,
		useAppActionStore,
		useCanvasElemsStore,
		useDefaultNudgeStore,
	} from "./store";

	// Controls which layout renders: desktop vs boxed mobile/tablet preview
	const viewportStore = useViewportStore();
	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();
	const defaultNudgeStore = useDefaultNudgeStore();

	function handleCanvasDblClick(): void {
		if (appActionStore.getActiveAction !== "create") return;
		canvasElemsStore.addElem();
	}
</script>
<style scoped></style>
