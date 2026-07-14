<template>
	<div
		class="container mt-4"
		style="min-height: 500px"
		@dblclick="handleCanvasClick">
		<CanvasElement
			v-for="elem in canvasElemsStore.elems"
			:key="elem.id"
			:nodeInfo="elem" />
	</div>
</template>

<!-- CanvasArea.vue -->
<script setup lang="ts">
	import { useAppActionStore } from "../../store";
	import { useCanvasElemsStore } from "../../store";
	// stores initialized first, before any functions/logic below
	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();

	import CanvasElement from "./NewElem.vue";

	function handleCanvasClick(): void {
		if (appActionStore.getActiveAction !== "create") return;
		canvasElemsStore.addElem();
	}
</script>
