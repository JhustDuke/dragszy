<template>
	<div
		class="position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center upload-modal-backdrop">
		<div class="bg-white rounded p-4 overflow-y-auto upload-modal-content">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="m-0 mx-auto red-text text-darken-1">
					upload Images or Double-click to select
				</h5>

				```
				<!-- close image button -->
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					:disabled="isLoading"
					@click="emitCloseImage"></button>
			</div>

			<div
				v-if="images.length > 0"
				class="d-flex flex-wrap gap-2 mb-3">
				<div
					v-for="img in images"
					:key="img.id"
					class="position-relative border rounded p-1 bg-white image-card"
					:class="{
						'border-primary border-3 shadow': selectedImageId === img.id,
					}"
					@click="selectImage(img)"
					@dblclick="emitChooseImage(img)">
					<!-- delete image button -->
					<button
						type="button"
						class="del position-absolute top-0 end-0 border-0 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
						:disabled="isLoading"
						@click.stop="emitRemoveImage(img.id)">
						X
					</button>

					<!-- image thumbnail -->
					<img
						:src="img.base64"
						:alt="img.fileName"
						class="d-block rounded object-fit-cover upload-thumb"
						:class="{
							'selected-thumb': selectedImageId === img.id,
						}" />

					<div class="mt-1 imgDiv">
						{{ img.fileName }}
					</div>
				</div>
			</div>

			<!-- empty image state -->
			<p
				v-else
				class="text-muted">
				No images uploaded yet.
			</p>

			<hr />

			<div class="mb-3">
				<label class="form-label">Upload new</label>

				<!-- upload box -->
				<input
					type="file"
					accept=".jpg,.jpeg,.png,image/jpeg,image/png"
					class="form-control"
					:disabled="isLoading"
					@change="selectFile" />
			</div>

			<!-- uploaded file name preview -->
			<p
				v-if="selectedFile"
				class="mb-3">
				Selected: {{ selectedFile.name }}
			</p>

			<!-- submit button -->
			<button
				type="button"
				class="btn btn-primary"
				:disabled="disableUploadBtn"
				@click="confirmSelection">
				<span
					v-if="isLoading"
					class="spinner-border spinner-border-sm me-2"
					aria-hidden="true"></span>

				{{ isLoading ? "Working..." : "upload Image" }}
			</button>

			<!-- error message -->
			<p
				v-if="errorMessage"
				class="text-danger mt-3">
				{{ errorMessage }}
			</p>
		</div>
	</div>
	```
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";

	interface LibraryImage {
		id: string;
		fileName: string;
		base64: string;
	}

	const props = defineProps<{
		images: LibraryImage[];
		errorMessage: string;
		isLoading: boolean;
	}>();

	const emit = defineEmits<{
		closeImage: [];
		onUpload: [file: File];
		chooseImage: [id: string, fileName: string];
		removeImage: [id: string];
		uploadError: [message: string];
	}>();

	const selectedImageId = ref<string | null>(null);
	const selectedFile = ref<File | null>(null);

	const disableUploadBtn = computed(function (): boolean {
		if (selectedFile.value === null) {
			return true;
		}

		if (props.isLoading) {
			return true;
		}

		return false;
	});

	function selectImage(img: LibraryImage): void {
		if (props.isLoading) return;

		selectedImageId.value = img.id;
		selectedFile.value = null;
	}

	function emitChooseImage(img: LibraryImage): void {
		if (props.isLoading) return;

		selectedImageId.value = img.id;
		selectedFile.value = null;

		emit("chooseImage", img.id, img.fileName);
	}

	function selectFile(event: Event): void {
		if (props.isLoading) return;

		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		const allowedTypes = ["image/jpeg", "image/png"];
		const maxSize = 2 * 1024 * 1024;

		if (!allowedTypes.includes(file.type)) {
			emit("uploadError", "Only JPG, JPEG, and PNG images are allowed.");
			input.value = "";
			return;
		}

		if (file.size > maxSize) {
			emit("uploadError", "Image must be 2 MB or smaller.");
			input.value = "";
			return;
		}

		selectedFile.value = file;
		selectedImageId.value = null;
	}

	function confirmSelection(): void {
		if (props.isLoading) return;

		if (!selectedFile.value) return;

		emitUpload(selectedFile.value);
	}

	function emitUpload(file: File): void {
		if (props.isLoading) return;

		emit("onUpload", file);
	}

	function emitRemoveImage(id: string): void {
		if (props.isLoading) return;

		if (selectedImageId.value === id) {
			selectedImageId.value = null;
		}

		emit("removeImage", id);
	}

	function emitCloseImage(): void {
		emit("closeImage");
	}
</script>

<style scoped>
	.upload-modal-backdrop {
		z-index: 1050;
		background: rgba(0, 0, 0, 0.5);
	}

	.upload-modal-content {
		height: 480px;
		width: 600px;
		max-width: 90vw;
	}

	.image-card {
		width: 100px;
		cursor: pointer;
		transition: width 0.15s ease, border 0.15s ease, box-shadow 0.15s ease;
	}

	.image-card:has(.selected-thumb) {
		width: 196px;
	}

	.upload-thumb {
		width: 88px;
		height: 70px;
		object-fit: cover;
		transition: width 0.15s ease, height 0.15s ease;
	}

	.selected-thumb {
		width: 180px;
		height: 140px;
	}

	.del {
		width: 20px;
		height: 20px;
		padding: 0;
		font-size: 16px;
		line-height: 18px;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.image-card:hover .del {
		opacity: 1;
	}

	.imgDiv {
		font-size: 12px;
		overflow-wrap: anywhere;
		word-break: break-word;
	}
</style>
