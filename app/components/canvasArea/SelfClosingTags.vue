<template>
	<div
		class="position-relative my-2 green"
		:class="{
			'border border-2': isHoveredWhileDragging,
			edited: isLastEdited,
		}"
		:id="wrapperId"
		:style="props.newElemInfo.customStyles ?? {}"
		@mousemove="onMouseMove"
		@mousedown="onMouseDown"
		@mouseenter="isMouseOver = true"
		@mouseleave="isMouseOver = false"
		@click="onClick">
		<component
			:style="props.newElemInfo.customStyles ?? {}"
			:is="newElemInfo.elemType"
			ref="elemRef"
			dragzy-elem
			:class="newElemInfo.cssClasses ?? []"
			v-bind="newElemInfo.props" />

		<!-- floating "change src" trigger - ONLY shown while this
			specific image is the active/selected one, matching how
			ResizeButtons is already gated the same way. only ever one
			button visible at a time, even with multiple images on canvas. -->
		<button
			v-if="isSelected"
			type="button"
			class="position-absolute start-50 translate-middle change-src-btn"
			@click.stop="openLibraryForSrc"
			style="top: -20px">
			Change Image
		</button>

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
			<updateCssModal @mousedown.stop />
		</div>

		<ResizeButtons
			v-if="isSelected"
			:resize="resize"
			:width="activeWidth"
			:height="activeHeight"
			:showBadge="isMouseOver" />

		<button
			v-if="isMouseOver"
			id=""
			style="right: 0; bottom: 0"
			class="deleteBtn red position-absolute white-text"
			@click.stop="onDelete">
			X
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";
	import type { CanvasElem } from "~/types";
	import {
		useAppActionStore,
		useImageLibraryStore,
		useCanvasElemsStore,
	} from "~/store";
	import ResizeButtons from "./ResizeButtons.vue";
	import UpdateCssModal from "./updateCss/updateCssModal.vue";

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

	const appActionStore = useAppActionStore();
	const imageLibraryStore = useImageLibraryStore();

	const elemRef = ref<HTMLElement | null>(null);
	defineExpose({ elemRef });

	const wrapperId = ref("dragzy-img-" + Math.random().toString(36).slice(2, 9));

	const isMouseOver = ref(false);

	//opens the SAME shared library modal the Inline Styles tab uses -
	//no separate modal built for this, just a different consumer of
	//the same isFromInlineTab trigger mechanism
	function openLibraryForSrc(): void {
		imageLibraryStore.isFromInlineTab.shouldShow = true;
	}

	//watches for the library handing back a choice, same pattern as the
	//Inline Styles tab's watcher - but writes to props.src and tags
	//userImg instead of customStyles + userBgImg. only reacts while
	//THIS elem is the selected one, so a choice made for some other
	//elem's request can never land on the wrong image.
	watch(
		function () {
			return imageLibraryStore.isFromInlineTab.imageData;
		},
		function (base64) {
			if (!base64) return;
			if (!props.isSelected) return;

			props.newElemInfo.props = props.newElemInfo.props ?? {};
			props.newElemInfo.props.src = base64;
			props.newElemInfo.userImg =
				imageLibraryStore.isFromInlineTab.imageId ?? undefined;

			imageLibraryStore.isFromInlineTab.imageData = null;
			imageLibraryStore.isFromInlineTab.imageId = null;
		}
	);
</script>

<style scoped>
	.deleteBtn:hover {
		background-color: white !important;
		color: red !important;
	}
	.edited {
		border: 1px solid red !important;
	}
	.change-src-btn {
		white-space: nowrap;
	}
</style>
