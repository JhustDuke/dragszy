<template>
	<div>
		<h6>Start a new canvas</h6>

		<input
			v-model="canvasName"
			type="text"
			class="form-control mb-3"
			placeholder="Canvas name"
			:disabled="canvasPersistenceStore.isStartingNew" />

		<button
			type="button"
			class="green w-100"
			:disabled="canvasPersistenceStore.isStartingNew"
			@click="startNewCanvas">
			<span
				v-if="canvasPersistenceStore.isStartingNew"
				class="spinner-border spinner-border-sm me-2">
			</span>

			{{ canvasPersistenceStore.isStartingNew ? "Creating..." : "Start New" }}
		</button>

		<div
			v-if="canvasPersistenceStore.errorMessage"
			class="modal d-block"
			tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"> Could not create canvas </h5>
					</div>

					<div class="modal-body">
						<p>
							{{ canvasPersistenceStore.errorMessage }}
						</p>
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

	const startNewCanvas = async function (): Promise<void> {
		await canvasPersistenceStore.startNewCanvas(canvasName.value.trim());
	};
</script>
