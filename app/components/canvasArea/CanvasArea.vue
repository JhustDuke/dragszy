<template>
	<div>
		<CanvasElement
			v-for="elem in canvasElemsStore.elems"
			:key="elem.id"
			:id="elem.id"
			:newElemInfo="elem" />

		<updateCssModal />

		<template v-if="canvasElemsStore.isDragging">
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
	</div>
</template>

<!-- CanvasArea.vue -->
<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from "vue";
	import { useCanvasElemsStore } from "../../store";
	import CanvasElement from "./NewElem.vue";
	import updateCssModal from "./updateCss/updateCssModal.vue";

	const canvasElemsStore = useCanvasElemsStore();

	onMounted(function () {
		document.addEventListener("mouseup", handleCanvasMouseUp, true);
		document.addEventListener("mousemove", trackDragPosition, true);
	});

	onUnmounted(function () {
		document.removeEventListener("mouseup", handleCanvasMouseUp, true);
		document.removeEventListener("mousemove", trackDragPosition, true);
	});

	let dragX = ref(0);
	let dragY = ref(0);

	const trackDragPosition = function (ev: MouseEvent) {
		if (!canvasElemsStore.currentlyDragged) return;
		dragX.value = ev.clientX;
		dragY.value = ev.clientY;
		canvasElemsStore.setIsDragging(true);

		const target = ev.target as HTMLElement;
		if (!target.closest("[data-canvas-elem]")) {
			canvasElemsStore.setCurrentlyHovered(null);
		}
	};

	const handleCanvasMouseUp = function () {
		const draggedNode = canvasElemsStore.currentlyDragged;
		const hoveredNode = canvasElemsStore.currentlyHovered;

		if (canvasElemsStore.isDragging && draggedNode && draggedNode.id) {
			let didEdit = false;

			if (hoveredNode && hoveredNode.id) {
				didEdit = canvasElemsStore.appendToNewParent(
					draggedNode.id,
					hoveredNode.id
				);
			} else {
				didEdit = canvasElemsStore.unparentElem(draggedNode.id);
			}

			if (didEdit) {
				canvasElemsStore.setLastEdited(draggedNode.id);
			}
		}

		canvasElemsStore.setCurrentlyDragged(null);
		canvasElemsStore.setCurrentlyHovered(null);
		canvasElemsStore.setIsDragging(false);
	};
</script>
