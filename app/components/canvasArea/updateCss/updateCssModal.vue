<template>
	<div
		id="updateModal"
		
		class="position-absolute bg-white rounded shadow d-flex flex-column"
		style="
			width: 75vw;
			max-width: 80vw;
			z-index: 1001;
			top: calc(100% + 10px);
			left: 50%;
			transform: translateX(-50%);
		">
		<!-- Header -->
		<div
			class="border-bottom p-2 d-flex justify-content-between align-items-center">
			<h6 class="mb-0">Update CSS</h6>

			<button
				type="button"
				@click.stop="closeModal">
				X
			</button>
		</div>

		<!-- Tabs -->
		<ul class="nav nav-tabs px-2 pt-2">
			<li
				v-for="tab in tabs"
				:key="tab.title"
				class="nav-item">
				<button
					type="button"
					class="nav-link"
					:class="{ active: activeTab.title === tab.title }"
					@click="activeTab = tab">
					{{ tab.title }}
				</button>
			</li>
		</ul>

		<!-- Body -->
		<div
			class="p-3"
			style="max-height: 50vh; overflow-y: auto">
			<component :is="activeTab.component" />
		</div>

		<!-- Footer -->
		<div class="border-top p-2 d-flex justify-content-end gap-2">
			<button
				type="button"
				class="btn btn-sm btn-secondary"
				@click="closeModal">
				Cancel
			</button>

			<button
				type="button"
				class="btn btn-sm btn-primary"
				@click="done">
				Done
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { shallowRef } from "vue";
	import { useCanvasElemsStore } from "~/store";

	import ClassesTab from "./ClassesTab.vue";
	import InlineStylesTab from "./InlineStylesTab.vue";
	import TextContentTab from "./InsertTextContent.vue";
	import CustomIdTab from "./CustomIDTab.vue";

	const canvasElemsStore = useCanvasElemsStore();

	const tabs = [
		{ title: "Text", component: TextContentTab },
		{ title: "Classes", component: ClassesTab },
		{ title: "Inline Styles", component: InlineStylesTab },
		{ title: "ID", component: CustomIdTab },
	] as const;

	const activeTab = shallowRef<(typeof tabs)[number]>(tabs[0]);

	function closeModal(): void {
		canvasElemsStore.closeEditModal();
	}

	function done(): void {
		canvasElemsStore.closeEditModal();
	}
</script>

<style scoped>
	.active {
		background-color: grey !important;
		color: white !important;
	}
</style>
