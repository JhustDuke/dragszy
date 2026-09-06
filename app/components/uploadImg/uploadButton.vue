<template>
	<button
		type="button"
		class="btn btn-sm white me-2"
		@click="isModalOpen = true">
		Upload Image
	</button>

	<UploadImageModal
		v-if="isModalOpen || imageLibraryStore.isFromInlineTab.shouldShow"
		:images="imageLibraryStore.getImages"
		:error-message="errorMessage"
		:is-loading="isLoading"
		@close-image="closeModal"
		@on-upload="onUpload"
		@choose-image="chooseImage"
		@upload-error="setUploadError"
		@remove-image="removeImage" />
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";
	import { useImageLibraryStore } from "~/store";
	import UploadImageModal from "./uploadModal.vue";

	const imageLibraryStore = useImageLibraryStore();

	const isModalOpen = ref(false);
	const errorMessage = ref("");
	const isLoading = ref(false);

	watch(errorMessage, function (message) {
		if (!message) return;

		setTimeout(function () {
			errorMessage.value = "";
		}, 5000);
	});

	function onUpload(file: File): void {
		errorMessage.value = "";
		isLoading.value = true;

		const reader = new FileReader();

		reader.onload = function () {
			const base64 = reader.result as string;

			imageLibraryStore.addImage(file.name, base64);
			isLoading.value = false;
		};

		reader.onerror = function () {
			errorMessage.value = "Couldn't read that file. Try again.";
			isLoading.value = false;
		};

		reader.readAsDataURL(file);
	}

	function chooseImage(id: string, fileName: string): void {
		imageLibraryStore.setInlineTabImage(id);
		closeModal();

		// Handle chosen image here.
	}

	function setUploadError(message: string): void {
		errorMessage.value = message;
	}

	function closeModal(): void {
		isModalOpen.value = false;
		imageLibraryStore.isFromInlineTab.shouldShow = false;
	}
	function removeImage(id: string): void {
		imageLibraryStore.removeImage(id);
	}
</script>
