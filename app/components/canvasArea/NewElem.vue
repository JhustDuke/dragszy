<template>
	<div class="container mt-4">
		<div
			class="position-relative border border-dark"
			:style="{
				height: nodeInfo.height + nodeInfo.heightUnit,
				width: nodeInfo.width + nodeInfo.widthUnit,
			}"
			@click="handleElemClick">
			<template v-if="isSelected">
				<!-- Top -->
				<div
					class="xy position-absolute top-0 start-50 translate-middle rounded-circle border border-primary bg-white"></div>

				<!-- Right -->
				<div
					class="xy position-absolute top-50 start-100 translate-middle rounded-circle border border-primary bg-white"></div>

				<!-- Bottom -->
				<div
					class="xy position-absolute top-100 start-50 translate-middle rounded-circle border border-primary bg-white"></div>

				<!-- Left -->
				<div
					class="xy position-absolute top-50 start-0 translate-middle rounded-circle border border-primary bg-white"></div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore } from "~/store";

	const props = defineProps<{
		nodeInfo: CanvasElem;
	}>();

	const canvasElemsStore = useCanvasElemsStore();

	const isSelected = computed(function () {
		return canvasElemsStore.activeElemId === props.nodeInfo.id;
	});

	function handleElemClick(event: MouseEvent): void {
		event.stopPropagation();
		canvasElemsStore.setActiveElem(props.nodeInfo.id);
	}
</script>

<style scoped>
	.xy {
		width: 14px;
		height: 14px;
	}
</style>
