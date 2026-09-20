<template>
	<!-- Renders one input per declared attribute for the selected elem's
	     type. width/height are excluded for img since those are already
	     owned by customStyles (Inline Styles tab / ResizeButtons).
	     Renders nothing if the elem has no declared attrs (div, span, p).
	     Autocomplete (via datalist) is only wired up for input's "type"
	     attr, since that's the one with a real fixed set of valid values
	     we're bothering to suggest right now. -->
	<div
		v-if="visibleAttrs.length === 0"
		class="text-muted small">
		This element has no editable attributes.
	</div>

	<div
		v-for="attrName in visibleAttrs"
		:key="attrName"
		class="mb-2">
		<label class="form-label text-capitalize">{{ attrName }}</label>

		<input
			type="text"
			class="form-control form-control-sm"
			:value="selectedElem?.props?.[attrName] ?? ''"
			:list="
				getOptionsFor(attrName).length > 0 ? attrName + '-options' : undefined
			"
			@input="handleInput(attrName, $event)" />

		<datalist
			v-if="getOptionsFor(attrName).length > 0"
			:id="attrName + '-options'">
			<option
				v-for="value in getOptionsFor(attrName)"
				:key="value"
				:value="value" />
		</datalist>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { useCanvasElemsStore } from "~/store";
	import { SingleElemDataFactory } from "~/presets/bs5";

	const canvasElemsStore = useCanvasElemsStore();

	// Attribute names excluded per elem type because they're already
	// owned by customStyles/another tab instead of props.
	const EXCLUDED_ATTRS_BY_ELEM: Partial<Record<string, string[]>> = {
		img: ["width", "height"],
	};

	// Autocomplete options, scoped to input's "type" only for now.
	// Add more elemType/attrName/values here later if needed - nothing
	// else needs to change.
	const ATTR_VALUE_OPTIONS: Partial<
		Record<string, Partial<Record<string, string[]>>>
	> = {
		input: {
			type: [
				"text",
				"email",
				"password",
				"number",
				"checkbox",
				"radio",
				"date",
				"tel",
				"url",
			],
		},
	};

	// the actual selected elem's data (props, customStyles, elemType)
	const selectedElem = computed(function () {
		return canvasElemsStore.activeElem;
	});

	// the list of attr NAMES to show for THIS elem's type.
	// getDefaultAttrs returns an object like { href: "" }, not an array,
	// so Object.keys() pulls out just the names we need.
	const visibleAttrs = computed(function () {
		if (!selectedElem.value) return [];

		const elemType = selectedElem.value.elemType;
		const elemData = SingleElemDataFactory.getElemData(elemType as any);
		const declaredAttrNames = Object.keys(elemData.defaults.attributes ?? {});
		const excluded = EXCLUDED_ATTRS_BY_ELEM[elemType] ?? [];

		const result: string[] = [];

		for (const attrName of declaredAttrNames) {
			let isExcluded = false;

			for (const excludedName of excluded) {
				if (excludedName === attrName) {
					isExcluded = true;
					break;
				}
			}

			if (!isExcluded) {
				result.push(attrName);
			}
		}

		return result;
	});

	function getOptionsFor(attrName: string): string[] {
		if (!selectedElem.value) return [];

		const elemType = selectedElem.value.elemType;
		const optionsForElemType = ATTR_VALUE_OPTIONS[elemType];

		if (!optionsForElemType) return [];

		const options = optionsForElemType[attrName];

		if (!options) return [];

		return options;
	}

	function handleInput(attrName: string, event: Event): void {
		if (!selectedElem.value) return;

		const value = (event.target as HTMLInputElement).value;

		canvasElemsStore.updateElemAttribute(
			selectedElem.value.id,
			attrName,
			value
		);
	}
</script>
