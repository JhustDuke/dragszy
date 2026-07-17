<template>
	<div
		class="position-relative border border-dark my-2"
		:style="{
			height: newElemInfo.height + newElemInfo.heightUnit,
			width: newElemInfo.width + newElemInfo.widthUnit,
		}"
		@click="handleElemClick">
		<!-- Width and height badge -->
		<span
			v-if="isSelected"
			class="position-absolute top-50 start-50 translate-middle badge bg-dark">
			w:{{ activeWidth }}{{ newElemInfo.widthUnit }} h:{{ activeHeight
			}}{{ newElemInfo.heightUnit }}
		</span>

		<template v-if="isSelected">
			<!-- Top -->
			<button
				class="y position-absolute top-0 start-50 translate-middle rounded-circle border border-primary bg-white"
				@mousedown="resize.top"></button>

			<!-- Right -->
			<button
				class="x position-absolute top-50 start-100 translate-middle rounded-circle border border-primary bg-white"
				@mousedown="resize.right"></button>

			<!-- Bottom -->
			<button
				class="y position-absolute top-100 start-50 translate-middle rounded-circle border border-primary bg-white"
				@mousedown="resize.bottom"></button>

			<!-- Left -->
			<button
				class="x position-absolute top-50 start-0 translate-middle rounded-circle border border-primary bg-white"
				@mousedown="resize.left"></button>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore, useAppActionStore } from "~/store";
	import { createResize } from "~/utils";

	const props = defineProps<{
		newElemInfo: CanvasElem;
	}>();

	const canvasElemsStore = useCanvasElemsStore();
	const appActionStore = useAppActionStore();

	const resize = createResize(props.newElemInfo, {
		shouldStart: function (): boolean {
			return appActionStore.getActiveAction === "resize";
		},
	});

	const isSelected = computed(function () {
		return canvasElemsStore.activeElemId === props.newElemInfo.id;
	});

	const activeWidth = computed(function () {
		return props.newElemInfo.width ?? 0;
	});

	const activeHeight = computed(function () {
		return props.newElemInfo.height ?? 0;
	});

	function handleElemClick(event: MouseEvent): void {
		event.stopPropagation();
		canvasElemsStore.setActiveElem(props.newElemInfo.id);
	}
</script>

<style scoped>
	.x {
		width: 14px;
		height: 14px;
		cursor: ew-resize;
	}

	.y {
		width: 14px;
		height: 14px;
		cursor: ns-resize;
	}
</style>
