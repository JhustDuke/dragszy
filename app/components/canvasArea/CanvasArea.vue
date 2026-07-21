<template>
	<CanvasElement
		v-for="elem in canvasElemsStore.elems"
		:key="elem.id"
		:id="elem.id"
		:newElemInfo="elem" />

	<template v-if="isDragging">
		<div
			class="position-fixed p-2 grey border border-3"
			style="border-style: dotted !important"
			:style="{
				top: dragY + 'px',
				left: dragX + 'px',
				height: '50px',
			}">
			{{ canvasElemsStore.currentlyDragged?.id || "drag" }}
		</div>
	</template>
</template>

<!-- CanvasArea.vue -->
<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from "vue";
	import { useCanvasElemsStore } from "../../store";
	import CanvasElement from "./NewElem.vue";

	const canvasElemsStore = useCanvasElemsStore();

	onMounted(function () {
		document.addEventListener("mouseup", handleCanvasMouseUp, true);
		document.addEventListener("mousemove", trackDragPosition, true);
	});

	onUnmounted(function () {
		document.removeEventListener("mouseup", handleCanvasMouseUp, true);
		document.removeEventListener("mousemove", trackDragPosition, true);
	});

	//what do i want?
	//i want the currently hovered elem to
	//have a thicker border
	//

	let dragX = ref(0);
	let dragY = ref(0);
	const isDragging = ref(false);

	const trackDragPosition = function (ev: MouseEvent) {
		if (!canvasElemsStore.currentlyDragged) return;
		dragX.value = ev.clientX;
		dragY.value = ev.clientY;
		isDragging.value = true;
	};

	const handleCanvasMouseUp = function () {
		const draggedNode = canvasElemsStore.currentlyDragged;
		const hoveredNode = canvasElemsStore.currentlyHovered;

		if (draggedNode && draggedNode.id) {
			if (hoveredNode && hoveredNode.id) {
				canvasElemsStore.appendToNewParent(draggedNode.id, hoveredNode.id);
			} else {
				canvasElemsStore.unparentElem(draggedNode.id);
			}
		}

		canvasElemsStore.setCurrentlyDragged(null);
		canvasElemsStore.setCurrentlyHovered(null);
		isDragging.value = false;
	};
</script>
