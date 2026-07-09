<template>
	<!-- Toolbar -->
	<div class="container-fluid black py-1 border-bottom">
		<div class="row">
			<div class="col-auto d-flex gap-1">
				<ToolBarActionSelect />
				<Defaults />
			</div>
		</div>
	</div>

	<!-- Canvas -->
	<div class="container mt-4">
		<div
			class="position-relative border border-dark"
			style="height: 500px">
			<!-- Top -->
			<div
				class="position-absolute top-0 start-50 translate-middle rounded-circle border border-primary bg-white"
				style="width: 14px; height: 14px"></div>

			<!-- Right -->
			<div
				class="position-absolute top-50 start-100 translate-middle rounded-circle border border-primary bg-white"
				style="width: 14px; height: 14px"></div>

			<!-- Bottom -->
			<div
				class="position-absolute top-100 start-50 translate-middle rounded-circle border border-primary bg-white"
				style="width: 14px; height: 14px"></div>

			<!-- Left -->
			<div
				class="position-absolute top-50 start-0 translate-middle rounded-circle border border-primary bg-white"
				style="width: 14px; height: 14px"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Defaults from "./defaults/Defaults.vue";
	import ToolBarActionSelect from "./ToolBarActionSelect.vue";
</script>
