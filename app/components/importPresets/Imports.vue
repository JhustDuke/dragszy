<template>
	<div>
		<div
			v-if="appActionStore.getImportedElems.length > 0"
			class="d-flex flex-wrap gap-1 mt-1">
			<span
				v-for="item in appActionStore.getImportedElems"
				:key="item.label"
				class="badge border"
				:class="isImportActive(item) ? 'blue lighten-2' : 'grey darken-2'"
				role="button"
				@click="handleSelect(item)">
				{{ item.label }}
			</span>

			<span
				class="btn btn-sm btn-outline-primary"
				@click="appActionStore.showImportModal = true"
				role="button">
				Import New
			</span>
		</div>

		<p
			v-if="lastError"
			class="text-danger mt-2">
			{{ lastError }}
		</p>

		<ImportNewModal
			v-if="appActionStore.showImportModal"
			@close="appActionStore.showImportModal = false"
			@error="handleImportError"
			@success="handleImportSuccess" />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
	import { useAppActionStore } from "~/store";
	import type { CanvasElem } from "~/types";
	import ImportNewModal from "./importModal.vue";

	const appActionStore = useAppActionStore();

	const lastError = ref("");

	onMounted(function () {
		if (appActionStore.getImportedElems.length === 0) {
			appActionStore.showImportModal = true;
		}
	});

	function isImportActive(item: {
		label: string;
		preset: CanvasElem;
	}): boolean {
		return appActionStore.getActiveImportedElem?.id === item.preset.id;
	}

	function handleSelect(item: { label: string; preset: CanvasElem }): void {
		appActionStore.setActiveImportedElem(item.preset);
	}

	//parent owns the actual store write - modal only ever hands back
	//parsed data, never touches appActionStore directly
	function handleImportSuccess(label: string, tree: CanvasElem): void {
		lastError.value = "";

		appActionStore.addImportedElem(label, tree);
		appActionStore.setActiveImportedElem(tree);

		appActionStore.showImportModal = false;
	}

	function handleImportError(message: string): void {
		lastError.value = message;

		setTimeout(function () {
			lastError.value = "";
		}, 3000);
	}
</script>
