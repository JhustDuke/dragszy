<template>
	<div
		v-if="appActionStore.getActiveAction === 'create'"
		class="d-flex flex-wrap gap-1 mt-1">
		<span
			v-for="elemType in supportedElemTypes"
			:key="elemType"
			class="badge border"
			:class="
				appActionStore.getSelectedElemType === elemType
					? 'blue lighten-2'
					: 'grey darken-2'
			"
			role="button"
			@click="
				appActionStore.setSelectedElemType(
					elemType as keyof HTMLElementTagNameMap
				)
			">
			{{ elemType }}
		</span>
	</div>
</template>

<script setup lang="ts">
	import { useAppActionStore } from "~/store";
	import { supportedElemTypes } from "~/types";
	const appActionStore = useAppActionStore();
</script>
