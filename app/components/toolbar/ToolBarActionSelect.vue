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
	import { ref, watch, onMounted, onUnmounted } from "vue";
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

	function handleKeyDown(event: KeyboardEvent): void {
		const target = event.target as HTMLElement;
		if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

		if (event.key === "r") {
			selectedAction.value = "resize";
			return;
		}

		if (event.key === "c") {
			selectedAction.value = "create";
			return;
		}

		if (event.key === "m") {
			selectedAction.value = "move";
			return;
		}
	}

	onMounted(function () {
		window.addEventListener("keydown", handleKeyDown);
	});

	onUnmounted(function () {
		window.removeEventListener("keydown", handleKeyDown);
	});
</script>
