<template>
	<!-- Toolbar -->
	<div class="container-fluid black py-1 border-bottom">
		<div class="row">
			<div class="col-auto d-flex gap-1">
				<ToolBarActionSelect />
				<Defaults />
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<SupportedElemTypes />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Defaults from "./defaults/Defaults.vue";
	import ToolBarActionSelect from "./ToolBarActionSelect.vue";
	import SupportedElemTypes from "./ElemTypes.vue";
</script>
