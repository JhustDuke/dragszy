<template>
	<div
		ref="elemRef"
		class="position-relative border border-dark my-2"
		:class="{ 'border border-3': isHoveredWhileDragging }"
		:style="{
			height: newElemInfo.height + newElemInfo.heightUnit,
			width: newElemInfo.width + newElemInfo.widthUnit,
		}"
		@mousemove="dragging"
		@mousedown="dragStarted"
		@click="handleElemClick">
		<!-- Width and height badge -->
		<small
			v-if="isSelected"
			class="position-absolute top-50 start-50 translate-middle badge bg-dark">
			w:{{ activeWidth }}{{ newElemInfo.widthUnit }} h:{{ activeHeight
			}}{{ newElemInfo.heightUnit }}
		</small>

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
	import { computed, ref } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore, useAppActionStore } from "../../store";
	import { createResize } from "../../utils";

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

	const elemRef = ref<HTMLElement | null>(null);

	const isHoveredWhileDragging = computed(function () {
		return canvasElemsStore.currentlyHovered === elemRef.value;
	});

	// now add a button after a br in the div which when clicks deletes the elem and removes all reference of it from the store too and if it was the currently selected give it to the next elem in the elems array or leave it empty if elems array is empt

	function handleElemClick(event: MouseEvent): void {
		event.stopPropagation();

		canvasElemsStore.setActiveElem(props.newElemInfo.id);
	}

	const dragStarted = function (ev: MouseEvent) {
		ev.preventDefault();
		const elem = ev.currentTarget as HTMLElement;
		canvasElemsStore.setCurrentlyDragged(elem);
	};

	const dragging = function (ev: MouseEvent) {
		if (!canvasElemsStore.currentlyDragged) return;
		const elem = ev.currentTarget as HTMLElement;

		if (canvasElemsStore.currentlyHovered === elem) return;

		canvasElemsStore.setCurrentlyHovered(elem);
	};
</script>

<style scoped>
	.position-relative {
		user-select: none !important;
	}
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
