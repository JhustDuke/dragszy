<template>
	<div class="import-modal-backdrop">
		<div class="import-modal-content">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="m-0">Import HTML</h5>
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					@click="$emit('close')"></button>
			</div>

			<div class="mb-3">
				<p class="red-text text-darken-4 text-capitalize text-center fw-bold"
					>make sure the html contains the css of the active framework in use</p
				>
				<label class="form-label">Name</label>
				<input
					type="text"
					class="form-control"
					v-model="label"
					placeholder="e.g. My navbar" />
			</div>

			<div class="mb-3">
				<label class="form-label">HTML file</label>
				<input
					type="file"
					accept=".html,text/html"
					class="form-control"
					@change="handleFileSelected" />
			</div>

			<div class="d-flex justify-content-end gap-2">
				<button
					type="button"
					class="btn btn-secondary"
					@click="$emit('close')">
					Cancel
				</button>
				<button
					type="button"
					class="btn btn-primary"
					:disabled="!canImport"
					@click="handleImport">
					Import
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";

	defineEmits<{
		close: [];
	}>();

	const label = ref("");
	const fileContent = ref<string | null>(null);

	const canImport = computed(function () {
		return label.value.trim().length > 0 && fileContent.value !== null;
	});

	function handleFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = function () {
			fileContent.value = reader.result as string;
		};

		reader.readAsText(file);
	}

	//actual parsing/store-wiring intentionally left out - orchestration
	//for this comes later
	function handleImport(): void {
		console.log("would import:", label.value, fileContent.value);
	}
</script>

<style scoped>
	.import-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1050;
	}

	.import-modal-content {
		background: white;
		border-radius: 6px;
		padding: 1.5rem;
		width: 480px;
		max-width: 90vw;
	}
</style>
