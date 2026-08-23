<template>
	<div
		v-if="appActionStore.getActiveAction === 'position'"
		class="d-flex flex-wrap gap-1 mt-1">
		<div
			:disabled="canvasElemsStore.activeElem"
			id="positioning">
			<span
				class="badge border grey darken-2 active"
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

			<span
				class="badge border grey darken-2"
				role="button"
				@click="toggleShowRelative">
				show relative elems
			</span>

			<span
				class="badge border grey darken-2"
				role="button"
				@click="toggleShowAbsolute">
				show absolute elems
			</span>
		</div>
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
	import { computed, ref, watch, nextTick } from "vue";
	import { useAppActionStore, useCanvasElemsStore } from "~/store";
	import { togglePositionedElemsHighlight } from "../../utils";

	const appActionStore = useAppActionStore();
	const canvasElemsStore = useCanvasElemsStore();

	watch(
		function () {
			return appActionStore.getActiveAction;
		},
		function (newAction) {
			if (newAction !== "position") return;

			// wait one tick for the v-if'd div to actually be in the DOM
			nextTick(function () {
				setActiveBadge(document.getElementById("positioning")!);
			});
		},
		{ immediate: true }
	);
	console.log(33);

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

	/**
	 * what do  i want when i click absolute-to
	 * every elem that has an attribute of dragzy-elem and also
	 * has a class or inline style with name relative in it is highlighted
	 *  with yellow
	 * and when either of them is clicked the previously selected elem would be force to sit absolute to it
	 * now this element must be removed from whatever parent it was inside
	 * also the new elems absolute position should be controlled by drraging it
	 *
	 *
	 *
	 * and then another handler that only runs on action 'position'
	 * in the new elem simply runs
	 * by extracting that parent from where it was
	 * to the parent, if any of the activeElem
	 */

	//shared helper - toggles a highlight border on/off for a given set of
	//elem ids. reused by both the "show relative" and "show absolute"
	//buttons since the show/hide operation itself is identical, only the
	//id array and border color differ per caller

	const isRelativeShown = ref(false);
	function toggleShowRelative(): void {
		isRelativeShown.value = !isRelativeShown.value;
		togglePositionedElemsHighlight(
			canvasElemsStore.positionedElemsIds.relative,
			isRelativeShown.value,
			"black"
		);
	}

	const isAbsoluteShown = ref(false);
	function toggleShowAbsolute(): void {
		isAbsoluteShown.value = !isAbsoluteShown.value;
		togglePositionedElemsHighlight(
			canvasElemsStore.positionedElemsIds.absolute,
			isAbsoluteShown.value,
			"grey"
		);
	}

	const setActiveBadge = function (parent: HTMLElement) {
		const badges = parent?.querySelectorAll(".badge");

		if (!badges || badges.length === 0) return;

		let activeBadge = badges?.[0];

		badges.forEach(function (badge) {
			badge.addEventListener("click", function () {
				if (badge === activeBadge) return;

				activeBadge?.classList.remove("active");
				badge.classList.add("active");

				activeBadge = badge;
			});
		});

		activeBadge?.classList.add("active");
	};
</script>
<style scoped>
	.active {
		background-color: blue !important;
		padding: 0.4em !important;
	}
</style>
