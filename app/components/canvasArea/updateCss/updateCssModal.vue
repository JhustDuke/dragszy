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
			class="position-absolute top-50 start-50 translate-middle bg-white rounded shadow d-flex flex-column"
			style="width: 70%; height: 80vh; z-index: 1001">
			<!-- Header -->
			<div
				class="border-bottom p-3 d-flex justify-content-between align-items-center">
				<h5 class="mb-0">Update CSS</h5>

				<button
					type="button"
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- Tabs -->
			<ul class="nav nav-tabs px-3 pt-3">
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
			<div class="flex-grow-1 overflow-auto p-4">
				<component :is="activeTab.component" />
			</div>

			<!-- Footer -->
			<div class="border-top p-3 d-flex justify-content-end gap-2">
				<button
					type="button"
					class="btn btn-secondary"
					@click="closeModal">
					Cancel
				</button>

				<button
					type="button"
					class="btn btn-primary"
					@click="done">
					Done
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import ClassesTab from "./ClassesTab.vue";
	import InlineStylesTab from "./InlineStylesTab.vue";

	interface Props {
		isVisible: boolean;
	}

	defineProps<Props>();

	const emit = defineEmits<{
		(e: "close"): void;
		(e: "done"): void;
	}>();

	const tabs = [
		{
			title: "Classes",
			component: ClassesTab,
		},
		{
			title: "Inline Styles",
			component: InlineStylesTab,
		},
	] as const;

	const activeTab = ref<(typeof tabs)[number]>(tabs[0]);

	function closeModal(): void {
		emit("close");
	}

	function done(): void {
		emit("done");
	}
</script>

<style scoped>
	.active {
		background-color: grey !important;
		color: white !important;
	}
</style>
