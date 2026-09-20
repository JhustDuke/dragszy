<template>
	<div class="text-center">
		<!-- app action row -->
		<div
			class="grey lighten-1 mx-auto p-1"
			style="width: max-content">
			<span
				v-for="(ctrl, index) in actionControls"
				:key="index"
				class="text-uppercase ctrl"
				:class="[sharedSpanClasses, { active: isActionActive(ctrl) }]"
				@click="handleActionControl(ctrl)">
				{{ ctrl }}
			</span>
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
		</div>

		<span
			class="ctrl fa fa-step-backward"
			:class="sharedSpanClasses"
			@click="reorderElemUp"
			@mouseenter="
				showAndHideToolTip(hints.moveDown, { top: 30, right: 100 })
			"></span>

		<span
			class="ctrl fa fa-step-forward"
			:class="sharedSpanClasses"
			@click="reorderElemDown"
			@mouseenter="
				showAndHideToolTip(hints.moveUp, { top: 30, left: 100 })
			"></span>

		<span
			class="ctrl"
			@click="openUpdateModal"
			:class="sharedSpanClasses"
			@mouseenter="
				showAndHideToolTip(hints.openUpdateModal, { top: 30, left: 100 })
			">
			+
		</span>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useCanvasElemsStore } from "~/store";
	import { showAndHideToolTip, hints } from "#imports";

	// Shared classes for spans
	const sharedSpanClasses = "mx-1 border rounded px-1";

	const canvasElemsStore = useCanvasElemsStore();

	const props = defineProps<{
		cssClasses?: string[];
		controlsOverride?: string[];
	}>();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	const actionControls = ["c", "p", "d", "i", "x"];

	const quickControls = ["p-1", "p-3", "rounded", "mx-auto"];

	// If the parent passes its own set (e.g. image passing img-fluid/img-thumbnail),
	// use that instead of the generic default list.
	const activeControls = computed(function () {
		if (props.controlsOverride) {
			return props.controlsOverride;
		}

		return quickControls;
	});

	const isControlActive = function (ctrl: string) {
		if ((props.cssClasses ?? []).includes(ctrl)) {
			return true;
		}

		return false;
	};

	const isActionActive = function (_ctrl: string) {
		return false;
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

	const handleActionControl = function (ctrl: string) {
		console.log("Action:", ctrl);
	};

	const reorderElemUp = function () {
		canvasElemsStore.moveElemUp();
	};

	const reorderElemDown = function () {
		canvasElemsStore.moveElemDown();
	};

	function openUpdateModal() {
		canvasElemsStore.isEditModalOpen = true;
	}
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
