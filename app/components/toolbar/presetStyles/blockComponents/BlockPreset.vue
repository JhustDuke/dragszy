```vue
<template>
	<div>
		<div
			v-if="blockPresetEntries.length > 0"
			class="d-flex flex-wrap gap-1 mt-1">
			<span
				class="badge border"
				role="button"
				@mouseenter="
					showAndHideToolTip(hints.cssType, {
						left: 90,
						top: 30,
					})
				">
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import type { CanvasElem } from "~/types";
	import { showAndHideToolTip, hints } from "#imports";

	//const appActionStore = useAppActionStore();

	const blockPresetEntries = computed(function () {
		return [];
		//return Object.entries(blockPresets);
	});

	//function isBlockPresetActive(preset: CanvasElem): boolean {
	//	return appActionStore.getSelectedBlockPreset === preset;
	//}

	function handleBlockPresetSelect(preset: CanvasElem): void {
		//appActionStore.setSelectedBlockPreset(preset);

		//temporary until the store wiring is added
		console.log("Selected block preset:");
	}
</script>
```
