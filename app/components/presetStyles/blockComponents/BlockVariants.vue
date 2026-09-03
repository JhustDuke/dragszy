<template>
	<div
		v-if="variants.length > 0"
		class="d-flex flex-wrap gap-1 mt-1">
		<span
			v-for="variant in variants"
			:key="variant.label"
			class="badge border"
			:class="isVariantActive(variant) ? 'blue lighten-2' : 'grey darken-2'"
			role="button"
			@click="$emit('select', variant)"
			@mouseenter="showAndHideToolTip(hints.cssType, { left: 90, top: 30 })">
			{{ variant.label }}
		</span>
	</div>
</template>

<script setup lang="ts">
	import type { BlockPresetVariant } from "~/presets/types";
	import type { CanvasElem } from "~/types";
	import { showAndHideToolTip, hints } from "#imports";

	//no logic beyond active-state comparison lives here on purpose -
	//BlockPreset.vue owns which category/variant is actually staged,
	//this component only renders and reports clicks back up via emit
	const props = defineProps<{
		variants: BlockPresetVariant[];
		activePreset: CanvasElem | null;
	}>();

	defineEmits<{
		select: [variant: BlockPresetVariant];
	}>();

	//comparing by .id, NOT object reference (===) - Vue/Pinia wraps
	//objects assigned into reactive state in a Proxy, so activePreset
	//(read from the store) is never === to variant.preset (the raw,
	//un-proxied constant from blockPresets), even for the exact same
	//preset. ids are plain strings, so this comparison is unaffected
	//by that wrapping and correctly reflects which variant is staged.
	function isVariantActive(variant: BlockPresetVariant): boolean {
		return props.activePreset?.id === variant.preset.id;
	}
</script>
