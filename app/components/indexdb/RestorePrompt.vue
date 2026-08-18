<template>
	<div
		v-if="canvasPersistenceStore.showRestorePrompt"
		class="position-fixed top-50 start-50 translate-middle bg-white p-4 shadow rounded"
		style="z-index: 2000; width: 400px">
		<RestoreOption />

		<hr />

		<NewOption />
	</div>
</template>

<script setup lang="ts">
	import { onMounted } from "vue";
	import { useCanvasPersistenceStore } from "../../store";
	import RestoreOption from "./RestoreOption.vue";
	import NewOption from "./NewOption.vue";

	const canvasPersistenceStore = useCanvasPersistenceStore();

	onMounted(async function () {
		await canvasPersistenceStore.listSavedCanvases();
	});
</script>
