<template>
	<div
		v-if="aiStore.isAiModalMinimized"
		class="position-fixed"
		style="bottom: 100px; right: 20px; z-index: 1050"
		@mousedown.stop>
		<button
			class="rounded-circle shadow position-relative"
			title="Restore Ask AI"
			aria-label="Restore Ask AI"
			@click="aiStore.setModalRestored()">
			<i class="fa fa-android"></i>

			<!-- red dot, shown when a reply arrived while minimized -->
			<span
				v-if="aiStore.responseNotice"
				class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
				<span class="visually-hidden">New AI response</span>
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
	import { useAiStore } from "~/store";

	const aiStore = useAiStore();
</script>
