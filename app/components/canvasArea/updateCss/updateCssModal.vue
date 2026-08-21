<template>
	<div
		id="updateModal"
		v-if="canvasElemsStore.editModalPosition"
		class="position-absolute start-50 translate-middle-x bg-white rounded shadow d-flex flex-column"
		style="width: 75%; max-width: 80%; z-index: 1001"
		:style="{
			top: canvasElemsStore.editModalPosition.top + 'px',
			left: canvasElemsStore.editModalPosition.left + 'px',
		}">
		<!-- Header / Drag Handle -->
		<div
			class="border-bottom p-2 d-flex justify-content-between align-items-center"
			style="cursor: move"
			@mousedown="startDrag">
			<h6 class="mb-0">Update CSS</h6>

			<span class="small text-muted">↕ Drag me</span>

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
	import { onUnmounted, ref, shallowRef } from "vue";
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

	const isDragging = ref(false);
	const dragStartX = ref(0);
	const dragStartY = ref(0);
	const modalStartX = ref(0);
	const modalStartY = ref(0);

	function startDrag(event: MouseEvent): void {
		if (!canvasElemsStore.editModalPosition) return;

		const modal = document.getElementById("updateModal");
		if (!modal) return;

		isDragging.value = true;

		dragStartX.value = event.clientX;
		dragStartY.value = event.clientY;

		modalStartX.value = canvasElemsStore.editModalPosition.left as number;
		modalStartY.value = canvasElemsStore.editModalPosition.top as number;

		modal.addEventListener("mousemove", dragModal);
		modal.addEventListener("mouseup", stopDrag);
	}

	function dragModal(event: MouseEvent): void {
		if (!isDragging.value) return;

		const deltaX = event.clientX - dragStartX.value;
		const deltaY = event.clientY - dragStartY.value;

		canvasElemsStore.editModalPosition = {
			top: modalStartY.value + deltaY,
			left: modalStartX.value + deltaX,
		};
	}

	function stopDrag(): void {
		const modal = document.getElementById("updateModal");
		if (!modal) return;

		isDragging.value = false;

		modal.removeEventListener("mousemove", dragModal);
		modal.removeEventListener("mouseup", stopDrag);
	}

	onUnmounted(function () {
		const modal = document.getElementById("updateModal");
		if (!modal) return;

		modal.removeEventListener("mousemove", dragModal);
		modal.removeEventListener("mouseup", stopDrag);
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
