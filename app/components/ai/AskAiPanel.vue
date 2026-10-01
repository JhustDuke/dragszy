<template>
	<Teleport to="body">
		<div
			v-if="aiStore.isAiModalOpen"
			class="d-flex justify-content-center position-fixed align-items-center w-100 h-100"
			:class="{ 'd-none': aiStore.isAiModalMinimized }"
			style="top: 0; left: 0; z-index: 1050"
			@mousedown.stop>
			<!-- modal body -->
			<div
				class="d-flex flex-column green lighten-4 border rounded shadow"
				style="width: 500px; height: 500px">
				<!-- header -->
				<div
					class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
					<span class="fw-bold">Ask AI</span>

					<!-- miminmize -->
					<div class="d-flex gap-1">
						<button
							class="btn btn-sm btn-light"
							title="Minimize"
							@click="aiStore.setModalMinimized()">
							<i class="fa fa-minus"></i>
						</button>

						<!-- close -->
						<button
							class="btn btn-sm btn-light"
							title="Close"
							@click="aiStore.setCloseModal()">
							<i class="fa fa-times"></i>
						</button>
					</div>
				</div>

				<!-- framework hint -->
				<div class="px-3 py-1 small grey-text text-darken-1 grey lighten-4">
					{{ frameworkHintText }}
				</div>

				<ChatArea
					:messages="aiStore.chatMessages"
					:is-loading="aiStore.isAiLoading"
					@apply-message="handleApplyClick" />

				<PromptArea
					:active-element="activeElement"
					@user-prompt="getUserPrompt" />

				<ChatFooter
					quota-text="quotaText"
					:is-submit-disabled="aiStore.isAiLoading"
					@submit="handleSubmitClick" />
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
	import { ref, computed, onBeforeUnmount } from "vue";
	import type { CanvasElem, AiResponseFormat, AiRequestFormat } from "~/types";
	import { useAiStore } from "~/store";
	import ChatArea from "./ChatArea.vue";
	import PromptArea from "./PromptArea.vue";
	import ChatFooter from "./ChatFooter.vue";
	import { htmlCompiler } from "~/compiler";

	const props = defineProps<{
		framework: "bs5" | "tailwind";
		activeElement: CanvasElem;
	}>();

	const QUOTA_VISIBLE_MILLISECONDS = 4000;

	const aiStore = useAiStore();

	const frameworkHintText = computed(function () {
		if (props.framework === "bs5") {
			return "This project uses Bootstrap 5";
		}
		return "This project uses Tailwind";
	});

	const userPrompt = ref("");
	const getUserPrompt = function (promptText: string) {
		userPrompt.value = promptText;
	};

	const sendPromptToAi = async function () {
		const trimmedPrompt = userPrompt.value.trim();

		const requestBody: AiRequestFormat = {
			userPrompt: trimmedPrompt,
			userMarkup: "",
		};

		if (!trimmedPrompt) {
			return;
		}

		//block a second request while one is pending
		if (aiStore.isAiLoading) {
			return;
		}

		aiStore.setUserMessage(trimmedPrompt);
		aiStore.setAiLoading(true);

		let requestOutcome: "success" | "failure" = "success";

		try {
			const response = await $fetch<AiResponseFormat>("/api/ai/ask", {
				method: "POST",
				body: {
					userPrompt: requestBody.userPrompt,
				},
			});

			aiStore.setResponseMessage(response.aiResponse);
		} catch (error) {
			console.error("Failed to send prompt to AI:", error);
			requestOutcome = "failure";

			aiStore.setResponseMessage(
				"Sorry, something went wrong while contacting the AI."
			);
		} finally {
			aiStore.setAiLoading(false);
		}

		//only notify if the user isn't looking at the panel
		if (aiStore.isAiModalMinimized) {
			aiStore.setResponseNotice(requestOutcome);
		}
	};

	function handleSubmitClick() {
		sendPromptToAi();
	}

	function handleApplyClick(messageText: string) {
		//placeholder, apply logic goes here e.g. "make this button red"
		console.log("apply clicked:", messageText);
	}
</script>

<style scoped></style>
