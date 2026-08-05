<template>
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
		document.addEventListener("keydown", activateUpdateModal);
	});

	onUnmounted(function () {
		document.removeEventListener("mouseup", handleCanvasMouseUp, true);
		document.removeEventListener("mousemove", trackDragPosition, true);
		document.removeEventListener("keydown", activateUpdateModal);
	});

	//"U" opens the edit modal for whichever elem is currently selected -
	//replaces right-click, which was stepping on the browser's own
	//"Inspect Element" context menu. Guards against firing while the user
	//is typing inside any text input/textarea (e.g. a class draft field),
	//so typing the letter "u" anywhere doesn't accidentally trigger it.
	const activateUpdateModal = function (ev: KeyboardEvent) {
		if (ev.key.toLowerCase() !== "u") return;

		const target = ev.target as HTMLElement;
		const isTypingInField =
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			target.isContentEditable;

		if (isTypingInField) return;

		const activeElemId = canvasElemsStore.activeElemId;
		if (!activeElemId) return;

		const elemNode = document.getElementById(activeElemId);
		if (!elemNode) return;

		const rect = elemNode.getBoundingClientRect();

		canvasElemsStore.openEditModal(activeElemId, {
			top: rect.bottom + 10,
			left: rect.left,
		});
	};

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
