<template>
	<div v-if="appActionStore.getActiveAction === 'create'">
		<div
			v-if="presets.length > 0"
			class="d-flex flex-wrap gap-1 mt-1">
			<span
				v-for="preset in presets"
				:key="preset.label"
				class="badge border"
				:class="isActive(preset) ? 'blue lighten-2' : 'grey darken-2'"
				role="button"
				@click="pickPreset(preset)"
				@mouseenter="
					showAndHideToolTip(hints.cssType, {
						left: 90,
						top: 30,
					})
				">
				{{ preset.label }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useAppActionStore } from "~/store";
	import { usePresetStore } from "~/store/presetStore";
	import type { Preset } from "~/store/utils/presets";
	import type { SupportedElemType } from "~/types";
	import { showAndHideToolTip, hints } from "#imports";

	const appActionStore = useAppActionStore();
	const presetStore = usePresetStore();

	//presets for whichever elem type is currently selected in the toolbar
	//e.g. selectedElemType = "div" -> presets = [Centered, Container, Card, Aside]
	const presets = computed(function () {
		return presetStore.getPresets(
			appActionStore.getSelectedElemType as SupportedElemType
		);
	});

	function isActive(preset: Preset): boolean {
		const selected = appActionStore.getSelectedPresetClasses;
		return (
			selected.length === preset.classes.length &&
			selected.every(function (className, index) {
				return className === preset.classes[index];
			})
		);
	}

	function pickPreset(preset: Preset): void {
		//clicking the already-active preset again deselects it, falling
		//back to the elem type's normal default classes
		if (isActive(preset)) {
			appActionStore.setSelectedPresetClasses([]);
			return;
		}

		appActionStore.setSelectedPresetClasses(preset.classes);
	}
</script>
