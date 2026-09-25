<template>
	<ClientOnly>
		<Teleport to="body">
			<!-- modal-backdrop -->
			<div
				class="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
				style="z-index: 9999">
				<!-- modal -->
				<div
					class="rounded grey lighten-3 p-3"
					style="
						max-width: 500px;
						width: 90%;
						min-height: 200px;
						box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
					">
					<p class="green-text text-darken-4 fw-bold text-capitalize"
						>changing the export format here also changes the export format in
						the main export</p
					>
					<!-- checkboxex -->
					<div class="my-4">
						<div
							class="form-check d-inline-flex me-3"
							v-for="(format, index) in props.exportFormats"
							:key="index">
							<!-- check box start -->
							<input
								:id="format"
								class="form-check-input me-1"
								name="format"
								:value="format"
								type="radio"
								v-model="selectedExportFormat" />
							<label
								:for="format"
								class="form-check-label">
								{{ format }}
							</label>
						</div>

						<!-- fullpage export e.g. unchecked = fragment, checked = full-page -->
						<div
							class="form-check mt-2"
							v-if="selectedExportFormat.toLowerCase() === 'html'">
							<input
								id="full-page-export"
								class="form-check-input me-1"
								type="checkbox"
								v-model="isFullPageExport" />
							<label
								for="full-page-export"
								class="form-check-label">
								export as fullpage
							</label>
						</div>
					</div>

					<div class="d-flex justify-content-start gap-1">
						<!-- export button -->
						<button
							class="btn btn-primary"
							@click="emitFormatAndCanvasElem">
							<span
								v-if="props.isExporting"
								class="spinner-border spinner-border-sm"></span>
							{{ props.isExporting ? "exporting" : "export" }}</button
						>

						<button
							class="btn red lighten-4"
							@click="closeModal"
							:disabled="props.isExporting"
							>cancel</button
						>
					</div>
				</div>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useCanvasElemsStore } from "~/store";
	import { ClientOnly } from "#components";
	import type { CanvasElem } from "~/types";

	const props = defineProps<{
		exportFormats: readonly string[];
		isExporting: boolean;
	}>();
	const selectedExportFormat = ref(props.exportFormats[0]!);
	const isFullPageExport = ref(false);

	const emit = defineEmits<{
		onExportData: [
			{
				choosenFormat: string;
				elemBlock: CanvasElem;
				isFullPageExport: boolean;
			}
		];
		close: [];
	}>();

	function emitFormatAndCanvasElem() {
		const selectedElemBlock = useCanvasElemsStore().getActiveElem;

		// no checks were needed here cos selectedElemBlock is never empty
		emit("onExportData", {
			choosenFormat: selectedExportFormat.value,
			elemBlock: selectedElemBlock as CanvasElem,
			isFullPageExport: isFullPageExport.value,
		});
	}

	function closeModal() {
		emit("close");
	}
</script>

<style scoped>
	button:hover {
		filter: contrast(70%);
	}
</style>
