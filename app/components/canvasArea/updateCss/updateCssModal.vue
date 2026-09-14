<template>
	<Teleport to="body">
		<div
			id="updateModal"
			class="bg-white rounded shadow d-flex flex-column"
			:style="modalStyle"
			@mousedown.stop>
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
	</Teleport>
</template>

<script setup lang="ts">
	import { shallowRef, computed } from "vue";
	import { useCanvasElemsStore } from "~/store";

	import ClassesTab from "./ClassesTab.vue";
	import InlineStylesTab from "./InlineStylesTab.vue";
	import TextContentTab from "./InsertTextContent.vue";
	import PerElemAttr from "./PerElemAttr.vue";
	import CustomIdTab from "./CustomIDTab.vue";

	const canvasElemsStore = useCanvasElemsStore();

	const tabs = [
		{ title: "Text", component: TextContentTab },
		{ title: "Classes", component: ClassesTab },
		{ title: "Atrrs", component: PerElemAttr },
		{ title: "Inline Styles", component: InlineStylesTab },
		{ title: "ID", component: CustomIdTab },
	] as const;

	const activeTab = shallowRef<(typeof tabs)[number]>(tabs[0]);

	//experiment: always fixed + centered on screen now, regardless of
	//which elem is being edited, since the modal always teleports to
	//body and there's never a positioned ancestor to sit "just below"
	//anymore.
	const modalStyle = computed(function () {
		return {
			position: "fixed" as const,
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			width: "75vw",
			maxWidth: "80vw",
			zIndex: 1001,
		};
	});

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
