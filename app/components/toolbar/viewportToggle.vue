<template>
	<!-- ============================================================ -->
	<!-- Viewport toggle widget: fixed bottom-right, switches canvas
	     preview between mobile / tablet / desktop widths -->
	<!-- ============================================================ -->
	<div
		class="d-flex position-fixed shadow rounded p-2 gap-2 black"
		style="bottom: 16px; right: 16px; z-index: 999">
		<!-- Mobile -->
		<button
			type="button"
			class="btn btn-sm"
			:class="
				viewportStore.activeViewport === 'mobile'
					? 'blue darken-2 white-text'
					: 'white blue-text text-darken-2'
			"
			@mouseenter="showAndHideToolTip(hints.mobile)"
			@click="viewportStore.setMobile()">
			<i class="fa fa-mobile fa-lg"></i>
		</button>

		<!-- Tablet -->
		<button
			type="button"
			class="btn btn-sm"
			:class="
				viewportStore.activeViewport === 'tablet'
					? 'blue darken-2 white-text'
					: 'white blue-text text-darken-2'
			"
			@mouseenter="showAndHideToolTip(hints.tab)"
			@click="viewportStore.setTablet()">
			<i class="fa fa-tablet fa-lg"></i>
		</button>
	</div>
</template>

<script setup lang="ts">
	import { showAndHideToolTip, hints } from "../../utils";
	import { useViewportStore } from "../../store";

	const viewportStore = useViewportStore();
</script>
