<template>
	<div class="d-flex gap-1 p-2">
		<button
			type="button"
			class="btn btn-light border shadow-sm"
			:disabled="historyStore.previousCanvasStates.length === 0"
			@click="historyStore.undo()"
			@mouseenter="
				showAndHideToolTip(hints.undo, {
					left: 0,
					top: 50,
				})
			">
			<i class="fa fa-undo"></i>
		</button>

		<button
			type="button"
			class="btn btn-light border shadow-sm"
			:disabled="historyStore.futureCanvasStates.length === 0"
			@click="historyStore.redo()"
			@mouseenter="
				showAndHideToolTip(hints.redo, {
					left: 0,
					top: 50,
				})
			">
			<i class="fa fa-repeat"></i>
		</button>
	</div>
</template>

<script setup lang="ts">
	import { useHistoryStore } from "~/store/historyStore";
	import { showAndHideToolTip, hints } from "#imports";

	const historyStore = useHistoryStore();
</script>
