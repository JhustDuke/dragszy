<template>
	<div>
		<!-- always visible, regardless of how many imports exist -->
		<button
			type="button"
			class="btn btn-sm btn-outline-primary"
			@click="isModalOpen = true">
			Import New
		</button>

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
		</div>

		<ImportNewModal
			v-if="isModalOpen"
			@close="isModalOpen = false" />
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useAppActionStore } from "~/store";
	import type { CanvasElem } from "~/types";
	import ImportNewModal from "./importModal.vue";

	const appActionStore = useAppActionStore();

	const isModalOpen = ref(false);

	//auto-opens the modal the first time this panel is shown with nothing
	//imported yet - a one-shot convenience, not persistent nagging. if the
	//user closes it without importing, it stays closed until they click
	//"Import New" manually - this check simply never re-triggers true
	//again once something's been imported, since importedElems only grows
	onMounted(function () {
		if (appActionStore.getImportedElems.length === 0) {
			isModalOpen.value = true;
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
</script>
