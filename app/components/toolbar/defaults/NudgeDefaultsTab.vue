<template>
	<div>
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
</template>

<script setup lang="ts">
	import { useDefaultStore } from "~/store/defaultStore";

	const defaultStore = useDefaultStore();
</script>
