<template>
	<!-- Toolbar -->
	<div
		class="container-fluid black border-bottom position-fixed py-1"
		style="z-index: 1000">
		<!-- Row 1 -->
		<div class="d-flex justify-content-between align-items-center">
			<div class="d-flex align-items-center gap-1">
				<ToolBarActionSelect />
			</div>

			<div class="d-flex align-items-center">
				<CompilerSelect />
			</div>
		</div>

		<!-- Row 2 -->
		<div class="d-flex justify-content-between align-items-center">
			<div class="d-flex align-items-center">
				<Presets />
			</div>

			<div class="d-flex align-items-center gap-3">
				<div class="form-check form-switch">
					<input
						id="showBorders"
						class="form-check-input"
						type="checkbox"
						:checked="appActionStore().getShowElemOutlines"
						@change="
							appActionStore().setShowElemOutlines(
								($event.target as HTMLInputElement).checked
							)
						" />
					<label
						class="form-check-label"
						for="showBorders">
						Show borders
					</label>
				</div>
				<UndoRedo />
				<saveBtn />
			</div>
		</div>

		<!-- Row 3 -->
		<div class="d-flex align-items-center gap-2 ms-3"> </div>
	</div>
</template>

<script setup lang="ts">
	import ToolBarActionSelect from "./ToolBarActionSelect.vue";
	import CompilerSelect from "./Compile.vue";
	import SingleElemPresets from "./presetStyles/singleElem/SingleElemPresets.vue";
	import Presets from "./presetStyles/presets.vue";
	import UndoRedo from "./UndoRedo.vue";
	import saveBtn from "./SaveBtn.vue";
	import { useAppActionStore as appActionStore } from "~/store";
</script>
