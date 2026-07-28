<template>
	<!--
		self-closing elems (img, and any future void elem type) can't hold children,
		so this outer div exists ONLY to give the delete button and resize buttons
		something to position:absolute against. it is NOT part of what the user built
		and must be skipped/unwrapped when compiler.ts exports the final file.
		its id always starts with "dragzy-" so the compiler can detect and strip it.
	-->
	<div
		class="position-relative d-inline-block my-2 green"
		:class="{
			'border border-2': isHoveredWhileDragging,
			edited: isLastEdited,
		}"
		:id="wrapperId"
		:style="resizeWrapperAndImg"
		@mousemove="onMouseMove"
		@mousedown="onMouseDown"
		@click="onClick">
		<!-- the actual elem the user is building, e.g. <img src="..." > -->
		<!-- no textContent, no <NewElem> children slot: self-closing elems can't have either -->
		<component
			:style="resizeWrapperAndImg"
			:is="newElemInfo.elemType"
			ref="elemRef"
			data-canvas-elem
			:class="newElemInfo.cssClasses ?? []"
			v-bind="newElemInfo.props" />

		<!-- badge + 4 resize handles, only while selected - all handled by ResizeButtons now -->
		<ResizeButtons
			v-if="isSelected"
			:resize="resize"
			:width="activeWidth"
			:height="activeHeight"
			:widthUnit="newElemInfo.widthUnit"
			:heightUnit="newElemInfo.heightUnit" />

		<!-- delete button (stays here - not part of resize, so not extracted) -->
		<button
			id=""
			style="right: 0; bottom: 0"
			class="deleteBtn red position-absolute white-text"
			@click.stop="onDelete">
			X
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import type { CanvasElem } from "~/types";
	import ResizeButtons from "./ResizeButtons.vue";

	//no logic lives here on purpose - NewElem.vue owns all behavior
	//(resize, selection, drag, delete). this component only renders.
	const props = defineProps<{
		newElemInfo: CanvasElem;
		isSelected: boolean;
		activeWidth: number;
		activeHeight: number;
		isHoveredWhileDragging: boolean;
		isLastEdited: boolean;
		resize: {
			top: (ev: MouseEvent) => void;
			right: (ev: MouseEvent) => void;
			bottom: (ev: MouseEvent) => void;
			left: (ev: MouseEvent) => void;
		};
		onMouseMove: (ev: MouseEvent) => void;
		onMouseDown: (ev: MouseEvent) => void;
		onClick: (ev: MouseEvent) => void;
		onDelete: (ev: MouseEvent) => void;
	}>();

	//NewElem.vue needs a ref to the REAL dom elem (the <img>, not this wrapper div)
	//so it must reach through this component - expose the inner ref by name
	const elemRef = ref<HTMLElement | null>(null);
	defineExpose({ elemRef });

	//random per-instance id, but ALWAYS starts with "dragzy-" so compiler.ts
	//can detect "this div is canvas scaffolding, not something the user built"
	//just by checking the prefix - duplicate ids across multiple self-closing
	//elems on the same canvas are no longer a problem either
	//e.g. "dragzy-x7f2q9"
	const wrapperId = ref("dragzy-img-" + Math.random().toString(36).slice(2, 9));
	const resizeWrapperAndImg = computed(function () {
		return {
			height: props.newElemInfo.height + props.newElemInfo.heightUnit,
			width: props.newElemInfo.width + props.newElemInfo.widthUnit,
		};
	});
</script>

<style scoped>
	.deleteBtn:hover {
		background-color: white !important;
		color: red !important;
	}
	.edited {
		border: 1px solid red !important;
	}
</style>
