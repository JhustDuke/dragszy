<template>
	<div class="d-flex justify-content-end gap-2 px-3 py-2">
		<button
			class="btn btn-sm btn-primary"
			@click="emit('submit')">
			Submit
		</button>

		<button
			class="btn btn-sm btn-outline-secondary"
			title="Check quota"
			aria-label="Check quota"
			@click="emit('check-quota')">
			<i class="fa fa-tachometer"></i>
		</button>
	</div>

	<div
		v-if="isQuotaVisible"
		class="px-3 pb-2 small text-end grey-text text-darken-2">
		{{ quotaText }}
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		isSubmitDisabled: boolean;
		isQuotaVisible?: boolean;
		quotaText: string;
	}>();

	const emit = defineEmits<{
		submit: [];
		"check-quota": [];
	}>();
</script>
