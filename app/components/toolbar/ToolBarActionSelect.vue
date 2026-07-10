<template>
	<select
		class="form-select"
		@mouseenter="showAndHideToolTip(hints.action)">
		<option selected>Action</option>
	</select>
</template>

<script setup lang="ts">
	import { showAndHideToolTip, hints } from "#imports";
</script>
