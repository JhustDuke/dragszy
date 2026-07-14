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
			class="position-absolute top-50 start-50 translate-middle bg-white rounded shadow"
			style="width: 75%; min-height: 300px; z-index: 1001">
			<!-- Header -->
			<div class="d-flex justify-content-end border-bottom p-2">
				<button
					type="button"
					class="btn-close"
					@click="closeModal"></button>
			</div>

			<!-- Body -->
			<div class="p-4">
				<div class="d-flex gap-4 my-3">
					<!-- Default Width -->
					<div>
						<label class="form-label mb-1">Default Width</label>

						<div class="d-flex gap-2 align-items-end">
							<input
								type="number"
								class="form-control border-0 border-bottom rounded-0 shadow-none"
								style="width: 90px"
								:value="defaultNudgeStore.getDefaultWidth"
								@input="
									defaultNudgeStore.setDefaultWidth(
										Number(($event.target as HTMLInputElement).value)
									)
								" />

							<select
								class="form-select w-auto"
								:value="defaultNudgeStore.getDefaultMeasurementX"
								@change="
									defaultNudgeStore.setDefaultMeasurementX(
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
								:value="defaultNudgeStore.getDefaultHeight"
								@input="
									defaultNudgeStore.setDefaultHeight(
										Number(($event.target as HTMLInputElement).value)
									)
								" />

							<select
								class="form-select w-auto"
								:value="defaultNudgeStore.getDefaultMeasurementY"
								@change="
									defaultNudgeStore.setDefaultMeasurementY(
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
								:value="defaultNudgeStore.getDefaultNudgeX"
								@input="
									defaultNudgeStore.setDefaultNudgeX(
										Number(($event.target as HTMLInputElement).value)
									)
								" />

							<select
								class="form-select w-auto"
								:value="defaultNudgeStore.getDefaultMeasurementX"
								@change="
									defaultNudgeStore.setDefaultMeasurementX(
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
								:value="defaultNudgeStore.getDefaultNudgeY"
								@input="
									defaultNudgeStore.setDefaultNudgeY(
										Number(($event.target as HTMLInputElement).value)
									)
								" />

							<select
								class="form-select w-auto"
								:value="defaultNudgeStore.getDefaultMeasurementY"
								@change="
									defaultNudgeStore.setDefaultMeasurementY(
										($event.target as HTMLSelectElement).value as '%' | 'px'
									)
								">
								<option value="%">%</option>
								<option value="px">px</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useDefaultNudgeStore } from "~/store/defaultStore";

	interface Props {
		isVisible: boolean;
	}

	defineProps<Props>();

	const emit = defineEmits<{
		(e: "close"): void;
	}>();

	const defaultNudgeStore = useDefaultNudgeStore();

	function closeModal(): void {
		emit("close");
	}
</script>
