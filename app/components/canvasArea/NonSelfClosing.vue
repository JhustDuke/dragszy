<template>
	<!--
		non-self-closing elems (div, button, span, form, etc.) CAN hold children,
		so no extra wrapper div is needed here - unlike SelfClosingTags.vue.
		this component IS the real elem the user is building.
	-->
	<component
		:is="newElemInfo.elemType"
		ref="elemRef"
		:id="newElemInfo.id"
		dragzy-elem
		class="position-relative d-flex p-2 justify-content-between border border-dark my-2"
		:class="[
			...(newElemInfo.cssClasses ?? []),
			{
				'border border-2': isHoveredWhileDragging,
				edited: isLastEdited,
			},
		]"
		:style="{
			...(newElemInfo.isWidthAdjusted
				? { width: newElemInfo.width + newElemInfo.widthUnit }
				: {}),
			...(newElemInfo.isHeightAdjusted
				? { height: newElemInfo.height + newElemInfo.heightUnit }
				: {}),
			...(newElemInfo.customStyles ?? {}),
		}"
		v-bind="newElemInfo.props"
		@mousemove="onMouseMove"
		@mousedown="onMouseDown"
		@click="onClick">
		{{ newElemInfo.textContent }}

		<!-- badge + 4 resize handles, only while selected -->
		<ResizeButtons
			v-if="isSelected"
			:resize="resize"
			:width="activeWidth"
			:height="activeHeight"
			:widthUnit="newElemInfo.widthUnit"
			:heightUnit="newElemInfo.heightUnit" />

		<!-- delete button -->
		<button
			id=""
			style="right: 0; bottom: 0"
			class="deleteBtn red position-absolute white-text"
			@click.stop="onDelete">
			X
		</button>

		<!-- nested children, recursively rendered - this is the whole reason
			this elem type CAN'T be self-closing: it needs to hold these -->
		<NewElem
			v-for="child in newElemInfo.children"
			:key="child.id"
			:id="child.id"
			:newElemInfo="child" />
	</component>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { CanvasElem } from "~/types";
	import ResizeButtons from "./ResizeButtons.vue";
	import NewElem from "./NewElem.vue";

	//no logic lives here on purpose - NewElem.vue owns all behavior
	//(resize, selection, drag, delete). this component only renders.
	defineProps<{
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

	//NewElem.vue needs a ref to the REAL dom elem for drag/hover comparisons
	const elemRef = ref<HTMLElement | null>(null);
	defineExpose({ elemRef });
</script>

<style scoped>
	.position-relative {
		user-select: none !important;
	}
	.edited {
		border: 1px solid red !important;
	}
	.deleteBtn:hover {
		background-color: white !important;
		color: red !important;
	}
</style>
