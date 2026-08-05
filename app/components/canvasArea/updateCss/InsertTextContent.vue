<template>
	<div v-if="activeElem">
		<label class="form-label">Text Content</label>

		<input
			type="text"
			class="form-control"
			placeholder="Enter text..."
			v-model="textContentDraft"
			@blur="commitTextContent"
			@keydown.enter.prevent="commitTextContent" />
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

	const textContentDraft = ref("");

	watch(
		activeElem,
		function () {
			textContentDraft.value = activeElem.value?.textContent ?? "";
		},
		{
			immediate: true,
		}
	);

	function commitTextContent(): void {
		if (!activeElem.value) {
			return;
		}

		canvasElemsStore.updateElemTextContent(
			activeElem.value.id,
			textContentDraft.value
		);
	}

	defineExpose({
		commitTextContent,
	});
</script>
