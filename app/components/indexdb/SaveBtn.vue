<template>
	<div>
		<button
			@mouseenter="
				showAndHideToolTip(hints.save, {
					left: 0,
					top: 50,
				})
			"
			style="height: fit-content"
			type="button"
			class="rounded p-2 grey"
			:class="showSaved ? 'btn-success' : 'btn-primary'"
			:disabled="canvasPersistenceStore.saveNamePrompt.isSaving || showSaved"
			@click="requestSave">
			<span
				v-if="canvasPersistenceStore.saveNamePrompt.isSaving"
				class="spinner-border spinner-border-sm me-2">
			</span>

			<i
				v-else-if="showSaved"
				class="fa fa-check me-2">
			</i>

			<i
				v-else
				class="fa fa-save me-2">
			</i>

			{{
				canvasPersistenceStore.saveNamePrompt.isSaving
					? "Saving..."
					: showSaved
					? "Saved"
					: "save"
			}}
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useCanvasPersistenceStore } from "../../store";
	import { showAndHideToolTip, hints } from "#imports";

	const canvasPersistenceStore = useCanvasPersistenceStore();

	const showSaved = ref<boolean>(false);

	const requestSave = async function () {
		if (!canvasPersistenceStore.currentCanvasId) {
			canvasPersistenceStore.saveNamePrompt.show = true;
			return;
		} else {
			await canvasPersistenceStore.requestSaveCanvas();
		}

		if (canvasPersistenceStore.errorMessage) {
			return;
		}

		showSaved.value = true;

		setTimeout(function (): void {
			showSaved.value = false;
		}, 2000);
	};
</script>
