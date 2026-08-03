<template>
	<div
		v-if="appActionStore.getActiveAction === 'position' && activeElem"
		class="d-flex flex-wrap gap-1 mt-1">
		<span
			class="badge border grey darken-2"
			role="button"
			@click="applyFixed">
			Fixed
		</span>

		<span
			class="badge border grey darken-2"
			role="button"
			@click="applyAbsoluteViewport">
			Absolute - Viewport
		</span>

		<span
			class="badge border grey darken-2"
			role="button"
			@click="showAbsoluteToToast">
			Absolute - To
		</span>
	</div>

	<!-- lightweight self-contained toast, no external library needed -->
	<div
		v-if="toastMessage"
		class="position-fixed bottom-0 start-50 translate-middle-x mb-3 p-2 px-3 bg-dark text-white rounded shadow"
		style="z-index: 2000; max-width: 320px">
		{{ toastMessage }}
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import { useAppActionStore, useCanvasElemsStore } from "~/store";

	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	const toastMessage = ref("");
	let toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

	function showAbsoluteToToast(): void {
		toastMessage.value =
			"Absolute needs a descendant of a positioned (relative) ancestor to anchor to - otherwise it falls back to the viewport.";

		if (toastTimeoutId) clearTimeout(toastTimeoutId);
		toastTimeoutId = setTimeout(function () {
			toastMessage.value = "";
		}, 4000);
	}

	//PositionRow lives at the toolbar level, not nested inside NewElem.vue,
	//so it has no direct elemRef the way resize/keyboard-shortcut logic
	//does. instead, the real rendered elem carries :id="newElemInfo.id",
	//so document.getElementById reaches it directly by that id.
	function findActiveElemNode(): HTMLElement | null {
		if (!activeElem.value) return null;
		return document.getElementById(activeElem.value.id);
	}

	//pins the elem to the viewport - stays put even while scrolling
	function applyFixed(): void {
		const elem = activeElem.value;
		const node = findActiveElemNode();
		if (!elem || !node) return;

		const rect = node.getBoundingClientRect();

		canvasElemsStore.updateElemInlineStyles(elem.id, {
			...(elem.customStyles ?? {}),
			position: "fixed",
			top: `${rect.top}px`,
			left: `${rect.left}px`,
		});
	}

	//anchors to the nearest positioned ancestor, or the viewport if none
	//exists - this is standard CSS behavior for position: absolute, not
	//something this code enforces or checks for
	function applyAbsoluteViewport(): void {
		const elem = activeElem.value;
		const node = findActiveElemNode();
		if (!elem || !node) return;

		const rect = node.getBoundingClientRect();

		canvasElemsStore.updateElemInlineStyles(elem.id, {
			...(elem.customStyles ?? {}),
			position: "absolute",
			top: `${rect.top + window.scrollY}px`,
			left: `${rect.left + window.scrollX}px`,
		});
	}
</script>
