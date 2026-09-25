<template>
	<div
		style="z-index: 1000"
		class="text-center"
		id="quick-toolbar">
		<!-- app action row -->
		<div
			class="grey lighten-1 mx-auto p-1"
			style="width: max-content">
			<span
				v-for="(ctrl, index) in appActionsControls"
				:key="index"
				class="text-uppercase ctrl"
				:class="[
					sharedSpanClasses,
					{
						'grey-text text-darken-3 fw-bold': isActionActive(ctrl),
						active: isActionFlashing(ctrl),
					},
				]"
				@click="switchAppAction(ctrl)"
				@mouseenter="
					showAndHideToolTip(actionHints[ctrl], { top: 30, left: 100 })
				">
				{{ ctrl }}
			</span>

			<!-- vibecoding / AI assistant, TODO: wire up openVibecoding -->
			<span
				class="ctrl fa fa-android"
				:class="sharedSpanClasses"
				@mouseenter="showAndHideToolTip(hints.aiHint, { top: 30, left: 100 })"
				@click="openVibecoding"></span>
		</div>

		<!-- css row -->
		<div class="grey p-1">
			<span
				class="ctrl"
				v-for="(ctrl, index) in activeControls"
				:key="index"
				:class="[sharedSpanClasses, { active: isControlActive(ctrl) }]"
				@click="addOrRemoveControl(ctrl)">
				{{ ctrl }}
			</span>

			<!-- reorder up icon -->
			<span
				class="ctrl fa fa-step-backward"
				:class="sharedSpanClasses"
				@click="reorderElemUp"
				@mouseenter="
					showAndHideToolTip(hints.moveDown, { top: 30, right: 100 })
				"></span>

			<!-- reorder down icon -->
			<span
				class="ctrl fa fa-step-forward"
				:class="sharedSpanClasses"
				@click="reorderElemDown"
				@mouseenter="
					showAndHideToolTip(hints.moveUp, { top: 30, left: 100 })
				"></span>

			<!-- img control, only when active elem is an img -->
			<span
				v-if="isImgActive"
				class="ctrl fa fa-image"
				:class="sharedSpanClasses"
				@click.stop="openLibraryForSrc"
				@mouseenter="
					showAndHideToolTip(hints.changeImageHint, { top: 30, left: 100 })
				"></span>

			<!-- open modal icon -->
			<span
				class="ctrl"
				@click="openUpdateModal"
				:class="sharedSpanClasses"
				@mouseenter="
					showAndHideToolTip(hints.openUpdateModal, { top: 30, left: 10 })
				">
				+
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch, onMounted, onUnmounted } from "vue";
	import {
		useCanvasElemsStore,
		useAppActionStore,
		useImageLibraryStore,
	} from "~/store";
	import { showAndHideToolTip, hints } from "#imports";
	import type { AppAction } from "~/types";

	onMounted(function () {
		adjustToolBarXposition();
		window.addEventListener("resize", adjustToolBarXposition);
	});

	onUnmounted(function () {
		window.removeEventListener("resize", adjustToolBarXposition);
	});

	const sharedSpanClasses = "mx-1 border rounded px-1";

	const canvasElemsStore = useCanvasElemsStore();
	const appActionStore = useAppActionStore();
	const imageLibraryStore = useImageLibraryStore();

	const props = defineProps<{
		cssClasses?: string[];
		controlsOverride?: string[];
	}>();

	const activeElem = computed(function () {
		return canvasElemsStore.getActiveElem;
	});

	const isImgActive = computed(function () {
		return activeElem.value?.elemType === "img";
	});

	//watches for the library handing back a choice, same pattern as the
	//Inline Styles tab's watcher - but writes to props.src and tags
	//userImg instead of customStyles + userBgImg. only reacts while
	//THIS elem is the selected one, so a choice made for some other
	//elem's request can never land on the wrong image.
	watch(
		function () {
			return imageLibraryStore.isFromInlineTab.imageData;
		},
		function (base64Image) {
			if (!base64Image) return;
			if (!isImgActive.value) return;

			canvasElemsStore.changeSelectedImage(
				imageLibraryStore.isFromInlineTab.imageId,
				base64Image
			);

			imageLibraryStore.isFromInlineTab.imageData = null;
			imageLibraryStore.isFromInlineTab.imageId = null;
		}
	);

	// c = create, p = presets, e = export, r = resize, i = imports.
	// d = duplicate, kept last since it's a utility not a switchable action
	const appActionsControls = ["c", "p", "e", "r", "i", "d"] as const;
	type appActionInitials = (typeof appActionsControls)[number];

	const actionHints: Record<appActionInitials, string> = {
		c: hints.createHint,
		p: hints.presetHint,
		e: hints.exportHint, // TODO: add exportHint to hints
		r: hints.resizeHint,
		i: hints.importHint,
		d: hints.duplicateHint,
	};

	const currentAppAction = computed(function (): AppAction {
		return appActionStore.getActiveAction;
	});

	const flashingAction = ref<appActionInitials | null>(null);

	const isActionActive = function (ctrl: appActionInitials) {
		switch (ctrl) {
			case "c":
				return currentAppAction.value === "create";

			case "p":
				return currentAppAction.value === "presets";

			case "e":
				return currentAppAction.value === "export";

			case "r":
				return currentAppAction.value === "resize";

			case "i":
				return currentAppAction.value === "imports";

			default:
				return false;
		}
	};

	const isActionFlashing = function (ctrl: appActionInitials) {
		return flashingAction.value === ctrl;
	};

	const switchAppAction = function (ctrl: appActionInitials) {
		switch (ctrl) {
			case "c":
				appActionStore.setActiveAction("create");
				break;

			case "p":
				appActionStore.setActiveAction("presets");
				break;

			case "e":
				appActionStore.setActiveAction("export");
				break;

			case "r":
				appActionStore.setActiveAction("resize");
				break;

			case "i":
				appActionStore.setActiveAction("imports");
				break;

			case "d":
				canvasElemsStore.duplicateActiveElem();
				break;

			default:
				return;
		}

		flashingAction.value = ctrl;

		window.setTimeout(function () {
			if (flashingAction.value === ctrl) {
				flashingAction.value = null;
			}
		}, 3000);
	};

	const quickControls = ["p-1", "p-3", "rounded", "mx-auto"];

	const activeControls = computed(function () {
		if (props.controlsOverride) {
			return props.controlsOverride;
		}

		return quickControls;
	});

	const isControlActive = function (ctrl: string) {
		return (props.cssClasses ?? []).includes(ctrl);
	};

	const addOrRemoveControl = function (ctrl: string) {
		if (!activeElem.value) {
			console.log("No active element");
			return;
		}

		const classes = [...(props.cssClasses ?? [])];

		const index = classes.findIndex(function (className) {
			return className === ctrl;
		});

		if (index !== -1) {
			classes.splice(index, 1);
		} else {
			classes.push(ctrl);
		}

		canvasElemsStore.updateElemClasses(activeElem.value.id, classes);
	};

	const reorderElemUp = function () {
		canvasElemsStore.moveElemUp();
	};

	const reorderElemDown = function () {
		canvasElemsStore.moveElemDown();
	};

	//opens the SAME shared library modal the Inline Styles tab uses -
	//no separate modal built for this, just a different consumer of
	//the same isFromInlineTab trigger mechanism
	function openLibraryForSrc(): void {
		imageLibraryStore.isFromInlineTab.shouldShow = true;
	}

	// TODO: wire up vibecoding/AI assistant flow
	function openVibecoding(): void {
		console.log("Vibecoding not implemented yet");
	}

	function openUpdateModal() {
		canvasElemsStore.isEditModalOpen = true;
	}

	const adjustToolBarXposition = function () {
		const toolbar = document.getElementById("quick-toolbar");

		if (!toolbar) {
			console.log("Quick toolbar not found");
			return;
		}

		//remove our previous nudge so we measure where the toolbar naturally sits
		toolbar.style.removeProperty("left");

		const toolbarRect = toolbar.getBoundingClientRect();
		const edgeMargin = 15;

		if (toolbarRect.left < edgeMargin) {
			const overflowAmount = edgeMargin - toolbarRect.left;

			toolbar.style.setProperty(
				"left",
				`${toolbar.offsetLeft + overflowAmount}px`,
				"important"
			);
		} else if (toolbarRect.right > window.innerWidth - edgeMargin) {
			const overflowAmount =
				toolbarRect.right - (window.innerWidth - edgeMargin);

			toolbar.style.setProperty(
				"left",
				`${toolbar.offsetLeft - overflowAmount}px`,
				"important"
			);
		}
	};
</script>

<style scoped>
	.ctrl {
		cursor: pointer;
	}

	.ctrl:hover {
		background-color: rgb(164, 164, 231);
	}

	.active {
		background-color: rgb(108, 108, 109);
	}
</style>
