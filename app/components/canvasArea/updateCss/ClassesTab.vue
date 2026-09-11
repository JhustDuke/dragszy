<template>
	<div v-if="activeElem">
		<label class="form-label"
			>Classes (comma separated),press enter for quick preview</label
		>

		<input
			type="text"
			class="form-control"
			placeholder="e.g. card, p-3, mx-auto"
			v-model="classDraft"
			@blur="commitClasses"
			@keydown.enter.prevent="commitClasses" />

		<div class="d-flex flex-wrap gap-1 mt-2">
			<span
				v-for="className in sortedClasses"
				:key="className"
				class="badge bg-secondary">
				{{ className }}
			</span>
		</div>
	</div>

	<div
		v-else
		class="text-muted"
		>No elem selected.</div
	>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { useCanvasElemsStore } from "~/store";

	const canvasElemsStore = useCanvasElemsStore();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	//classes shown sorted alphabetically, per the requirement
	const sortedClasses = computed(function () {
		return [...(activeElem.value?.cssClasses ?? [])].sort();
	});

	//draft text the user types into freely - only parsed/committed on blur,
	//same pattern as the defaults modal's class input, so typing spaces
	//and commas isn't fought by live re-sorting on every keystroke
	const classDraft = ref(sortedClasses.value.join(", "));

	//keep the draft in sync whenever the actual classes change - covers
	//both switching to a different elem AND toggling a class on the
	//same elem from elsewhere (e.g. QuickToolBar), since both cases
	//flow through sortedClasses
	watch(sortedClasses, function () {
		classDraft.value = sortedClasses.value.join(", ");
	});

	function commitClasses(): void {
		if (!activeElem.value) return;

		const classEntriesArr = classDraft.value.split(",");
		const classes: string[] = [];

		for (const classEntry of classEntriesArr) {
			const cleanClass = classEntry.trim();
			if (cleanClass.length > 0) {
				classes.push(cleanClass);
			}
		}

		classes.sort();

		canvasElemsStore.updateElemClasses(activeElem.value.id, classes);
		classDraft.value = classes.join(", ");
	}
</script>
