<template>
	<select
		v-model="selectedAction"
		class="form-select"
		@mouseenter="showAndHideToolTip(hints.action)">
		<option
			selected
			value="create"
			>Create</option
		>
		<option value="resize">Resize</option>
		<option value="move">Move</option>
	</select>
</template>

<script setup lang="ts">
	import { ref, watch } from "vue";
	import { useAppActionStore } from "~/store";
	import { showAndHideToolTip, hints } from "#imports";
	import type { AppAction } from "~/types";

	const appActionStore = useAppActionStore();

	const selectedAction = ref<AppAction>("create");

	watch(
		function () {
			return selectedAction.value;
		},
		function (newVal) {
			appActionStore.setActiveAction(newVal);
		},
		{ immediate: true }
	);
</script>
