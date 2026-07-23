<template>
	<component
		:is="newElemInfo.elemType"
		ref="elemRef"
		data-canvas-elem
		class="position-relative d-flex p-2 justify-content-between border border-dark my-2"
		:class="[
			...(newElemInfo.cssClasses ?? []),
			{
				'border border-2': isHoveredWhileDragging,
				edited: isLastEdited,
			},
		]"
		:style="{
			height: newElemInfo.height + newElemInfo.heightUnit,
			width: newElemInfo.width + newElemInfo.widthUnit,
		}"
		@mousemove="onMouseMove"
		@mousedown="onMouseDown"
		@click="handleElemClick">
		{{ newElemInfo.textContent }}
		<!-- Width and height badge -->
		<small
			v-if="isSelected"
			class="position-absolute top-50 start-50 translate-middle badge bg-dark">
			w:{{ activeWidth }}{{ newElemInfo.widthUnit }} h:{{ activeHeight
			}}{{ newElemInfo.heightUnit }}
		</small>

		<!-- delete elem button -->
		<button
			id=""
			style="right: 0; bottom: 0"
			class="deleteBtn red position-absolute white-text"
			@click.stop="deleteNode">
			X
		</button>

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

		<NewElem
			v-for="child in newElemInfo.children"
			:key="child.id"
			:id="child.id"
			:newElemInfo="child" />
	</component>
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

	const deleteNode = function (ev: MouseEvent) {
		canvasElemsStore.deleteElem(props.newElemInfo.id);
	};

	const isLastEdited = computed(function () {
		return canvasElemsStore.lastEditedId === props.newElemInfo.id;
	});

	/**
	 * what do i want
	 * when i click inside an already created div,
	 * the new child should be inside the div
	 * if i click on a blank canvas, the new elem on the canvas
	 * to solve this i need to know where i doubled clcik
	 ** since all my elems have an id,
	 * if it has a id , i go to the store and ask
	 * where's a child with this id
	 * append into it
	 * and give the newly created elem the id
	 * if its
	 */
	const handleElemClick = function (event: MouseEvent): void {
		event.stopPropagation();

		canvasElemsStore.setActiveElem(props.newElemInfo.id);
	};

	const onMouseDown = function (ev: MouseEvent) {
		ev.preventDefault();
		ev.stopPropagation();
		const elem = ev.currentTarget as HTMLElement;
		canvasElemsStore.setCurrentlyDragged(elem);
	};

	const onMouseMove = function (ev: MouseEvent) {
		if (!canvasElemsStore.currentlyDragged) return;
		ev.stopPropagation();
		const elem = ev.currentTarget as HTMLElement;

		if (canvasElemsStore.currentlyHovered === elem) return;

		canvasElemsStore.setCurrentlyHovered(elem);
	};
</script>

<style scoped>
	.position-relative {
		user-select: none !important;
	}
	.edited {
		border: 1px solid red !important;
	}
	.x {
		width: 14px;
		height: 14px;
		cursor: ew-resize;
	}
	.deleteBtn:hover {
		background-color: white !important;
		color: red !important;
	}
	.y {
		width: 14px;
		height: 14px;
		cursor: ns-resize;
	}
</style>
