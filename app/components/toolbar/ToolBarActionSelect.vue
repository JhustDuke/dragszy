<template>
	<select
		v-model="selectedAction"
		class="form-select"
		@mouseenter="
			showAndHideToolTip(hints.action, {
				left: 50,
				top: 30,
			})
		">
		<option
			v-for="label in Optionlabels"
			:key="label"
			:value="label"
			:selected="label === 'create'">
			{{ label }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import { ref, watch, onMounted, onUnmounted } from "vue";
	import { useAppActionStore } from "~/store";
	import { showAndHideToolTip, hints } from "#imports";
	import type { AppAction } from "~/types";

	const appActionStore = useAppActionStore();

	const selectedAction = ref<AppAction>("create");

	const Optionlabels: AppAction[] = [
		"create",
		"resize",
		"components",
		"imports",
	];

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

		if (event.key === "k") {
			selectedAction.value = "components";
			return;
		}
		if (event.key === "i") {
			selectedAction.value = "imports";
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
