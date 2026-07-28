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
			style="width: 75%; max-height: 80vh; z-index: 1001">
			<!-- Header -->
			<div class="d-flex justify-content-end border-bottom p-2">
				<button
					type="button"
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- Tabs -->
			<ul class="nav nav-tabs px-3 pt-2">
				<li class="nav-item">
					<button
						type="button"
						class="nav-link"
						:class="{ active: activeTab === 'elem' }"
						@click="activeTab = 'elem'">
						Elem Defaults
					</button>
				</li>
				<li class="nav-item">
					<button
						type="button"
						class="nav-link"
						:class="{ active: activeTab === 'nudge' }"
						@click="activeTab = 'nudge'">
						Nudge Defaults
					</button>
				</li>
			</ul>

			<!-- Body -->
			<div
				class="p-4"
				style="overflow-y: auto">
				<ElemDefaultsTab v-if="activeTab === 'elem'" />
				<NudgeDefaultsTab v-if="activeTab === 'nudge'" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import ElemDefaultsTab from "./ElemDefaultsTab.vue";
	import NudgeDefaultsTab from "./NudgeDefaultsTab.vue";

	interface Props {
		isVisible: boolean;
	}

	defineProps<Props>();

	const emit = defineEmits<{
		(e: "close"): void;
	}>();

	const activeTab = ref<"elem" | "nudge">("elem");

	function closeModal(): void {
		emit("close");
	}
</script>
