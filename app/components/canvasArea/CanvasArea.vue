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
		document.addEventListener("mouseup", handleCanvasMouseUp);
		document.addEventListener("mousemove", trackDragPosition);
	});

	onUnmounted(function () {
		document.removeEventListener("mouseup", handleCanvasMouseUp);
		document.removeEventListener("mousemove", trackDragPosition);
	});

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
		const elem = canvasElemsStore.currentlyDragged;
		if (!elem) {
			return;
		}

		canvasElemsStore.setCurrentlyDragged(null);
		isDragging.value = false;
	};
</script>
