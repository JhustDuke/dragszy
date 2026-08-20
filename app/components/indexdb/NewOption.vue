<template>
	<div>
		<h6>Start a new canvas</h6>

		<input
			v-model="canvasName"
			type="text"
			class="form-control mb-3"
			placeholder="Canvas name"
			:disabled="props.isStartingNew" />

		<button
			type="button"
			class="green w-100"
			:disabled="props.isStartingNew"
			@click="startNewCanvas">
			<span
				v-if="props.isStartingNew"
				class="spinner-border spinner-border-sm me-2">
			</span>

			{{ props.isStartingNew ? "Creating..." : "Start New" }}
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	const props = defineProps<{
		isStartingNew: boolean;
		onStartNew: (name: string) => void;
	}>();

	const canvasName = ref("");

	const startNewCanvas = async function () {
		props.onStartNew(canvasName.value.trim());
	};
</script>
