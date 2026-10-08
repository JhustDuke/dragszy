<template>
	<div
		v-if="isSmallScreen"
		class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center p-4 green lighten-4"
		style="z-index: 2000">
		<i class="fa fa-desktop fa-3x mb-3"></i>
		<h4>Dragzy works best on a desktop</h4>
		<p>Please switch to the desktop site or use a PC.</p>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from "vue";

	// screens narrower than this are "small" e.g. 768px
	const SMALL_SCREEN_MAX_WIDTH = 768;

	const isSmallScreen = ref(false);

	onMounted(function () {
		checkScreenWidth();
		window.addEventListener("resize", checkScreenWidth);
	});

	onUnmounted(function () {
		window.removeEventListener("resize", checkScreenWidth);
	});

	function checkScreenWidth() {
		isSmallScreen.value = window.innerWidth < SMALL_SCREEN_MAX_WIDTH;
	}
</script>
