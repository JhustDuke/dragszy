<template>
	<div
		class="position-fixed top-0 start-0 w-100 h-100"
		:class="isVisible ? 'd-block' : 'd-none'"
		style="z-index: 1000">
		<!-- Backdrop -->
		<div
			class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
			@click="closeModal"></div>

		<!-- Modal -->
		<div
			class="position-absolute top-50 start-50 translate-middle bg-white rounded shadow"
			style="width: 75%; height: 300px; z-index: 1001">
			<div class="d-flex justify-content-end border-bottom p-2">
				<button
					type="button"
					class="btn-close"
					@click="closeModal"></button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface Props {
		isVisible: boolean;
	}

	defineProps<Props>();

	const emit = defineEmits<{
		(e: "close"): void;
	}>();

	function closeModal(): void {
		emit("close");
	}
</script>
