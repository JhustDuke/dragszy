```vue
<!--
	InlineStylesTab.vue

	Lets the user view/edit every inline CSS style (customStyles) on the
 
	currently selected canvas elem, as editable property/value rows.
	background/backgroundImage rows get an extra "Upload / Choose" button
	that pulls a value from the shared image library instead of typing a
	link by hand - the elem gets tagged (userBgImg) whenever that happens,
	so the compiler knows to swap in the real filename later.
-->
<template>
	<div v-if="activeElem">
		<!-- one row per existing style on the active elem -->
		<div
			v-for="(styleRow, index) in styleRows"
			:key="styleRow.rowId"
			class="d-flex gap-2 mb-2 align-items-center">
			<!-- property name, e.g. "color", "background" -->
			<input
				type="text"
				class="form-control"
				placeholder="property, e.g. display"
				list="css-property-names"
				v-model="styleRow.property"
				@blur="rows.save" />

			<!-- the value itself - free text for normal properties,
				a link/base64 for image properties. @input fires on every
				keystroke so a manual edit can immediately clear any
				library tag (see handleManualEdit below) -->
			<input
				type="text"
				class="form-control"
				:placeholder="
					rows.isImage(styleRow.property)
						? 'https://example.com/photo.jpg'
						: 'value'
				"
				:list="rows.getValueListId(styleRow.property)"
				v-model="styleRow.value"
				@input="rows.handleEdit(styleRow)"
				@keydown.enter.prevent="rows.save"
				@blur="rows.save" />

			<!-- background/backgroundImage rows ONLY - opens the shared
				image library modal instead of typing a link by hand -->
			<button
				v-if="rows.isImage(styleRow.property)"
				type="button"
				class="btn btn-sm btn-outline-secondary"
				@click="rows.openLibrary(styleRow)">
				Upload / Choose
			</button>

			<!-- removes this row entirely -->
			<button
				type="button"
				class="btn btn-sm btn-outline-danger"
				@click="rows.remove(index)">
				X
			</button>
		</div>

		<!-- appends a blank row for the user to fill in -->
		<button
			type="button"
			class="btn btn-sm btn-outline-secondary mt-1"
			@click="rows.add">
			+ Add Style
		</button>

		<!-- CSS property name suggestions - pure UI sugar, no logic -->
		<datalist id="css-property-names">
			<option
				v-for="propertyName in commonCssProperties"
				:key="propertyName"
				:value="propertyName" />
		</datalist>

		<!-- CSS value suggestions, one datalist per property that has
			known common values (see cssPropertySuggestions.ts) -->
		<datalist
			v-for="propertyName in propertiesWithValueSuggestions"
			:key="propertyName"
			:id="rows.getValueListId(propertyName)">
			<option
				v-for="propertyValue in cssValueSuggestions[propertyName]"
				:key="propertyValue"
				:value="propertyValue" />
		</datalist>
	</div>

	<!-- nothing selected on the canvas - nothing to edit -->
	<div
		v-else
		class="text-muted">
		No elem selected.
	</div>
</template>

<script setup lang="ts">
	import { computed, reactive, ref, watch, onMounted } from "vue";
	import { useCanvasElemsStore, useImageLibraryStore } from "~/store";

	import {
		getCommonCssProperties,
		cssValueSuggestions,
	} from "./cssPropertySuggestions";

	const commonCssProperties = getCommonCssProperties();

	const canvasElemsStore = useCanvasElemsStore();
	const imageLibraryStore = useImageLibraryStore();

	//the elem currently selected on the canvas - this tab only ever
	//reflects/edits THIS elem, never a stale reference to a previous one
	const activeElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	interface StyleRow {
		rowId: string;
		property: string;
		value: string;
	}

	//load rows once on first mount...
	onMounted(function () {
		rows.load();
	});

	//...and again every time a DIFFERENT elem gets selected, so the tab
	//never shows leftover rows from whatever was selected before
	watch(activeElem, function () {
		rows.load();
	});

	//remembers WHICH row asked to open the image library, so the
	//watcher below knows where to apply the result once it arrives -
	//null means "no row is currently waiting on a library pick"
	const activeImageRowId = ref<string | null>(null);

	//fires the moment the shared library modal hands back a chosen or
	//freshly-uploaded image (imageLibraryStore.isFromInlineTab.imageData
	//is set by UploadImageButton.vue elsewhere in the app). this is the
	//ONE place that turns a library pick into an actual row value +
	//elem tag - nothing else in this file talks to the library directly.
	watch(
		function () {
			return imageLibraryStore.isFromInlineTab.imageData;
		},
		function (base64) {
			//nothing to do if there's no image, or no row is waiting for one
			if (!base64 || !activeImageRowId.value) return;

			const row = styleRows.find(function (r) {
				return r.rowId === activeImageRowId.value;
			});

			if (row) {
				//base64 drives the live canvas preview...
				row.value = base64;
				rows.save();

				//...and the elem gets tagged with the library image's id,
				//so export later knows to swap this for the real filename
				//instead of leaving raw base64 in the compiled output
				if (activeElem.value) {
					canvasElemsStore.setElemBgImageId(
						activeElem.value.id,
						imageLibraryStore.isFromInlineTab.imageId
					);
				}
			}

			//reset all "waiting" state so a stray future change to
			//imageData can't accidentally reapply to the wrong row
			activeImageRowId.value = null;
			imageLibraryStore.isFromInlineTab.imageData = null;
			imageLibraryStore.isFromInlineTab.imageId = null;
		}
	);

	//the live, editable rows backing the template - rebuilt from scratch
	//by loadStyleRows whenever the active elem changes
	const styleRows = reactive<StyleRow[]>([]);

	const propertiesWithValueSuggestions = computed(function () {
		return Object.keys(cssValueSuggestions);
	});

	const rows = {
		//rebuilds styleRows entirely from the active elem's REAL
		//customStyles - this is what keeps the tab honest: it only ever
		//shows what's actually on the elem, nothing stale, nothing guessed
		load: function (): void {
			styleRows.splice(0, styleRows.length);

			if (!activeElem.value) {
				return;
			}

			const customStyles = activeElem.value.customStyles;

			const sortedPropertyNames = rows.sortProperties(
				customStyles as Record<string, string>
			);

			for (const propertyName of sortedPropertyNames) {
				// @ts-ignore
				const propertyValue = customStyles?.[propertyName];

				styleRows.push(rows.makeRow(propertyName, propertyValue));
			}
		},

		//alphabetical order, purely for consistent/predictable display
		sortProperties: function (
			customStyles: Record<string, string> | undefined
		): string[] {
			const propertyNames = Object.keys(customStyles ?? {});

			propertyNames.sort(function (leftProperty, rightProperty) {
				return leftProperty.localeCompare(rightProperty);
			});

			return propertyNames;
		},

		//builds one row - image property values get unwrapped from their
		//CSS url("...") syntax first, so the input shows the raw link/
		//base64 for editing, matching how it's typed in
		makeRow: function (property: string, value: string): StyleRow {
			return {
				rowId: rows.makeId(),
				property,
				value: rows.isImage(property) ? rows.removeUrl(value) : value,
			};
		},

		//strips the url("...") wrapper back off - e.g. url("dog.png") -> dog.png
		removeUrl: function (value: string): string {
			const match = value.match(/^url\((["']?)(.*)\1\)$/);
			return match ? match[2] ?? "" : value || "";
		},

		makeId: function (): string {
			return "row-" + Math.random().toString(36).slice(2, 9);
		},

		//appends a fresh, blank row for the user to fill in themselves
		add: function (): void {
			styleRows.push({
				rowId: rows.makeId(),
				property: "",
				value: "",
			});
		},

		//removes the row and immediately re-commits, so a deleted style
		//actually disappears from the elem right away
		remove: function (index: number): void {
			styleRows.splice(index, 1);
			rows.save();
		},

		//builds the datalist id used for this property's value
		//suggestions, e.g. "css-values-display"
		getValueListId: function (property: string): string {
			return "css-values-" + property;
		},

		//only these two properties get the "or pick from library" option -
		//no realistic way to hand-type a base64 image string, and no
		//other property has any relationship to the image library at all
		isImage: function (property: string): boolean {
			return property === "backgroundImage" || property === "background";
		},

		//opens the shared image library modal - remembers which row
		//triggered it so the watcher above knows where the result goes
		openLibrary: function (styleRow: StyleRow): void {
			activeImageRowId.value = styleRow.rowId;
			imageLibraryStore.isFromInlineTab.shouldShow = true;
		},

		//THE key rule for this feature: typing by hand ALWAYS wins.
		//the instant the user edits an image row's value themselves, the
		//library tag is cleared immediately and unconditionally - no
		//comparison against the old value, no "did they really change it"
		//check. this keeps "is this row library-sourced or not" always
		//answerable with a single presence check at export time.
		handleEdit: function (styleRow: StyleRow): void {
			if (!rows.isImage(styleRow.property)) return;
			if (!activeElem.value) return;

			canvasElemsStore.setElemBgImageId(activeElem.value.id, null);
		},

		//pushes the current rows to the store as the elem's real,
		//authoritative customStyles - REPLACES entirely, never merges,
		//so a deleted row can actually disappear rather than being
		//silently restored by a stale spread
		save: function (): void {
			if (!activeElem.value) {
				return;
			}

			const updatedInlineStyles = rows.buildStyles();

			canvasElemsStore.updateElemInlineStyles(
				activeElem.value.id,
				updatedInlineStyles
			);
		},

		//converts the current rows into a flat property -> value object,
		//skipping anything blank
		buildStyles: function (): Record<string, string> {
			const inlineStyles: Record<string, string> = {};

			for (const styleRow of styleRows) {
				rows.addStyle(styleRow, inlineStyles);
			}

			return inlineStyles;
		},

		addStyle: function (
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

			//backgroundImage/background take a raw link or raw base64
			//string in the UI (no one should ever have to type url(...)
			//by hand) - wrap it into real CSS url(...) here, once,
			//automatically. skip wrapping if already wrapped, so
			//re-committing an already-saved row doesn't double-wrap it.
			if (rows.isImage(propertyName) && !propertyValue.startsWith("url(")) {
				propertyValue = `url('${propertyValue}')`;
			}

			inlineStyles[propertyName] = propertyValue;
		},
	};
</script>
```
