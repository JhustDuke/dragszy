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
				@blur="styleRowManager.commitRows" />

			<input
				type="text"
				class="form-control"
				:placeholder="
					styleRowManager.isImageProperty(styleRow.property)
						? 'https://example.com/photo.jpg'
						: 'value'
				"
				:list="styleRowManager.valueListIdFor(styleRow.property)"
				v-model="styleRow.value"
				@keydown.enter.prevent="styleRowManager.commitRows"
				@blur="styleRowManager.commitRows" />

			<!-- backgroundImage/background can ALSO be set by uploading a
				file directly, as an alternative to pasting a link above -
				testing the simplest version first: straight to base64,
				no IndexedDB yet -->
			<input
				v-if="styleRowManager.isImageProperty(styleRow.property)"
				type="file"
				accept="image/*"
				class="form-control"
				style="max-width: 160px"
				@change="styleRowManager.onImageFileSelected($event, styleRow)" />

			<button
				type="button"
				class="btn btn-sm btn-outline-danger"
				@click="styleRowManager.removeRow(index)">
				X
			</button>
		</div>

		<button
			type="button"
			class="btn btn-sm btn-outline-secondary mt-1"
			@click="styleRowManager.addRow">
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
			:id="styleRowManager.valueListIdFor(propertyName)">
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
	import { computed, reactive, watch, onMounted } from "vue";
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

	onMounted(function () {
		//this code doesnt touch the dom just here for easily readability
		//and understanding the concept
		//instead of calling it on the setup body
		styleRowManager.loadStyleRows();
	});

	watch(activeElem, function () {
		styleRowManager.loadStyleRows();
	});

	const styleRows = reactive<StyleRow[]>([]);

	const propertiesWithValueSuggestions = computed(function () {
		return Object.keys(cssValueSuggestions);
	});

	const styleRowManager = {
		loadStyleRows: function (): void {
			styleRows.splice(0, styleRows.length);

			if (!activeElem.value) {
				return;
			}

			const customStyles = activeElem.value.customStyles;

			const sortedPropertyNames = styleRowManager.getSortedPropertyNames(
				customStyles as Record<string, string>
			);

			for (const propertyName of sortedPropertyNames) {
				// @ts-ignore
				const propertyValue = customStyles?.[propertyName];

				styleRows.push(
					styleRowManager.createStyleRow(propertyName, propertyValue)
				);
			}
		},

		getSortedPropertyNames: function (
			customStyles: Record<string, string> | undefined
		): string[] {
			const propertyNames = Object.keys(customStyles ?? {});

			propertyNames.sort(function (leftProperty, rightProperty) {
				return leftProperty.localeCompare(rightProperty);
			});

			return propertyNames;
		},

		createStyleRow: function (property: string, value: string): StyleRow {
			return {
				rowId: styleRowManager.createRowId(),
				property,
				value: styleRowManager.isImageProperty(property)
					? styleRowManager.unwrapUrl(value)
					: value,
			};
		},

		//strips the url("...") wrapper back off, so the input always shows
		//just the raw link/base64 for editing - matches how it's typed in
		unwrapUrl: function (value: string): string {
			const match = value.match(/^url\((["']?)(.*)\1\)$/);
			return match ? match[2] ?? "" : value || "";
		},

		createRowId: function (): string {
			return "row-" + Math.random().toString(36).slice(2, 9);
		},

		addRow: function (): void {
			styleRows.push({
				rowId: styleRowManager.createRowId(),
				property: "",
				value: "",
			});
		},

		removeRow: function (index: number): void {
			styleRows.splice(index, 1);
			styleRowManager.commitRows();
		},

		valueListIdFor: function (property: string): string {
			return "css-values-" + property;
		},

		//only these properties get the "or upload a file" option -
		//no realistic way to hand-type a base64 image string
		isImageProperty: function (property: string): boolean {
			return property === "backgroundImage" || property === "background";
		},

		//simplest possible version for testing: reads the picked file,
		//converts to a base64 data URI, stores it RAW (no url() wrapper -
		//that gets added automatically for every image property at
		//commit time, same as the link input). no IndexedDB yet - that's
		//the next step once this is confirmed working end to end.
		onImageFileSelected: function (event: Event, styleRow: StyleRow): void {
			const input = event.target as HTMLInputElement;
			const file = input.files?.[0];
			if (!file) return;

			const reader = new FileReader();

			reader.onload = function () {
				styleRow.value = reader.result as string;
				styleRowManager.commitRows();
			};

			reader.readAsDataURL(file);
		},

		commitRows: function (): void {
			if (!activeElem.value) {
				return;
			}

			const updatedInlineStyles = styleRowManager.buildInlineStyles();

			canvasElemsStore.updateElemInlineStyles(
				activeElem.value.id,
				updatedInlineStyles
			);
		},

		buildInlineStyles: function (): Record<string, string> {
			const inlineStyles: Record<string, string> = {};

			for (const styleRow of styleRows) {
				styleRowManager.addStyleToCollection(styleRow, inlineStyles);
			}

			return inlineStyles;
		},

		addStyleToCollection: function (
			styleRow: StyleRow,
			inlineStyles: Record<string, string>
		): void {
			const propertyName = styleRow.property.trim();
			let propertyValue = styleRow.value.trim();

			if (propertyName.length === 0) {
				return;
			}

			if (propertyValue.length === 0) {
				return;
			}

			//backgroundImage/background take a raw link or raw base64 string
			//in the UI (no one should ever have to type url(...) by hand) -
			//wrap it into a real CSS url(...) here, once, automatically.
			//skip wrapping if it's already wrapped, so re-committing an
			//already-saved row doesn't double-wrap it.
			if (
				styleRowManager.isImageProperty(propertyName) &&
				!propertyValue.startsWith("url(")
			) {
				propertyValue = `url("${propertyValue}")`;
			}

			inlineStyles[propertyName] = propertyValue;
		},
	};
</script>
