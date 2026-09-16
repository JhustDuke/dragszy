<template>
	<div>
		<ElemTypes
			:elem-types="allElemTypes"
			:selected-elem-type="selectedElemType"
			@select="handleElemTypeSelect" />

		<div
			v-if="variants.length > 0"
			class="d-flex flex-wrap gap-1 mt-1">
			<span
				v-for="variant in variants"
				:key="variant.label"
				class="badge border"
				:class="isVariantActive(variant) ? 'blue lighten-2' : 'grey darken-2'"
				role="button"
				@click="handleVariantSelect(variant)"
				@mouseenter="showAndHideToolTip(hints.cssType, { left: 90, top: 30 })">
				{{ variant.label }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useAppActionStore } from "~/store";
	import { SingleElemDataFactory } from "~/presets/bs5";
	import { allElems, type AllElemType } from "~/presets/common";
	import type { Preset } from "~/presets";
	import ElemTypes from "./ElemTypes.vue";
	import { showAndHideToolTip, hints } from "#imports";

	//appAction store is the store that handles
	//which elem is currently selected
	//so it can be created where necessary
	const appActionStore = useAppActionStore();

	//every elem type that exists, sourced from allElems - the single place
	//that defines which elem types exist at all
	const allElemTypes = Object.keys(allElems) as AllElemType[];

	const selectedElemType = computed(function () {
		return appActionStore.getSelectedElemType as AllElemType;
	});

	//variants for whichever elem type is currently selected
	//e.g. selectedElemType = "div" -> [Centered, Container, Card, Aside]
	const variants = computed(function () {
		return SingleElemDataFactory.getElemData(selectedElemType.value).variants;
	});

	function handleElemTypeSelect(elemType: AllElemType): void {
		appActionStore.setSelectedElemType(elemType as keyof HTMLElementTagNameMap);
	}

	function isVariantActive(variant: Preset): boolean {
		const selectedClasses = appActionStore.getSelectedPresetClasses;
		const selectedCustomStyles = appActionStore.getSelectedPreseCustomStyles;
		const variantStyles = variant.customStyles ?? {};

		//different lengths means they can't be the same list at all
		if (selectedClasses.length !== variant.classes.length) {
			return false;
		}

		//same length, so check every class matches in the same position
		for (let i = 0; i < selectedClasses.length; i++) {
			if (selectedClasses[i] !== variant.classes[i]) {
				return false;
			}
		}

		const selectedStyleKeys = Object.keys(selectedCustomStyles);
		const variantStyleKeys = Object.keys(variantStyles);

		//different key counts means they can't be the same styles object
		if (selectedStyleKeys.length !== variantStyleKeys.length) {
			return false;
		}

		//same key count, so check every key's value matches
		for (const key of variantStyleKeys) {
			if (selectedCustomStyles[key] !== variantStyles[key]) {
				return false;
			}
		}

		//classes matched AND styles matched - genuinely the same variant
		return true;
	}

	function handleVariantSelect(variant: Preset): void {
		if (isVariantActive(variant)) {
			return;
		}

		appActionStore.setSelectedPresetClasses(variant.classes);
		appActionStore.setSelectedPresetCustomStyles(variant.customStyles ?? {});
	}
</script>
