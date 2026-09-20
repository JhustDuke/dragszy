<template>
	<div v-if="activeElem">
		<label class="form-label small fw-bold">Options</label>

		<div
			v-for="(child, index) in activeElem.children"
			:key="child.id"
			class="d-flex gap-2 mb-1">
			<input
				type="text"
				class="form-control form-control-sm"
				:value="child.textContent"
				@input="
					updateOptionText(index, ($event.target as HTMLInputElement).value)
				" />

			<button
				type="button"
				class="btn btn-outline-danger btn-sm"
				@click="removeOption(index)">
				X
			</button>
		</div>

		<button
			type="button"
			class="btn btn-outline-primary btn-sm mt-1"
			@click="addOption">
			+ Add Option
		</button>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import type { CanvasElem } from "~/types";
	import { useCanvasElemsStore } from "~/store";

	const canvasElemsStore = useCanvasElemsStore();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem as CanvasElem | null;
	});

	function generateOptionId(): string {
		return "dragzy-opt-" + Math.random().toString(36).slice(2, 9);
	}

	function updateOptionText(index: number, value: string): void {
		if (!activeElem.value) return;

		const child = activeElem.value.children[index];
		if (!child) return;

		child.textContent = value;
	}

	function addOption(): void {
		if (!activeElem.value) return;

		const newOption: CanvasElem = {
			id: generateOptionId(),
			elemType: "option",
			textContent: "New Option",
			cssClasses: [],
			props: {},
			customStyles: {},
			children: [],
		};

		activeElem.value.children.push(newOption);
	}

	function removeOption(index: number): void {
		if (!activeElem.value) return;

		activeElem.value.children.splice(index, 1);
	}
</script>
