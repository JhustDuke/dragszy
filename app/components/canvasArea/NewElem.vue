<template>
	<div class="container mt-4">
		<div
			class="position-relative border border-dark"
			:style="{
				height: nodeInfo.height + nodeInfo.heightUnit,
				width: nodeInfo.width + nodeInfo.widthUnit,
			}"
			@click="handleElemClick">
			<template v-if="isSelected">
				<!-- Top -->
				<div
					class="y position-absolute top-0 start-50 translate-middle rounded-circle border border-primary bg-white"></div>

				<!-- Right -->
				<div
					class="x position-absolute top-50 start-100 translate-middle rounded-circle border border-primary bg-white"
					@mousedown="handleRightMouseDown"></div>

				<!-- Bottom -->
				<div
					class="y position-absolute top-100 start-50 translate-middle rounded-circle border border-primary bg-white"
					@mousedown="handleBottomMouseDown"></div>

				<!-- Left -->
				<div
					class="x position-absolute top-50 start-0 translate-middle rounded-circle border border-primary bg-white"></div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore } from "~/store";

	const props = defineProps<{
		nodeInfo: CanvasElem;
	}>();

	const canvasElemsStore = useCanvasElemsStore();

	const isSelected = computed(function () {
		return canvasElemsStore.activeElemId === props.nodeInfo.id;
	});

	function handleElemClick(event: MouseEvent): void {
		event.stopPropagation();
		canvasElemsStore.setActiveElem(props.nodeInfo.id);
	}

	function handleRightMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const startX = event.clientX;
		const startWidth = props.nodeInfo.width ?? 0;

		function handleMouseMove(event: MouseEvent): void {
			const deltaX = event.clientX - startX;

			props.nodeInfo.width = startWidth + deltaX;
		}

		function handleMouseUp(): void {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	}

	function handleBottomMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const startY = event.clientY;
		const startHeight = props.nodeInfo.height ?? 0;

		function handleMouseMove(event: MouseEvent): void {
			const deltaY = event.clientY - startY;

			props.nodeInfo.height = startHeight + deltaY;
		}

		function handleMouseUp(): void {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
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
