<template>
	<div
		v-if="message"
		class="position-fixed top-0 start-50 translate-middle-x mt-3 green green-ligthen-3 p-3 shadow w-50 text-center white-text"
		style="z-index: 22222222222">
		{{ message }}
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import { useHistoryStore } from "../../store";

	const historyStore = useHistoryStore();

	const message = ref<string | null>(null);
	let hideTimer: any = null;

	const actionMessage = computed(function (): string | null {
		if (historyStore.lastUndoneAction) {
			return `Undid: "${historyStore.lastUndoneAction}"`;
		}

		if (historyStore.lastRedoneAction) {
			return `Redid: "${historyStore.lastRedoneAction}"`;
		}

		return null;
	});

	watch(actionMessage, function (newMessage) {
		if (!newMessage) return;

		message.value = newMessage;

		if (hideTimer) {
			clearTimeout(hideTimer);
		}

		hideTimer = setTimeout(function () {
			message.value = null;
		}, 5000);
	});
</script>
