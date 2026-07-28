<template>
	<div>
		<div
			v-for="elemType in sortedElemTypes"
			:key="elemType"
			class="border-bottom pb-2 mb-2">
			<div class="d-flex align-items-center gap-2">
				<label
					class="form-label mb-0"
					style="width: 90px"
					>{{ elemType }}</label
				>
				<input
					type="text"
					class="form-control"
					placeholder="text content"
					:value="defaultStore.getDefaultTextForElemType(elemType)"
					@input="
						defaultStore.setDefaultTextForElemType(
							elemType,
							($event.target as HTMLInputElement).value
						)
					" />

				<input
					type="text"
					class="form-control"
					placeholder="css classes, comma separated"
					v-model="classDrafts[elemType]"
					@blur="commitClassDraft(elemType)" />
			</div>

			<!-- per-elem attr, only shown for those that actually have any -->
			<div
				v-if="attrByElemType[elemType]?.length"
				class="d-flex gap-2 mt-1"
				style="margin-left: 98px">
				<input
					v-for="attr in attrByElemType[elemType]"
					:key="attr"
					type="text"
					class="form-control form-control-sm"
					:placeholder="attr"
					:value="defaultStore.getDefaultPropsForElemType(elemType)[attr]"
					@input="
						defaultStore.setDefaultPropForElemType(
							elemType,
							attr,
							($event.target as HTMLInputElement).value
						)
					" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, reactive } from "vue";
	import { useDefaultStore } from "~/store/defaultStore";
	import { attrByElemType } from "~/store/utils/defaultData";
	import { supportedElemTypes } from "~/types";

	const defaultStore = useDefaultStore();

	const sortedElemTypes = computed(function () {
		return [...supportedElemTypes].sort();
	});

	// draft text per elem type, edited freely; only parsed/sorted/committed
	// to the store on blur, so typing spaces and commas isn't fought
	// by live reformatting on every keystroke (see comment in template
	// above the css-classes input for the full explanation)
	const classDrafts = reactive<Record<string, string>>(
		Object.fromEntries(
			supportedElemTypes.map(function (elemType) {
				return [
					elemType,
					[...defaultStore.getDefaultClassesForElemType(elemType)]
						.sort()
						.join(", "),
				];
			})
		)
	);

	function commitClassDraft(elemType: string): void {
		const rawValue = classDrafts[elemType] ?? "";
		const classes = rawValue
			.split(",")
			.map(function (className) {
				return className.trim();
			})
			.filter(function (className) {
				return className.length > 0;
			})
			.sort();

		defaultStore.setDefaultClassesForElemType(elemType, classes);
		classDrafts[elemType] = classes.join(", ");
	}
</script>
