<template>
	<button
		type="button"
		class="btn btn-sm white mx-1"
		@click="enableImportAction"
		@mouseenter="
			showAndHideToolTip(hints.importInfo, {
				left: 50,
				top: 30,
			})
		">
		import style
	</button>
</template>

<script setup lang="ts">
	import { useAppActionStore } from "~/store";

	import { showAndHideToolTip, hints } from "#imports";

	const appActionStore = useAppActionStore();
	const enableImportAction = function () {
		appActionStore.setActiveAction("imports");
		appActionStore.showImportModal = true;
	};
</script>
