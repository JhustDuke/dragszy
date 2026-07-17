<template>
	<CanvasElement
		v-for="elem in canvasElemsStore.elems"
		:key="elem.id"
		:id="elem.id"
		:newElemInfo="elem" />
</template>

<!-- CanvasArea.vue -->
<script setup lang="ts">
	import { useCanvasElemsStore } from "../../store";
	// stores initialized first, before any functions/logic below
	const canvasElemsStore = useCanvasElemsStore();

	import CanvasElement from "./NewElem.vue";
</script>
