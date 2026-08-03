<template>
	<!-- Toolbar -->
	<div class="container-fluid black py-1 border-bottom">
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
		<div class="row">
			<div class="col-12">
				<SupportedElemTypes />
				<PresetRow />
				<positioning />
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
</script>
