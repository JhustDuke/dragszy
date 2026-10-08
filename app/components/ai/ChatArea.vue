<template>
	<div
		class="flex-grow-1 px-3 py-2 overflow-auto"
		style="min-height: 0">
		<div
			v-for="message in messages"
			:key="message.tracking_id"
			class="mb-2">
			<!-- user message -->
			<div
				v-if="message.sender === 'user'"
				class="d-flex justify-content-start">
				<div
					class="bg-primary text-white rounded-4 px-3 py-2 text-break"
					style="max-width: 60%">
					<div :class="{ 'expanded-text-scroll': isMessageExpanded(message) }">
						{{ getDisplayText(message) }}
					</div>

					<button
						v-if="isTextTooLong(message)"
						class="btn btn-link btn-sm p-0 mt-1 text-white"
						@click="toggleReadMoreOrLess(message.tracking_id)">
						{{ isMessageExpanded(message) ? "Show less" : "Show more" }}
					</button>
				</div>
			</div>

			<!-- ai message and error -->
			<div
				v-else
				class="d-flex justify-content-end">
				<div
					class="rounded-4 px-3 py-2 text-break"
					:class="message.isError ? 'red white-text' : 'bg-light border'"
					style="max-width: 60%">
					<div :class="{ 'expanded-text-scroll': isMessageExpanded(message) }">
						{{ getDisplayText(message) }}
					</div>

					<div class="d-flex align-items-center mt-2">
						<button
							v-if="isTextTooLong(message)"
							class="btn btn-link btn-sm p-0"
							:class="{ 'text-white': message.isError }"
							@click="toggleReadMoreOrLess(message.tracking_id)">
							{{ isMessageExpanded(message) ? "Show less" : "Show more" }}
						</button>

						<!-- apply pill, only when the ai gave markup to apply -->
						<button
							v-if="!message.isError && message.markup"
							class="btn btn-sm btn-primary rounded-pill ms-auto px-2"
							@click="emit('apply-message', message.markup)">
							<i class="fa fa-plus"></i>
							Apply
						</button>
						<button
							v-if="!message.isError && message.markup"
							class="btn btn-sm btn-warning rounded-pill ms-auto px-2"
							@click="emit('replace-message', message.markup)">
							<i class="fa fa-refresh"></i>
							Replace
						</button>
					</div>

					<!-- fallback buttons, only on error bubbles -->
					<div
						v-if="message.isError"
						class="d-flex gap-2 mt-2">
						<button
							v-for="fallbackOption in fallbackOptions"
							:key="fallbackOption.action"
							class="btn btn-sm btn-light rounded-pill px-2"
							@click="goToFallbackAction(fallbackOption.action)">
							{{ fallbackOption.label }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- ai loading placeholder, driven by the isLoading prop -->
		<div
			v-if="isLoading"
			class="d-flex justify-content-end mb-2">
			<div class="bg-light border rounded-4 px-3 py-2">
				<div class="d-flex align-items-center gap-2">
					<span
						class="spinner-border spinner-border-sm"
						role="status"></span>
					<span class="text-muted">Thinking...</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { ChatMessage } from "~/types";
	import { useAppActionStore, useAiStore } from "~/store";

	defineProps<{
		messages: ChatMessage[];
		isLoading: boolean;
	}>();

	const emit = defineEmits<{
		"apply-message": [markupToApply: string];
		"replace-message": [markupToApply: string];
	}>();

	const appActionStore = useAppActionStore();
	const aiStore = useAiStore();

	const MAX_COLLAPSED_CHARACTERS = 50;

	type FallbackAction = "create" | "presets" | "imports";

	const fallbackOptions: { label: string; action: FallbackAction }[] = [
		{ label: "Create", action: "create" },
		{ label: "Preset", action: "presets" },
		{ label: "Import", action: "imports" },
	];

	// which bubbles are open e.g. { 1727800000000: true }
	const expandedMessageIds = ref<Record<number, boolean>>({});

	function isMessageExpanded(chat: ChatMessage) {
		return expandedMessageIds.value[chat.tracking_id] === true;
	}

	function isTextTooLong(chat: ChatMessage) {
		return chat.message.length > MAX_COLLAPSED_CHARACTERS;
	}

	function getDisplayText(chat: ChatMessage) {
		if (isMessageExpanded(chat) || !isTextTooLong(chat)) {
			return chat.message;
		}

		//cut text e.g. "Mock AI response to..."
		return chat.message.slice(0, MAX_COLLAPSED_CHARACTERS) + "...";
	}

	const toggleReadMoreOrLess = function (currentMessageId: number) {
		expandedMessageIds.value[currentMessageId] =
			!expandedMessageIds.value[currentMessageId];
	};

	function goToFallbackAction(chosenAction: FallbackAction) {
		// hides the ai panel, e.g. leaves only the small icon
		aiStore.setModalMinimized();
		appActionStore.setActiveAction(chosenAction);
	}
</script>

<style scoped>
	.expanded-text-scroll {
		max-height: 200px;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
</style>
