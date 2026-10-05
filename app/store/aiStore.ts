import { defineStore } from "pinia";
import type { ChatMessage } from "~/types";

export const useAiStore = defineStore("ai", {
	state: function () {
		return {
			chatMessages: [] as ChatMessage[],
			isAiLoading: false,
			isAiModalMinimized: false,
			isAiModalOpen: false,

			//set only if the reply lands while minimized e.g. "success"
			responseNotice: null as "success" | "failure" | null,
		};
	},
	actions: {
		setUserRequest: function ({
			userMessage,
			markup,
		}: {
			userMessage: string;
			markup: string;
		}) {
			this.chatMessages.push({
				tracking_id: Date.now(),
				sender: "user",
				isError: false,
				message: userMessage,
				markup,
			});
		},
		setAiResponse: function ({
			aiMessage,
			markup,
			isError = false,
		}: {
			aiMessage: string;
			markup: string;
			isError?: boolean;
		}) {
			this.chatMessages.push({
				tracking_id: Date.now() + 1,
				sender: "ai",
				isError,
				message: aiMessage,
				markup,
			});
		},
		setAiLoading: function (isLoading: boolean) {
			this.isAiLoading = isLoading;
		},
		setResponseNotice: function (requestOutcome: "success" | "failure") {
			this.responseNotice = requestOutcome;
		},
		setModalMinimized: function () {
			this.isAiModalMinimized = true;
		},
		setModalRestored: function () {
			this.isAiModalMinimized = false;
			this.isAiModalOpen = true;
			this.responseNotice = null;
		},
		setCloseModal: function () {
			this.isAiModalOpen = false;
			this.responseNotice = null;
			this.isAiModalMinimized = false;
			this.chatMessages = [];
		},
	},
});
