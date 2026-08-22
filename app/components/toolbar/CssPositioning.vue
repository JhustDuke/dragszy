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
	import { computed, ref, onMounted } from "vue";
	import { useAppActionStore, useCanvasElemsStore } from "~/store";

	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	const toastMessage = ref("");
	let toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

	const isClicked = ref(false);
	function showAbsoluteToToast(): void {
		isClicked.value = !isClicked.value;
		identifyRelativeElems();
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

	/**
	 * what do  i want when i click absolute-to
	 * every elem that has an attribute of dragzy-elem and also
	 * has a class or inline style with name relative in it is highlighted
	 *  with yellow
	 * and when either of them is clicked the previously selected elem would be force to sit absolute to it
	 * now this element must be removed from whatever parent it was inside
	 * also the new elems absolute position should be controlled by drraging it
	 *
	 * to do this
	 * i need to create a method that looks at every elem classes or inline style for position relative
	 * get their id
	 * store it some where in an array variable in the store
	 * now another would be watch the store action
	 * when the absoluteTo is clicked
	 * it goes to that array
	 * gets all elems with that id
	 * and change their border to yellow
	 *
	 * and then another handler that only runs on action 'position'
	 * in the new elem simply runs
	 * by extracting that parent from where it was
	 * to the parent, if any of the activeElem
	 */

	const identifyRelativeElems = function () {
		const elemsId: string[] = canvasElemsStore.relativeElemsIds;

		if (elemsId.length > 0 && isClicked.value) {
			elemsId.forEach(function (elem: string) {
				document
					.getElementById(elem)!
					.style.setProperty("border", "4px solid black", "important");
			});
			return;
		} else {
			elemsId.forEach(function (elem: string) {
				document.getElementById(elem)!.style.removeProperty("border");
			});
		}
	};
</script>
