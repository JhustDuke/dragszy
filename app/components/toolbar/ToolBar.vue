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
				<ToggleBorder />
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
	import Presets from "./presetStyles/presets.vue";
	import UndoRedo from "./UndoRedo.vue";
	import saveBtn from "./SaveBtn.vue";
	import ToggleBorder from "./ToggleBorders.vue";
</script>
