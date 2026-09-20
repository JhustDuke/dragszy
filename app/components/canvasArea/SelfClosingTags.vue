<template>
	<div
		class="position-relative my-2"
		:class="{
			'border border-2': isHoveredWhileDragging,
			edited: isLastEdited,
		}"
		:id="wrapperId"
		:style="props.newElemInfo.customStyles ?? {}"
		@mousemove="onMouseMove"
		@mousedown="onMouseDown"
		@click="onClick">
		<!-- toolbar for quick actions -->
		<QuickToolBar
			v-if="isSelected && newElemInfo.elemType === 'img'"
			:controls-override="[
				'img-fluid',
				'img-thumbnail',
				'rounded',
				'rounded-circle',
			]"
			:css-classes="props.newElemInfo.cssClasses"
			class="position-absolute start-50 translate-middle"
			style="top: -20px; white-space: nowrap" />

		<QuickToolBar
			v-else-if="isSelected"
			:css-classes="props.newElemInfo.cssClasses"
			class="position-absolute start-50 translate-middle"
			style="top: -20px; white-space: nowrap" />

		<component
			:style="props.newElemInfo.customStyles ?? {}"
			:is="newElemInfo.elemType"
			ref="elemRef"
			dragzy-elem
			:class="newElemInfo.cssClasses ?? []"
			v-bind="newElemInfo.props" />

		<!-- update/edit modal - only rendered while THIS elem is both selected
AND the modal has been opened via U. lives inside this wrapper so it
positions itself with plain CSS (top: 100%) - no manual rect math
needed, unlike the old global-modal + calculated-position approach. -->
		<div
			v-if="isSelected && useCanvasElemsStore().isEditModalOpen"
			class="position-absolute"
			:style="{
				width: '600px',
				maxWidth: '80vw',
				top: activeHeight + 10 + 'px',
				left: '0',
				zIndex: 1001,
			}">
			<updateCssModal />
		</div>

		<ResizeButtons
			v-if="isSelected"
			:resize="resize"
			:width="activeWidth"
			:height="activeHeight"
			:showBadge="isMouseOver" />

		<!-- delete button -->
		<button
			v-if="isSelected"
			style="right: 0; bottom: -10px"
			class="deleteBtn red position-absolute white-text"
			@click.stop="onDelete">
			X
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore } from "~/store";
	import ResizeButtons from "./ResizeButtons.vue";
	import UpdateCssModal from "../updateModal/updateModal.vue";
	import QuickToolBar from "./QuickToolBar.vue";

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

	const elemRef = ref<HTMLElement | null>(null);
	defineExpose({ elemRef });

	const wrapperId = ref("dragzy-img-" + Math.random().toString(36).slice(2, 9));

	const isMouseOver = ref(false);
</script>

<style scoped>
	.deleteBtn {
		width: 20px;
		height: 20px;
		padding: 0;
		font-size: 16px;
		line-height: 18px;
		transition: opacity 0.15s ease;
		z-index: 3333;
	}
	.deleteBtn:hover {
		background-color: white !important;

		color: red !important;
	}
	.edited {
		border: 1px solid red !important;
	}
</style>
