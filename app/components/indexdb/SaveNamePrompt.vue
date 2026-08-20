<template>
	<div
		v-if="props.show"
		class="position-fixed top-50 start-50 translate-middle bg-white p-4 shadow rounded"
		style="z-index: 2000; width: 400px">
		<h6 class="green white-text text-center p-2"> Name this canvas </h6>

		<input
			v-model="canvasNameInput"
			type="text"
			class="form-control mb-3"
			placeholder="Canvas name"
			:disabled="props.isSaving"
			@input="checkInput" />

		<div class="d-flex gap-2">
			<button
				type="button"
				class="btn btn-primary flex-grow-1"
				:disabled="isBtnDisabled || props.isSaving"
				@click="confirmSave">
				<span
					v-if="props.isSaving"
					class="spinner-border spinner-border-sm me-2">
				</span>

				{{ props.isSaving ? "Saving..." : "Save" }}
			</button>

			<button
				type="button"
				class="btn btn-secondary"
				:disabled="props.isSaving"
				@click="cancel">
				Cancel
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	const props = defineProps<{
		show: boolean;
		isSaving: boolean;
	}>();

	const emit = defineEmits<{
		(e: "save", name: string): void;
		(e: "cancel"): void;
	}>();

	const canvasNameInput = ref("");
	const isBtnDisabled = ref(true);

	const checkInput = function (): void {
		if (!canvasNameInput.value.trim()) {
			isBtnDisabled.value = true;
			return;
		}

		isBtnDisabled.value = false;
	};

	const confirmSave = function (): void {
		emit("save", canvasNameInput.value.trim());
	};

	const cancel = function (): void {
		emit("cancel");
	};
</script>
