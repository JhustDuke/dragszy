<template>
	<button
		type="button"
		class="btn btn-sm white me-2"
		@click="isModalOpen = true">
		Upload Image
	</button>

	<UploadImageModal
		v-if="isModalOpen"
		:images="images"
		:error-message="errorMessage"
		@close="isModalOpen = false"
		@select="handleSelect"
		@file-chosen="handleFileChosen" />
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import UploadImageModal from "./uploadModal.vue";

	interface LibraryImage {
		id: string;
		fileName: string;
		base64: string;
	}

	const isModalOpen = ref(false);
	const images = ref<LibraryImage[]>([]);
	const errorMessage = ref("");

	function handleSelect(id: string, fileName: string): void {
		// handle selected image
	}

	function handleFileChosen(file: File): void {
		// handle selected file
	}
</script>
