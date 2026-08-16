<template>
	<!-- self-closing elems (img, etc.) can't hold children - render via SelfClosingTags -->
	<SelfClosingTags
		v-if="isSelfClosing"
		ref="tagRef"
		:newElemInfo="newElemInfo"
		:isSelected="isSelected"
		:activeWidth="activeWidth"
		:activeHeight="activeHeight"
		:isHoveredWhileDragging="isHoveredWhileDragging"
		:isLastEdited="isLastEdited"
		:resize="resize"
		:onMouseMove="onMouseMove"
		:onMouseDown="onMouseDown"
		:onClick="handleElemClick"
		:onDelete="deleteNode" />

	<!-- everything else (div, button, span, form, etc.) - render via NonSelfClosingTags -->
	<NonSelfClosingTags
		v-else
		ref="tagRef"
		:newElemInfo="newElemInfo"
		:isSelected="isSelected"
		:activeWidth="activeWidth"
		:activeHeight="activeHeight"
		:isHoveredWhileDragging="isHoveredWhileDragging"
		:isLastEdited="isLastEdited"
		:resize="resize"
		:onMouseMove="onMouseMove"
		:onMouseDown="onMouseDown"
		:onClick="handleElemClick"
		:onDelete="deleteNode" />
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import type { CanvasElem } from "../../types";
	import { useCanvasElemsStore, useAppActionStore } from "../../store";
	import { createResize } from "../../utils";
	import SelfClosingTags from "./SelfClosingTags.vue";
	import NonSelfClosingTags from "./NonSelfClosing.vue";

	const props = defineProps<{
		newElemInfo: CanvasElem;
	}>();

	const canvasElemsStore = useCanvasElemsStore();
	const appActionStore = useAppActionStore();

	//elem types that can't have children/text in real HTML
	//e.g. img - add more here later (input, br, hr, etc.) if you support them
	const selfClosingElemTypes = ["img"];

	const isSelfClosing = computed(function () {
		return selfClosingElemTypes.includes(props.newElemInfo.elemType);
	});

	const resize = createResize(props.newElemInfo, {
		shouldStart: function (): boolean {
			return appActionStore.getActiveAction === "resize";
		},

		//called once, right when a resize drag ENDS - not during. this is
		//what makes EVERY resize (not just the first one, which the watch
		//below already covers on its own) show up in undo/redo history,
		//since commitElemSize is a real store action and $onAction picks
		//it up automatically. createResize.ts stays fully store-agnostic -
		//it just calls this callback, it never imports or knows about
		//canvasElemsStore itself.
		onResizeEnd: function (): void {
			canvasElemsStore.commitElemSize(props.newElemInfo.id, {
				width: props.newElemInfo.width,
				height: props.newElemInfo.height,
				isWidthAdjusted: true,
				isHeightAdjusted: true,
			});
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

	//ref into whichever tag component is actually rendered (Self or NonSelf)
	//both expose "elemRef" pointing at the real dom elem, via defineExpose
	const tagRef = ref<{ elemRef: HTMLElement | null } | null>(null);

	const isHoveredWhileDragging = computed(function () {
		return canvasElemsStore.currentlyHovered === tagRef.value?.elemRef;
	});

	//BEFORE the very first drag, an elem's width/height may still be
	//undefined (pure class-driven, never resized). createResize's drag
	//math needs a real starting number to work from, or the first drag
	//would jump from 0. this watch just seeds that starting value the
	//moment resize mode + selection align - it does NOT call any store
	//action here (that would create a phantom history entry just from
	//selecting something, even before any actual drag happens).
	//commitElemSize (fired via onResizeEnd, on every drag's end) is now
	//the ONLY thing that ever creates a real history entry for resize -
	//covering the first resize and every one after it, uniformly.
	watch(
		function () {
			return isSelected.value && appActionStore.getActiveAction === "resize";
		},
		function (isNowResizingThisElem) {
			if (!isNowResizingThisElem) return;

			const elem = tagRef.value?.elemRef;
			if (!elem) return;

			const rect = elem.getBoundingClientRect();

			if (!props.newElemInfo.isWidthAdjusted) {
				props.newElemInfo.width = rect.width;
			}

			if (!props.newElemInfo.isHeightAdjusted) {
				props.newElemInfo.height = rect.height;
			}
		}
	);

	const deleteNode = function (ev: MouseEvent) {
		canvasElemsStore.deleteElem(props.newElemInfo.id);
	};

	const isLastEdited = computed(function () {
		return canvasElemsStore.lastEditedId === props.newElemInfo.id;
	});

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
