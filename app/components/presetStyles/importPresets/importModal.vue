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

			<p class="red-text text-darken-4 text-capitalize text-center fw-bold">
				make sure the html contains the css of the active framework in use
			</p>

			<p
				v-if="localError"
				class="text-danger mb-3">
				{{ localError }}
			</p>

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
	import { parseHtmlToDragzy } from "~/compiler";

	import type { CanvasElem } from "~/types";

	const emit = defineEmits<{
		close: [];
		error: [message: string];
		success: [label: string, tree: CanvasElem];
	}>();

	const label = ref("");
	const fileContent = ref<string | null>(null);
	const localError = ref("");

	const canImport = computed(function () {
		return label.value.trim().length > 0 && fileContent.value !== null;
	});

	function handleFileSelected(event: Event): void {
		localError.value = "";
		fileContent.value = null;

		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const isHtmlFile =
			file.name.toLowerCase().endsWith(".html") ||
			file.name.toLowerCase().endsWith(".htm");

		if (!isHtmlFile) {
			localError.value = "Please choose a .html file.";
			input.value = ""; // clears the selection so canImport stays false
			return;
		}

		const reader = new FileReader();

		reader.onload = function () {
			fileContent.value = reader.result as string;
		};

		reader.onerror = function () {
			localError.value = "Couldn't read that file. Try again.";
		};

		reader.readAsText(file);
	}

	//parses locally so the user can immediately retry with a different
	//file/name without the modal closing on a bad attempt - only a
	//successful parse gets emitted up for the parent to actually act on
	function handleImport(): void {
		localError.value = "";

		if (!fileContent.value) {
			localError.value = "Choose a file first.";
			return;
		}

		const result = parseHtmlToDragzy(fileContent.value);

		if (result.error || !result.tree) {
			localError.value =
				result.error ?? "Something went wrong parsing that file.";
			emit("error", localError.value);
			return;
		}

		emit("success", label.value.trim(), result.tree);
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
