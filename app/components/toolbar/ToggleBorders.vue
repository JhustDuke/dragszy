<template>
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
			class="form-check-label white-text"
			for="showBorders">
			Show borders
		</label>
	</div>
</template>

<script setup lang="ts">
	import { useAppActionStore as appActionStore } from "~/store";
</script>

<style scoped></style>
