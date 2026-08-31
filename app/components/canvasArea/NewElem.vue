<template>
	<!-- self-closing elems (img, etc.) can't hold children - render via SelfClosingTags -->
	<SelfClosingTags
		v-if="isSelfClosing"
		ref="tagRef"
		:newElemInfo="newElemInfo"
		:isSelected="isSelected"
		:activeWidth="badgeWidth"
		:activeHeight="badgeHeight"
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
		:activeWidth="badgeWidth"
		:activeHeight="badgeHeight"
		:isHoveredWhileDragging="isHoveredWhileDragging"
		:isLastEdited="isLastEdited"
		:resize="resize"
		:onMouseMove="onMouseMove"
		:onMouseDown="onMouseDown"
		:onClick="handleElemClick"
		:onDelete="deleteNode" />
</template>

<script setup lang="ts">
	import { computed, ref, watch, nextTick } from "vue";
	import type { CanvasElem } from "../../types";
	import { useCanvasElemsStore, useAppActionStore } from "../../store";
	import { useHistoryStore } from "../../store/historyStore";
	import { createResize, measureElem } from "../../utils";
	import SelfClosingTags from "./SelfClosingTags.vue";
	import NonSelfClosingTags from "./NonSelfClosing.vue";

	const props = defineProps<{
		newElemInfo: CanvasElem;
	}>();

	const canvasElemsStore = useCanvasElemsStore();
	const appActionStore = useAppActionStore();
	const historyStore = useHistoryStore();

	//elem types that can't have children/text in real HTML
	//e.g. img - add more here later (input, br, hr, etc.) if you support them
	const selfClosingElemTypes = ["img"];

	const isSelfClosing = computed(function () {
		return selfClosingElemTypes.includes(props.newElemInfo.elemType);
	});

	//badgeWidth/badgeHeight are the ONE source the badge, resize
	//starting-point, and resize commit all read from - always the real
	//measured DOM size, never a stale stored field. purely local, never
	//written to newElemInfo directly (except through onResize below),
	//so selecting an elem never mutates its data on its own.
	const badgeWidth = ref(0);
	const badgeHeight = ref(0);

	//createResize is fully pure - it knows nothing about newElemInfo or
	//customStyles. it reads current size via these two getters (always
	//live, since they read badgeWidth.value/badgeHeight.value fresh on
	//every call, never a frozen number) and reports new sizes back
	//through onResize. all mutation happens here, in one place - change
	//onResize when your data shape changes, never createResize.ts itself.
	const resize = createResize(
		function () {
			return badgeWidth.value;
		},
		function () {
			return badgeHeight.value;
		},
		{
			shouldStart: function (): boolean {
				return appActionStore.getActiveAction === "resize";
			},

			//called right when a drag STARTS, before any mutation happens -
			//this is what makes the "before" snapshot actually correct,
			//since $onAction's automatic timing captures "before" only when
			//commitElemSize is CALLED, which is after the whole drag
			//already finished (too late). manual snapshot here fixes that
			//for every resize, on every elem type.
			onResizeStart: function (): void {
				historyStore.snapshot("Resize");
			},

			//fires on every mousemove during the drag, with the live
			//width/height createResize just calculated. writes straight
			//into customStyles (the one place templates actually render
			//from) and keeps the badge in sync with what's on screen.
			onResize: function (width: number, height: number): void {
				props.newElemInfo.customStyles = props.newElemInfo.customStyles ?? {};
				props.newElemInfo.customStyles.width = width + "px";
				props.newElemInfo.customStyles.height = height + "px";

				badgeWidth.value = width;
				badgeHeight.value = height;
			},

			//called once, right when a resize drag ENDS - not during. this
			//is what makes EVERY resize (not just the first one) show up in
			//undo/redo history, since commitElemSize is a real store action
			//and $onAction picks it up automatically.
			onResizeEnd: function (): void {
				canvasElemsStore.commitElemSize(props.newElemInfo.id, {
					width: badgeWidth.value,
					height: badgeHeight.value,
					isWidthAdjusted: true,
					isHeightAdjusted: true,
				});
			},
		}
	);

	const isSelected = computed(function () {
		return canvasElemsStore.activeElemId === props.newElemInfo.id;
	});

	//ref into whichever tag component is actually rendered (Self or NonSelf)
	//both expose "elemRef" pointing at the real dom elem, via defineExpose
	const tagRef = ref<{ elemRef: HTMLElement | null } | null>(null);

	const isHoveredWhileDragging = computed(function () {
		return canvasElemsStore.currentlyHovered === tagRef.value?.elemRef;
	});

	//fires any time THIS elem BECOMES selected - covers both "user
	//clicked it" and "it was just created and auto-selected by addElem"
	//with one trigger, since both just flip activeElemId to this elem's
	//id. immediate:true also runs this once at setup, covering the case
	//where isSelected is ALREADY true the very first moment this
	//component exists (freshly created elems never see a false->true
	//transition, since they're born already selected).
	//nextTick matters for the creation case: right when addElem runs,
	//this elem's DOM node may not exist yet - for a plain click the node
	//already exists, so nextTick resolves instantly either way.
	watch(
		isSelected,
		function (isNowSelected) {
			if (!isNowSelected) return;

			nextTick(function () {
				measureElem(props.newElemInfo.id, function (width, height) {
					badgeWidth.value = width;
					badgeHeight.value = height;
				});
			});
		},
		{ immediate: true }
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
