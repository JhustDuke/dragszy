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
					quota-text=""
					:is-submit-disabled="aiStore.isAiLoading"
					@submit="handleSubmitClick" />
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import type { CanvasElem, AiResponseFormat, AiRequestFormat } from "~/types";
	import {
		useAiStore,
		useImageLibraryStore,
		useCanvasElemsStore,
	} from "~/store";
	import ChatArea from "./ChatArea.vue";
	import PromptArea from "./PromptArea.vue";
	import ChatFooter from "./ChatFooter.vue";
	import {
		htmlCompiler,
		parseHtmlToDragzy,
		MAX_AI_APPLY_ELEMENTS,
	} from "~/compiler";

	const props = defineProps<{
		framework: "bs5" | "tw";
		activeElement: CanvasElem;
	}>();

	// biggest elem the user can send e.g. 100 elems
	const MAX_ELEMS_TO_SEND = 100;

	const aiStore = useAiStore();
	const imagesStore = useImageLibraryStore();
	const canvasStore = useCanvasElemsStore();

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

	// counts an elem and everything nested inside it
	function countCanvasElems(elem: CanvasElem): number {
		let totalElems = 1;

		for (const childElem of elem.children) {
			totalElems += countCanvasElems(childElem);
		}

		return totalElems;
	}

	const sendPromptToAi = async function () {
		const trimmedPrompt = userPrompt.value.trim();

		if (!trimmedPrompt) {
			return;
		}

		//block a second request while one is pending
		if (aiStore.isAiLoading) {
			return;
		}

		let requestOutcome: "success" | "failure" = "success";

		// last compiled markup e.g. "<div class='card'>...</div>"
		let userMarkup = "";

		try {
			if (countCanvasElems(props.activeElement) > MAX_ELEMS_TO_SEND) {
				throw new Error(
					"That element is too large for AI. Select a smaller one."
				);
			}

			userMarkup = compileSelectedElem();

			const requestBody: AiRequestFormat = {
				userPrompt: trimmedPrompt,
				userMarkup: userMarkup,
			};

			aiStore.setUserRequest({
				markup: requestBody.userMarkup,
				userMessage: requestBody.userPrompt,
			});
			aiStore.setAiLoading(true);

			const response = await $fetch<AiResponseFormat>("/api/ai/ask", {
				method: "POST",
				body: requestBody,
			});

			aiStore.setAiResponse({
				aiMessage: response.aiResponse,
				markup: response.aiMarkup,
			});
		} catch (error: any) {
			requestOutcome = "failure";

			aiStore.setAiResponse({
				aiMessage: error.message || "Failed to send prompt to AI",
				// when there's an error let the markup be the last users markup
				markup: userMarkup,
				isError: true,
			});
		} finally {
			aiStore.setAiLoading(false);
		}

		//only notify if the user isn't looking at the panel
		if (aiStore.isAiModalMinimized) {
			aiStore.setResponseNotice(requestOutcome);
		}
	};

	const compileSelectedElem = function () {
		const output = htmlCompiler({
			canvasElemsArr: [props.activeElement],
			cssFramework: props.framework || "bs5",
			images: imagesStore.getImages,
		});
		return output;
	};

	function handleSubmitClick() {
		sendPromptToAi();
	}

	function handleApplyClick(markupToApply: string) {
		const parseResult = parseHtmlToDragzy(markupToApply, MAX_AI_APPLY_ELEMENTS);

		if (parseResult.error || !parseResult.tree) {
			// your toast call goes here e.g. showToast(parseResult.error)
			console.warn("Apply failed:", parseResult.error);
			return;
		}

		canvasStore.addElemFromPreset(parseResult.tree);
	}
</script>

<style scoped></style>
