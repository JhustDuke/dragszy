<template>
	<div>
		<!-- category level - "card", eventually "navbar", "footer" -->
		<div class="d-flex flex-wrap gap-1 mt-1">
			<span
				v-for="categoryName in categoryNames"
				:key="categoryName"
				class="badge border"
				:class="
					isCategoryActive(categoryName) ? 'blue lighten-2' : 'grey darken-2'
				"
				role="button"
				@click="handleCategorySelect(categoryName)">
				{{ categoryName }}
			</span>
		</div>

		<BlockVariants
			:variants="activeVariants"
			:activePreset="appActionStore.getActiveBlock.variant"
			@select="handleVariantSelect" />
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useAppActionStore } from "~/store";
	import { blockPresetFactory } from "~/presets/bs5";
	import type { BlockPresetVariant } from "~/presets/types";
	import BlockVariants from "./BlockVariants.vue";

	const appActionStore = useAppActionStore();

	const categoryNames = computed(function (): string[] {
		return blockPresetFactory.blockElemsData().categoryNames;
	});

	const activeVariants = computed(function (): BlockPresetVariant[] {
		return blockPresetFactory.getVariants(
			appActionStore.getActiveBlock.category ?? ""
		);
	});

	function isCategoryActive(categoryName: string): boolean {
		return appActionStore.getActiveBlock.category === categoryName;
	}

	function handleCategorySelect(categoryName: string): void {
		appActionStore.setActiveBlockCategory(categoryName);
	}

	function handleVariantSelect(variant: BlockPresetVariant): void {
		appActionStore.setActiveBlockVariant(variant.preset);
	}
</script>
