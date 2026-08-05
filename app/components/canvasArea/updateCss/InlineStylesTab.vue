<template>
	<div v-if="activeElem">
		<div
			v-for="(styleRow, index) in styleRows"
			:key="styleRow.rowId"
			class="d-flex gap-2 mb-2 align-items-center">
			<input
				type="text"
				class="form-control"
				placeholder="property, e.g. display"
				list="css-property-names"
				v-model="styleRow.property"
				@blur="commitRows" />

			<input
				type="text"
				class="form-control"
				placeholder="value"
				:list="valueListIdFor(styleRow.property)"
				v-model="styleRow.value"
				@keydown.enter.prevent="commitRows"
				@blur="commitRows" />

			<button
				type="button"
				class="btn btn-sm btn-outline-danger"
				@click="removeRow(index)">
				X
			</button>
		</div>

		<button
			type="button"
			class="btn btn-sm btn-outline-secondary mt-1"
			@click="addRow">
			+ Add Style
		</button>

		<!-- CSS property suggestions -->
		<datalist id="css-property-names">
			<option
				v-for="propertyName in commonCssProperties"
				:key="propertyName"
				:value="propertyName" />
		</datalist>

		<!-- CSS value suggestions -->
		<datalist
			v-for="propertyName in propertiesWithValueSuggestions"
			:key="propertyName"
			:id="valueListIdFor(propertyName)">
			<option
				v-for="propertyValue in cssValueSuggestions[propertyName]"
				:key="propertyValue"
				:value="propertyValue" />
		</datalist>
	</div>

	<div
		v-else
		class="text-muted">
		No elem selected.
	</div>
</template>

<script setup lang="ts">
	import { computed, reactive, watch } from "vue";
	import { useCanvasElemsStore } from "~/store";
	import {
		commonCssProperties,
		cssValueSuggestions,
	} from "./cssPropertySuggestions";

	const canvasElemsStore = useCanvasElemsStore();

	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	interface StyleRow {
		rowId: string;
		property: string;
		value: string;
	}

	const styleRows = reactive<StyleRow[]>([]);

	loadStyleRows();

	watch(activeElem, function () {
		loadStyleRows();
	});

	function loadStyleRows(): void {
		styleRows.splice(0, styleRows.length);

		if (!activeElem.value) {
			return;
		}

		const customStyles = activeElem.value.customStyles;

		// @ts-ignore
		const sortedPropertyNames = getSortedPropertyNames(customStyles);

		for (const propertyName of sortedPropertyNames) {
			// @ts-ignore
			const propertyValue = customStyles?.[propertyName];

			styleRows.push(createStyleRow(propertyName, propertyValue));
		}
	}

	function getSortedPropertyNames(
		customStyles: Record<string, string> | undefined
	): string[] {
		const propertyNames = Object.keys(customStyles ?? {});

		propertyNames.sort(function (leftProperty, rightProperty) {
			return leftProperty.localeCompare(rightProperty);
		});

		return propertyNames;
	}

	function createStyleRow(property: string, value: string): StyleRow {
		return {
			rowId: createRowId(),
			property,
			value,
		};
	}

	function createRowId(): string {
		return "row-" + Math.random().toString(36).slice(2, 9);
	}

	function addRow(): void {
		styleRows.push({
			rowId: createRowId(),
			property: "",
			value: "",
		});
	}

	function removeRow(index: number): void {
		styleRows.splice(index, 1);
		commitRows();
	}

	function valueListIdFor(property: string): string {
		return "css-values-" + property;
	}

	const propertiesWithValueSuggestions = computed(function () {
		return Object.keys(cssValueSuggestions);
	});

	function commitRows(): void {
		if (!activeElem.value) {
			return;
		}

		const updatedInlineStyles = buildInlineStyles();

		canvasElemsStore.updateElemInlineStyles(
			activeElem.value.id,
			updatedInlineStyles
		);
	}

	function buildInlineStyles(): Record<string, string> {
		const inlineStyles: Record<string, string> = {};

		for (const styleRow of styleRows) {
			addStyleToCollection(styleRow, inlineStyles);
		}

		return inlineStyles;
	}

	function addStyleToCollection(
		styleRow: StyleRow,
		inlineStyles: Record<string, string>
	): void {
		const propertyName = styleRow.property.trim();
		const propertyValue = styleRow.value.trim();

		if (propertyName.length === 0) {
			return;
		}

		if (propertyValue.length === 0) {
			return;
		}

		inlineStyles[propertyName] = propertyValue;
	}
</script>
