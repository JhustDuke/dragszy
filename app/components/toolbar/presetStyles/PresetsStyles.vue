<template>
	<div v-if="appActionStore.getActiveAction === 'create'">
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
	import { elemDataFactory } from "~/presets/bs5";
	import { allElems, type AllElemType } from "~/presets/common";
	import type { Preset } from "~/store/utils/presets";
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
		return elemDataFactory.getElemData(selectedElemType.value).variants;
	});

	function handleElemTypeSelect(elemType: AllElemType): void {
		appActionStore.setSelectedElemType(elemType as keyof HTMLElementTagNameMap);
	}

	function isVariantActive(variant: Preset): boolean {
		const selected = appActionStore.getSelectedPresetClasses;

		//different lengths means they can't be the same list at all
		if (selected.length !== variant.classes.length) {
			return false;
		}

		//same length, so check every class matches in the same position
		for (let i = 0; i < selected.length; i++) {
			if (selected[i] !== variant.classes[i]) {
				return false;
			}
		}

		//got through the loop with no mismatch - they're identical
		return true;
	}

	function handleVariantSelect(variant: Preset): void {
		//clicking the already-active variant again deselects it, falling
		//back to the elem type's normal default classes
		if (isVariantActive(variant)) {
			appActionStore.setSelectedPresetClasses([]);
			return;
		}

		appActionStore.setSelectedPresetClasses(variant.classes);
	}
</script>
