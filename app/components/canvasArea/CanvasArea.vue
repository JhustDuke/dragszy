<template>
	<CanvasElement
		v-for="elem in canvasElemsStore.elems"
		:key="elem.id"
		:id="elem.id"
		:newElemInfo="elem" />
</template>

<!-- CanvasArea.vue -->
<script setup lang="ts">
	import { onMounted, onUnmounted } from "vue";
	import { useCanvasElemsStore } from "../../store";
	import CanvasElement from "./NewElem.vue";

	const canvasElemsStore = useCanvasElemsStore();

	onMounted(function () {
		document.addEventListener("mouseup", handleCanvasMouseUp);
	});

	onUnmounted(function () {
		document.removeEventListener("mouseup", handleCanvasMouseUp);
	});

	const handleCanvasMouseUp = function () {
		const elem = canvasElemsStore.currentlyDragged;
		if (!elem) {
			return;
		}

		canvasElemsStore.setCurrentlyDragged(null);
	};
</script>
