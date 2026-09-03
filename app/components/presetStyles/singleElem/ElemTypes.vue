<template>
	<div class="d-flex flex-wrap gap-1 mt-1">
		<span
			v-for="elemType in elemTypes"
			:key="elemType"
			class="badge border"
			:class="
				selectedElemType === elemType ? 'blue lighten-2' : 'grey darken-2'
			"
			role="button"
			@click="$emit('select', elemType)"
			@mouseenter="showAndHideToolTip(hints.elemType, { left: 90, top: 34 })">
			{{ elemType }}
		</span>
	</div>
</template>

<script setup lang="ts">
	import type { AllElemType } from "~/presets/common";
	import { showAndHideToolTip, hints } from "#imports";

	//dumb child - no store access. receives the full list of elem types and
	//which one is currently selected, reports clicks back up via emit only
	defineProps<{
		elemTypes: AllElemType[];
		selectedElemType: AllElemType | null;
	}>();

	defineEmits<{
		select: [elemType: AllElemType];
	}>();
</script>
