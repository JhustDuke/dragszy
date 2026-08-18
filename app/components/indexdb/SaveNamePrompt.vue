<template>
	<div
		v-if="canvasPersistenceStore.showSaveNamePrompt"
		class="position-fixed top-50 start-50 translate-middle bg-white p-4 shadow rounded"
		style="z-index: 2000; width: 400px">
		<h6>Name this canvas</h6>

		<input
			v-model="canvasName"
			type="text"
			class="form-control mb-3"
			placeholder="Canvas name"
			:disabled="canvasPersistenceStore.isSaving" />

		<div class="d-flex gap-2">
			<button
				type="button"
				class="btn btn-primary flex-grow-1"
				:disabled="canvasPersistenceStore.isSaving"
				@click="confirmSave">
				<span
					v-if="canvasPersistenceStore.isSaving"
					class="spinner-border spinner-border-sm me-2">
				</span>
				{{ canvasPersistenceStore.isSaving ? "Saving..." : "Save" }}
			</button>

			<button
				type="button"
				class="btn btn-secondary"
				:disabled="canvasPersistenceStore.isSaving"
				@click="cancel">
				Cancel
			</button>
		</div>

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

	const canvasName = ref("");

	//this is what was missing - requestSaveCanvas sets
	//showSaveNamePrompt=true on the very first save (no existing canvas
	//to just overwrite), but nothing was listening for it, so the save
	//never actually completed. this component closes that gap.
	const confirmSave = async function (): Promise<void> {
		await canvasPersistenceStore.saveCanvas(canvasName.value);
	};

	const cancel = function (): void {
		canvasPersistenceStore.showSaveNamePrompt = false;
	};
</script>
