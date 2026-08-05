<template>
	<div v-if="activeElem">
		<label class="form-label">Custom ID</label>

		<input
			type="text"
			class="form-control"
			placeholder="e.g. hero-section"
			v-model="customIdDraft"
			@blur="commitCustomId"
			@keydown.enter.prevent="commitCustomId" />

		<small class="text-muted">
			This is the only way an elem gets a real id="..." in the exported file -
			the internal dragzy- id is never exported.
		</small>
	</div>

	<div
		v-else
		class="text-muted">
		No elem selected.
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { useCanvasElemsStore } from "~/store";

	const canvasElemsStore = useCanvasElemsStore();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	const customIdDraft = ref("");

	watch(
		activeElem,
		function () {
			customIdDraft.value = activeElem.value?.customId ?? "";
		},
		{
			immediate: true,
		}
	);

	function commitCustomId(): void {
		if (!activeElem.value) {
			return;
		}

		canvasElemsStore.updateElemCustomId(
			activeElem.value.id,
			customIdDraft.value.trim()
		);
	}

	defineExpose({
		commitCustomId,
	});
</script>
