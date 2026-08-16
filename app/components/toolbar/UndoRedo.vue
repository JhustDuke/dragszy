<template>
	<div class="d-flex gap-1 p-2">
		<button
			type="button"
			class="btn btn-light border shadow-sm"
			:disabled="historyStore.previousCanvasStates.length === 0"
			@click="historyStore.undo()">
			<i class="fa fa-undo"></i>
		</button>

		<button
			type="button"
			class="btn btn-light border shadow-sm"
			:disabled="historyStore.futureCanvasStates.length === 0"
			@click="historyStore.redo()">
			<i class="fa fa-repeat"></i>
		</button>
	</div>
</template>

<script setup lang="ts">
	import { useHistoryStore } from "~/store/historyStore";

	const historyStore = useHistoryStore();
</script>
