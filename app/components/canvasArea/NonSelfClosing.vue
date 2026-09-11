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
		class="position-relative"
		:class="[
			...(newElemInfo.cssClasses ?? []),
			{
				'border border-2 my-2': isHoveredWhileDragging,
				edited: isLastEdited,
				'border border-dark': appActionStore.getShowElemOutlines,
			},
		]"
		:style="newElemInfo.customStyles ?? {}"
		v-bind="newElemInfo.props"
		@mousemove="onMouseMove"
		@mousedown="onMouseDown"
		@mouseenter="isMouseOver = true"
		@mouseleave="isMouseOver = false"
		@click="onClick">
		{{ newElemInfo.textContent }}

		<!-- update/edit modal - only rendered while THIS elem is both selected
	AND the modal has been opened via U. lives inside this wrapper so it
	positions itself with plain CSS (top: 100%) - no manual rect math
	needed, unlike the old global-modal + calculated-position approach. -->
		<updateCssModal
			v-if="isSelected && useCanvasElemsStore().isEditModalOpen"
			@mousedown.stop />

		<!-- badge + 4 resize handles, only while selected - showBadge
			additionally gates the badge specifically to hover/active-resize,
			independent of the handles which stay purely selection-gated -->
		<ResizeButtons
			v-if="isSelected"
			:resize="resize"
			:width="activeWidth"
			:height="activeHeight"
			:showBadge="isMouseOver" />

		<!-- delete button - only rendered while the mouse is directly over
			THIS elem. mouseenter/mouseleave don't bubble, so isMouseOver
			only flips for whichever exact elem (parent or nested child) the
			cursor is actually on, never both at once. -->
		<button
			v-if="isSelected"
			style="right: 0; bottom: -20px"
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
	import { useAppActionStore, useCanvasElemsStore } from "~/store";
	import ResizeButtons from "./ResizeButtons.vue";
	import UpdateCssModal from "./updateCss/updateCssModal.vue";
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

	const appActionStore = useAppActionStore();

	//NewElem.vue needs a ref to the REAL dom elem for drag/hover comparisons
	const elemRef = ref<HTMLElement | null>(null);
	defineExpose({ elemRef });

	//local, per-instance only - tracks whether THIS elem's mouse is
	//currently over it, purely to show/hide the delete button and badge
	const isMouseOver = ref(false);
</script>

<style scoped>
	.position-relative {
		user-select: none !important;
	}
	.edited {
		border: 1px solid red !important;
	}

	.deleteBtn {
		width: 20px;
		height: 20px;
		padding: 0;
		font-size: 16px;
		line-height: 18px;
		z-index: 3333;
		transition: opacity 0.15s ease;
	}
	.deleteBtn:hover {
		background-color: white !important;
		color: red !important;
	}
</style>
