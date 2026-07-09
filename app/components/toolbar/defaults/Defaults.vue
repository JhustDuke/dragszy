<template>
	<div class="d-inline-block">
		<button
			class="btn btn-primary"
			@click="toggleModal">
			Defaults
		</button>

		<RelativeModal
			:isVisible="isModalVisible"
			@close="isModalVisible = false" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import RelativeModal from "./DefaultsModal.vue";

	const isModalVisible = ref(false);

	function toggleModal(): void {
		isModalVisible.value = !isModalVisible.value;
	}
</script>
