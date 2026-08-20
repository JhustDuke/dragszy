<template>
	<div>
		<div v-if="props.shouldShowRestoreCheck">
			<h5 class="mb-3">Saved canvases</h5>

			<div
				v-for="canvas in props.canvasArr"
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
								props.restoringCanvasId !== null ||
								props.deletingCanvasId !== null
							"
							@click="props.onRestore(canvas.id)">
							<span
								v-if="props.restoringCanvasId === canvas.id"
								class="spinner-border spinner-border-sm me-1">
							</span>

							{{
								props.restoringCanvasId === canvas.id
									? "Restoring..."
									: "Restore"
							}}
						</button>

						<button
							type="button"
							class="btn btn-danger btn-sm"
							:disabled="
								props.restoringCanvasId !== null ||
								props.deletingCanvasId !== null
							"
							@click="props.onDelete(canvas.id)">
							<span
								v-if="props.deletingCanvasId === canvas.id"
								class="spinner-border spinner-border-sm me-1">
							</span>

							{{
								props.deletingCanvasId === canvas.id ? "Deleting..." : "Delete"
							}}
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-else>
			<div class="text-muted">No previously saved files</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { SavedCanvasMeta } from "../../store";

	const props = defineProps<{
		canvasArr: SavedCanvasMeta[] | undefined;
		shouldShowRestoreCheck: boolean;
		restoringCanvasId: string | null;
		deletingCanvasId: string | null;
		onRestore: (id: string) => void;
		onDelete: (id: string) => void;
	}>();

	const formatDate = function (timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	};
</script>
