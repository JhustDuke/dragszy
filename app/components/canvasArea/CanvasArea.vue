<template>
	<div class="position-relative">
		<CanvasElement
			v-for="elem in canvasElemsStore.elems"
			:key="elem.id"
			:id="elem.id"
			:newElemInfo="elem" />
		<undoRedoToast />
	</div>

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
	import undoRedoToast from "./undoRedoToast.vue";
	import { isTyping } from "../../utils";

	const canvasElemsStore = useCanvasElemsStore();

	onMounted(function () {
		document.addEventListener("mouseup", handleCanvasMouseUp, true);
		document.addEventListener("mousemove", trackDragPosition, true);
		document.addEventListener("keydown", activateUpdateModal);
		document.addEventListener("keydown", handleDuplicateShortcut);
	});

	onUnmounted(function () {
		document.removeEventListener("mouseup", handleCanvasMouseUp, true);
		document.removeEventListener("mousemove", trackDragPosition, true);
		document.removeEventListener("keydown", activateUpdateModal);
		document.removeEventListener("keydown", handleDuplicateShortcut);
	});

	const handleDuplicateShortcut = function (ev: KeyboardEvent): void {
		if (isTyping(ev.target)) return;
		if (ev.key.toLowerCase() !== "d") return;
		if (!canvasElemsStore.activeElemId) return;

		canvasElemsStore.duplicateActiveElem();
	};

	//"U" opens the edit modal for whichever elem is currently selected -
	//no position math needed anymore, since the modal now lives INSIDE
	//each elem's own wrapper and positions itself via plain CSS
	//(position: absolute; top: 100%) relative to that wrapper.
	const activateUpdateModal = function (ev: KeyboardEvent) {
		if (ev.key.toLowerCase() !== "u") return;
		if (isTyping(ev.target)) return;

		const activeElemId = canvasElemsStore.activeElemId;
		if (!activeElemId) return;

		canvasElemsStore.openEditModal(activeElemId);
	};

	const dragX = ref(0);
	const dragY = ref(0);

	const trackDragPosition = function (ev: MouseEvent) {
		if (!canvasElemsStore.currentlyDragged) return;

		dragX.value = ev.clientX;
		dragY.value = ev.clientY;
		canvasElemsStore.setIsDragging(true);

		const target = ev.target as HTMLElement;

		if (!target.closest("[dragzy-elem]")) {
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
