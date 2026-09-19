<template>
	<Teleport to="body">
		<div
			id="updateModal"
			class="bg-white rounded shadow d-flex flex-column"
			:style="modalStyle"
			@mousedown.stop>
			<!-- Header -->
			<div
				class="border-bottom p-2 d-flex justify-content-between align-items-center"
				style="cursor: move"
				@mousedown="startDragging">
				<h6 class="mb-0">Update CSS (you can drag me)</h6>

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
						class="nav-link position-relative"
						:class="{ active: activeTab.title === tab.title }"
						@click="activeTab = tab">
						{{ tab.title }}
						<span
							v-if="tab.title === 'Inline Styles' && hasCustomStyle"
							class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
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
	import { shallowRef, computed, ref, onUnmounted } from "vue";
	import { useCanvasElemsStore } from "~/store";

	import ClassesTab from "./ClassesTab.vue";
	import InlineStylesTab from "./InlineStylesTab.vue";
	import TextContentTab from "./InsertTextContent.vue";
	import PerElemAttr from "./PerElemAttr.vue";
	import CustomIdTab from "./CustomIDTab.vue";
	import SelectOptionsEditor from "./selectOptionEditor.vue";

	const canvasElemsStore = useCanvasElemsStore();

	//"Options" only appears in the list while a <select> is the active
	//elem - every other elem type sees the original five tabs, unchanged
	const tabs = computed(function () {
		const baseTabs = [
			{ title: "Text", component: TextContentTab },
			{ title: "Classes", component: ClassesTab },
			{ title: "Atrrs", component: PerElemAttr },
			{ title: "Inline Styles", component: InlineStylesTab },
			{ title: "ID", component: CustomIdTab },
		];

		if (canvasElemsStore.activeElem?.elemType === "select") {
			baseTabs.push({ title: "Options", component: SelectOptionsEditor });
		}

		return baseTabs;
	});

	const hasCustomStyle = computed(function () {
		if (
			canvasElemsStore.activeElem?.customStyles &&
			Object.keys(canvasElemsStore.activeElem.customStyles).length > 0
		) {
			return true;
		}
		return false;
	});
	const activeTab = shallowRef(tabs.value[0] || { title: "", component: null });

	const modalLeft = ref<number | null>(null);
	const modalTop = ref<number | null>(null);

	const isDragging = ref(false);
	const dragStartX = ref(0);
	const dragStartY = ref(0);
	const initialLeft = ref(0);
	const initialTop = ref(0);

	//experiment: always fixed + centered on screen now, regardless of
	//which elem is being edited, since the modal always teleports to
	//body and there's never a positioned ancestor to sit "just below"
	//anymore.
	const modalStyle = computed(function () {
		if (modalLeft.value !== null && modalTop.value !== null) {
			return {
				position: "fixed" as const,
				top: modalTop.value + "px",
				left: modalLeft.value + "px",
				width: "75vw",
				maxWidth: "80vw",
				zIndex: 1001,
			};
		}

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

	const startDragging = function (ev: MouseEvent): void {
		const modal = document.getElementById("updateModal");

		if (!modal) return;

		const modalRect = modal.getBoundingClientRect();

		//Convert the initially centered modal position into actual
		//viewport coordinates before dragging starts.
		modalLeft.value = modalRect.left;
		modalTop.value = modalRect.top;

		dragStartX.value = ev.clientX;
		dragStartY.value = ev.clientY;

		initialLeft.value = modalRect.left;
		initialTop.value = modalRect.top;

		isDragging.value = true;

		document.addEventListener("mousemove", handleDragging);
		document.addEventListener("mouseup", stopDragging);
	};

	const handleDragging = function (ev: MouseEvent): void {
		if (!isDragging.value) return;

		const horizontalMovement = ev.clientX - dragStartX.value;
		const verticalMovement = ev.clientY - dragStartY.value;

		modalLeft.value = initialLeft.value + horizontalMovement;
		modalTop.value = initialTop.value + verticalMovement;
	};

	const stopDragging = function (): void {
		if (!isDragging.value) return;

		isDragging.value = false;

		document.removeEventListener("mousemove", handleDragging);
		document.removeEventListener("mouseup", stopDragging);
	};

	onUnmounted(function () {
		document.removeEventListener("mousemove", handleDragging);
		document.removeEventListener("mouseup", stopDragging);
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
