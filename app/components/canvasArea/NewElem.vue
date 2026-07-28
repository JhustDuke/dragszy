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
	import { computed, ref } from "vue";
	import type { CanvasElem } from "~/types";
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
