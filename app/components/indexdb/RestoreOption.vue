<template>
	<div>
		<div v-if="canvasPersistenceStore.savedCanvases.length > 0">
			<h5 class="mb-3">Saved canvases</h5>
			<div
				v-for="canvas in canvasPersistenceStore.savedCanvases"
				:key="canvas.id"
				class="border rounded p-3 mb-2">
				<div class="d-flex justify-content-between align-items-start gap-3">
					<div>
						<h6 class="mb-1">
							{{ canvas.name }}
						</h6>

						<small class="text-muted">
							{{ formatDate(canvas.updatedAt) }}
						</small>
					</div>

					<div class="d-flex gap-2">
						<button
							type="button"
							class="btn btn-primary btn-sm"
							:disabled="
								canvasPersistenceStore.restoringCanvasId !== null ||
								canvasPersistenceStore.deletingCanvasId !== null
							"
							@click="restoreCanvas(canvas.id)">
							<span
								v-if="canvasPersistenceStore.restoringCanvasId === canvas.id"
								class="spinner-border spinner-border-sm me-1">
							</span>

							{{
								canvasPersistenceStore.restoringCanvasId === canvas.id
									? "Restoring..."
									: "Restore"
							}}
						</button>

						<button
							type="button"
							class="btn btn-danger btn-sm"
							:disabled="
								canvasPersistenceStore.restoringCanvasId !== null ||
								canvasPersistenceStore.deletingCanvasId !== null
							"
							@click="deleteCanvas(canvas.id)">
							<span
								v-if="canvasPersistenceStore.deletingCanvasId === canvas.id"
								class="spinner-border spinner-border-sm me-1">
							</span>

							{{
								canvasPersistenceStore.deletingCanvasId === canvas.id
									? "Deleting..."
									: "Delete"
							}}
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="text-muted">no previously saved files</div>
		</div>

		<div
			v-if="canvasPersistenceStore.errorMessage"
			class="modal d-block"
			tabindex="-1">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title"> Persistence error </h5>
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
	import { useCanvasPersistenceStore } from "../../store";

	const canvasPersistenceStore = useCanvasPersistenceStore();

	const restoreCanvas = async function (id: string): Promise<void> {
		await canvasPersistenceStore.restoreCanvas(id);
	};

	const deleteCanvas = async function (id: string): Promise<void> {
		await canvasPersistenceStore.deleteSavedCanvas(id);
	};

	const formatDate = function (timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	};
</script>
