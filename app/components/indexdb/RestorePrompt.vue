<template>
	<div>
		<div
			v-if="canvasPersistenceStore.showRestorePrompt"
			class="position-fixed top-50 start-50 translate-middle bg-white p-4 shadow rounded"
			style="z-index: 2000; width: 400px">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="mb-0"></h5>

				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					@click="closePrompt"></button>
			</div>

			<RestoreOption
				:canvas-arr="canvasPersistenceStore.savedCanvases"
				:should-show-restore-check="
					canvasPersistenceStore.savedCanvases.length !== 0
				"
				:restoring-canvas-id="
					canvasPersistenceStore.canvasOperation.restoringId
				"
				:deleting-canvas-id="canvasPersistenceStore.canvasOperation.deletingId"
				:on-restore="restoreCanvas"
				:on-delete="deleteCanvas" />
			<br />

			<div class="d-block grey text-center">OR START NEW</div>
			<hr />

			<NewOption
				:is-starting-new="canvasPersistenceStore.isStartingNew"
				:on-start-new="startNewCanvas" />

			<!-- ONLY PARENT DISPLAYS ERRORS -->
			<div
				v-if="canvasPersistenceStore.errorMessage"
				class="modal d-block"
				tabindex="-1">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">Persistence error</h5>
						</div>

						<div class="modal-body red-text">
							<p>{{ canvasPersistenceStore.errorMessage }}</p>
						</div>

						<div class="modal-footer">
							<button
								type="button"
								class="btn btn-secondary"
								@click="clearError">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<SaveNameOnSaveButtonClick
			:show="canvasPersistenceStore.saveNamePrompt.show"
			:is-saving="canvasPersistenceStore.saveNamePrompt.isSaving"
			@save="saveCanvasWithName"
			@cancel="cancelSaveName" />
	</div>
</template>

<script setup lang="ts">
	import { onMounted } from "vue";
	import { useCanvasPersistenceStore } from "../../store";
	import RestoreOption from "./RestoreOption.vue";
	import NewOption from "./NewOption.vue";
	import saveNameOnSaveButtonClick from "./SaveNamePrompt.vue";

	const canvasPersistenceStore = useCanvasPersistenceStore();

	onMounted(async function () {
		await canvasPersistenceStore.refreshList();
		canvasPersistenceStore.checkForRestorePrompt();
	});

	const saveCanvasWithName = async function (name: string): Promise<void> {
		await canvasPersistenceStore.saveCanvas(name);
	};

	const cancelSaveName = function (): void {
		canvasPersistenceStore.saveNamePrompt.show = false;
	};

	const closePrompt = function (): void {
		canvasPersistenceStore.showRestorePrompt = false;
	};

	const restoreCanvas = async function (id: string): Promise<void> {
		await canvasPersistenceStore.restoreCanvas(id);
	};

	const deleteCanvas = async function (id: string): Promise<void> {
		await canvasPersistenceStore.deleteSavedCanvas(id);
	};

	const startNewCanvas = async function (name: string): Promise<void> {
		await canvasPersistenceStore.startNewCanvas(name);
	};

	const clearError = function (): void {
		canvasPersistenceStore.errorMessage = null;
	};
</script>
