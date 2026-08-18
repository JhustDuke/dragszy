<template>
	<div>
		<button
			type="button"
			class="btn"
			:class="showSaved ? 'btn-success' : 'btn-primary'"
			:disabled="canvasPersistenceStore.isSaving || showSaved"
			@click="requestSave">
			<span
				v-if="canvasPersistenceStore.isSaving"
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
				canvasPersistenceStore.isSaving
					? "Saving..."
					: showSaved
					? "Saved"
					: "Save"
			}}
		</button>

		<div
			v-if="canvasPersistenceStore.errorMessage"
			class="modal d-block"
			tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Could not save canvas</h5>
					</div>

					<div class="modal-body">
						<p>{{ canvasPersistenceStore.errorMessage }}</p>
					</div>

					<div class="modal-footer">
						<button
							type="button"
							class="btn btn-secondary"
							@click="canvasPersistenceStore.errorMessage = null">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useCanvasPersistenceStore } from "../../store";

	const canvasPersistenceStore = useCanvasPersistenceStore();

	const showSaved = ref<boolean>(false);

	const requestSave = async function (): Promise<void> {
		await canvasPersistenceStore.requestSaveCanvas();

		//don't show "Saved" if there's an error, OR if this was actually
		//a first-time save that just opened the name prompt instead of
		//completing - showing a false "Saved" checkmark here was the
		//second bug caused by the same missing-prompt gap
		if (canvasPersistenceStore.errorMessage) {
			return;
		}

		if (canvasPersistenceStore.showSaveNamePrompt) {
			return;
		}

		showSaved.value = true;

		setTimeout(function (): void {
			showSaved.value = false;
		}, 2000);
	};
</script>
