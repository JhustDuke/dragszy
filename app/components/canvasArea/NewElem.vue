<template>
	<div class="container mt-4">
		<div
			class="position-relative border border-dark"
			:style="{
				height: newElemInfo.height + newElemInfo.heightUnit,
				width: newElemInfo.width + newElemInfo.widthUnit,
			}"
			@click="handleElemClick">
			<!-- shows the live width value, centered inside the elem -->
			<span
				v-if="isSelected"
				class="position-absolute top-50 start-50 translate-middle badge black">
				W:{{ activeWidth }}{{ newElemInfo.widthUnit }} <br />
				H:{{ activeHeight }}{{ newElemInfo.heightUnit }}
			</span>

			<template v-if="isSelected">
				<!-- Top -->
				<div
					class="y position-absolute top-0 start-50 translate-middle rounded-circle border border-primary bg-white"
					@mousedown="handleTopMouseDown"></div>

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
					class="x position-absolute top-50 start-0 translate-middle rounded-circle border border-primary bg-white"
					@mousedown="handleLeftMouseDown"></div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore } from "~/store";

	const props = defineProps<{
		newElemInfo: CanvasElem;
	}>();

	const canvasElemsStore = useCanvasElemsStore();

	const isSelected = computed(function () {
		return canvasElemsStore.activeElemId === props.newElemInfo.id;
	});

	// tracks newElemInfo.width live — since width is mutated directly during
	// drag (props.newElemInfo.width = ...), this computed re-evaluates on
	// every mousemove tick automatically, no manual syncing needed
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

	function handleRightMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const dragStartX = event.clientX;
		const initialWidth = props.newElemInfo.width ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			// Moving right increases width.
			// Moving left decreases width.

			const isDraggingTowardsPositiveX = event.clientX > dragStartX;
			const dragDistanceX = Math.abs(event.clientX - dragStartX);

			if (isDraggingTowardsPositiveX) {
				props.newElemInfo.width = initialWidth + dragDistanceX;
				return;
			}

			props.newElemInfo.width = initialWidth - dragDistanceX;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	function handleBottomMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const dragStartY = event.clientY;
		const initialHeight = props.newElemInfo.height ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			// Moving down increases height.
			// Moving up decreases height.

			const isDraggingTowardsPositiveY = event.clientY > dragStartY;
			const dragDistanceY = Math.abs(event.clientY - dragStartY);

			if (isDraggingTowardsPositiveY) {
				props.newElemInfo.height = initialHeight + dragDistanceY;
				return;
			}

			props.newElemInfo.height = initialHeight - dragDistanceY;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	function handleLeftMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const dragStartX = event.clientX;
		const initialWidth = props.newElemInfo.width ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			// Moving right decreases width.
			// Moving left increases width.

			const isDraggingTowardsPositiveX = event.clientX > dragStartX;
			const dragDistanceX = Math.abs(event.clientX - dragStartX);

			if (isDraggingTowardsPositiveX) {
				props.newElemInfo.width = initialWidth - dragDistanceX;
				return;
			}

			props.newElemInfo.width = initialWidth + dragDistanceX;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	function handleTopMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const dragStartY = event.clientY;
		const initialHeight = props.newElemInfo.height ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			// Moving down decreases height.
			// Moving up increases height.

			const isDraggingTowardsPositiveY = event.clientY > dragStartY;
			const dragDistanceY = Math.abs(event.clientY - dragStartY);

			if (isDraggingTowardsPositiveY) {
				props.newElemInfo.height = initialHeight - dragDistanceY;
				return;
			}

			props.newElemInfo.height = initialHeight + dragDistanceY;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
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
