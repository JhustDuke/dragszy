<template>
	<div>
		<SingleElemPresets v-if="appActionStore.getActiveAction === 'create'" />
		<BlockElemPresets v-if="appActionStore.getActiveAction === 'components'" />
		<imports v-if="appActionStore.getActiveAction === 'imports'" />
	</div>
</template>

<script setup lang="ts">
	import SingleElemPresets from "./singleElem/SingleElemPresets.vue";
	import BlockElemPresets from "./blockComponents/BlockPreset.vue";
	import Imports from "./importPresets/Imports.vue";
	import { useAppActionStore } from "~/store";

	const appActionStore = useAppActionStore();
</script>

<style scoped></style>
