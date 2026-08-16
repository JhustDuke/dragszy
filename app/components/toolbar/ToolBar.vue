<template>
	<!-- Toolbar -->
	<div
		class="container-fluid black border-bottom position-fixed mb-1"
		style="z-index: 9999">
		<div class="d-flex justify-content-between">
			<!-- left contents -->
			<div class="col-auto d-flex gap-1">
				<ToolBarActionSelect />
				<Defaults />
			</div>

			<!-- right -->
			<div>
				<CompilerSelect />
			</div>
		</div>
		<!-- presets rows -->
		<div class="row">
			<div class="col-12">
				<div class="d-flex justify-content-between">
					<section>
						<SupportedElemTypes />
						<PresetRow />
						<positioning />
					</section>
					<section>
						<UndoRedo />
					</section>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Defaults from "./defaults/Defaults.vue";
	import ToolBarActionSelect from "./ToolBarActionSelect.vue";
	import SupportedElemTypes from "./ElemTypes.vue";
	import CompilerSelect from "./Compile.vue";
	import PresetRow from "./PresetsStyles.vue";
	import positioning from "./CssPositioning.vue";
	import UndoRedo from "./UndoRedo.vue";
</script>
