<template>
	<div class="upload-modal-backdrop">
		<div class="upload-modal-content">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="m-0">Choose or Upload Image</h5>
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					@click="$emit('close')"></button>
			</div>

			<!-- existing images - only shown if there are any -->
			<div
				v-if="images.length > 0"
				class="d-flex flex-wrap gap-2 mb-3">
				<img
					v-for="img in images"
					:key="img.id"
					:src="img.base64"
					:alt="img.fileName"
					class="upload-thumb"
					role="button"
					@click="$emit('select', img.id, img.fileName)" />
			</div>

			<p
				v-else
				class="text-muted">
				No images uploaded yet.
			</p>

			<hr />

			<div class="mb-3">
				<label class="form-label">Upload new</label>
				<input
					type="file"
					accept="image/*"
					class="form-control"
					@change="handleFileSelected" />
			</div>

			<p
				v-if="errorMessage"
				class="text-danger">
				{{ errorMessage }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface LibraryImage {
		id: string;
		fileName: string;
		base64: string;
	}

	defineProps<{
		images: LibraryImage[];
		errorMessage: string;
	}>();

	const emit = defineEmits<{
		close: [];
		select: [id: string, fileName: string];
		fileChosen: [file: File];
	}>();

	function handleFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		emit("fileChosen", file);
	}
</script>

<style scoped>
	.upload-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1050;
	}

	.upload-modal-content {
		background: white;
		border-radius: 6px;
		padding: 1.5rem;
		width: 480px;
		max-width: 90vw;
	}

	.upload-thumb {
		width: 60px;
		height: 60px;
		object-fit: cover;
		border-radius: 4px;
		border: 1px solid #ccc;
	}
</style>
