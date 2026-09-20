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
			:value="label">
			{{ label }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import { computed, onMounted, onUnmounted } from "vue";
	import { useAppActionStore } from "~/store";
	import { showAndHideToolTip, hints } from "#imports";
	import type { AppAction } from "~/types";

	const appActionStore = useAppActionStore();

	const selectedAction = computed({
		get: function (): AppAction {
			return appActionStore.getActiveAction;
		},
		set: function (action: AppAction): void {
			appActionStore.setActiveAction(action);
		},
	});

	const Optionlabels: AppAction[] = ["create", "resize", "presets", "imports"];

	function handleKeyDown(event: KeyboardEvent): void {
		const target = event.target as HTMLElement;

		if (
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			target.tagName === "SELECT"
		) {
			return;
		}

		if (event.key === "r") {
			selectedAction.value = "resize";
			return;
		}

		if (event.key === "c") {
			selectedAction.value = "create";
			return;
		}

		if (event.key === "p") {
			selectedAction.value = "presets";
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
