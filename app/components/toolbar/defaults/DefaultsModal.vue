<template>
	<div
		class="position-fixed top-0 start-0 w-100 h-100"
		:class="isVisible ? 'd-block' : 'd-none'"
		style="z-index: 1000">
		<!-- Backdrop -->
		<div
			class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"
			@click="closeModal"></div>

		<!-- Modal -->
		<div
			class="position-absolute top-50 start-50 translate-middle bg-white rounded shadow d-flex flex-column"
			style="width: 75%; max-height: 80vh; z-index: 1001">
			<!-- Header -->
			<div class="d-flex justify-content-end border-bottom p-2">
				<button
					type="button"
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- Tabs -->
			<ul class="nav nav-tabs px-3 pt-2">
				<li class="nav-item">
					<button
						type="button"
						class="nav-link"
						:class="{ active: activeTab === 'elem' }"
						@click="activeTab = 'elem'">
						Elem Defaults
					</button>
				</li>
				<li class="nav-item">
					<button
						type="button"
						class="nav-link"
						:class="{ active: activeTab === 'nudge' }"
						@click="activeTab = 'nudge'">
						Nudge Defaults
					</button>
				</li>
			</ul>

			<!-- Body -->
			<div
				class="p-4"
				style="overflow-y: auto">
				<!-- Elem Defaults tab -->
				<div v-if="activeTab === 'elem'">
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

							<!--
								FIX for "can't type spaces or commas":
								this input used to be a controlled :value bound directly
								to a live computed (sorted + joined from the store) that
								recalculated on every keystroke. The instant you typed a
								comma or space, that recalculation immediately stripped
								it back out (split/trim/filter collapses "a, " -> "a"
								before you can type the next character) — so you were
								fighting your own live-reformatting on every keystroke.

								Fix: v-model now points at a local plain-string "draft"
								(classDrafts[elemType]) that you can type into freely,
								with zero interference. Only on @blur do we parse, sort,
								and commit the clean array back into the store.
							-->
							<input
								type="text"
								class="form-control"
								placeholder="css classes, comma separated"
								v-model="classDrafts[elemType]"
								@blur="commitClassDraft(elemType)" />
						</div>

						<!-- per-type props, only shown for types that actually have any -->
						<div
							v-if="propSchemaByElemType[elemType]?.length"
							class="d-flex gap-2 mt-1"
							style="margin-left: 98px">
							<input
								v-for="propKey in propSchemaByElemType[elemType]"
								:key="propKey"
								type="text"
								class="form-control form-control-sm"
								:placeholder="propKey"
								:value="
									defaultStore.getDefaultPropsForElemType(elemType)[propKey]
								"
								@input="
									defaultStore.setDefaultPropForElemType(
										elemType,
										propKey,
										($event.target as HTMLInputElement).value
									)
								" />
						</div>
					</div>
				</div>

				<!-- Nudge Defaults tab -->
				<div v-if="activeTab === 'nudge'">
					<div class="d-flex gap-4 my-3">
						<!-- Default Width -->
						<div>
							<label class="form-label mb-1">Default Width</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultWidth"
									@input="
										defaultStore.setDefaultWidth(
											Number(($event.target as HTMLInputElement).value)
										)
									" />

								<select
									class="form-select w-auto"
									:value="defaultStore.getDefaultMeasurementX"
									@change="
										defaultStore.setDefaultMeasurementX(
											($event.target as HTMLSelectElement).value as '%' | 'px'
										)
									">
									<option value="%">%</option>
									<option value="px">px</option>
								</select>
							</div>
						</div>

						<!-- Default Height -->
						<div>
							<label class="form-label mb-1">Default Height</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultHeight"
									@input="
										defaultStore.setDefaultHeight(
											Number(($event.target as HTMLInputElement).value)
										)
									" />

								<select
									class="form-select w-auto"
									:value="defaultStore.getDefaultMeasurementY"
									@change="
										defaultStore.setDefaultMeasurementY(
											($event.target as HTMLSelectElement).value as '%' | 'px'
										)
									">
									<option value="%">%</option>
									<option value="px">px</option>
								</select>
							</div>
						</div>
					</div>

					<div class="d-flex gap-4">
						<!-- Nudge X -->
						<div>
							<label class="form-label mb-1">Nudge X</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultNudgeX"
									@input="
										defaultStore.setDefaultNudgeX(
											Number(($event.target as HTMLInputElement).value)
										)
									" />

								<select
									class="form-select w-auto"
									:value="defaultStore.getDefaultMeasurementX"
									@change="
										defaultStore.setDefaultMeasurementX(
											($event.target as HTMLSelectElement).value as '%' | 'px'
										)
									">
									<option value="%">%</option>
									<option value="px">px</option>
								</select>
							</div>
						</div>

						<!-- Nudge Y -->
						<div>
							<label class="form-label mb-1">Nudge Y</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultNudgeY"
									@input="
										defaultStore.setDefaultNudgeY(
											Number(($event.target as HTMLInputElement).value)
										)
									" />

								<select
									class="form-select w-auto"
									:value="defaultStore.getDefaultMeasurementY"
									@change="
										defaultStore.setDefaultMeasurementY(
											($event.target as HTMLSelectElement).value as '%' | 'px'
										)
									">
									<option value="%">%</option>
									<option value="px">px</option>
								</select>
							</div>
						</div>
					</div>

					<div class="d-flex gap-4 mt-3">
						<!-- Default Padding X -->
						<div>
							<label class="form-label mb-1">Padding X</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultPaddingX"
									@input="
										defaultStore.setDefaultPaddingX(
											Number(($event.target as HTMLInputElement).value)
										)
									" />
							</div>
						</div>

						<!-- Default Padding Y -->
						<div>
							<label class="form-label mb-1">Padding Y</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultPaddingY"
									@input="
										defaultStore.setDefaultPaddingY(
											Number(($event.target as HTMLInputElement).value)
										)
									" />
							</div>
						</div>
					</div>

					<div class="d-flex gap-4 mt-3">
						<!-- Default Margin X -->
						<div>
							<label class="form-label mb-1">Margin X</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultMarginX"
									@input="
										defaultStore.setDefaultMarginX(
											Number(($event.target as HTMLInputElement).value)
										)
									" />
							</div>
						</div>

						<!-- Default Margin Y -->
						<div>
							<label class="form-label mb-1">Margin Y</label>

							<div class="d-flex gap-2 align-items-end">
								<input
									type="number"
									class="form-control border-0 border-bottom rounded-0 shadow-none"
									style="width: 90px"
									:value="defaultStore.getDefaultMarginY"
									@input="
										defaultStore.setDefaultMarginY(
											Number(($event.target as HTMLInputElement).value)
										)
									" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, reactive, ref } from "vue";
	import { useDefaultStore, propSchemaByElemType } from "~/store/defaultStore";
	import { supportedElemTypes } from "~/types";

	interface Props {
		isVisible: boolean;
	}

	defineProps<Props>();

	const emit = defineEmits<{
		(e: "close"): void;
	}>();

	const defaultStore = useDefaultStore();

	const activeTab = ref<"elem" | "nudge">("elem");

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

	function closeModal(): void {
		emit("close");
	}
</script>
