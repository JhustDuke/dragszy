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
		setUserMessage: function (messageText: string) {
			this.chatMessages.push({
				tracking_id: Date.now(),
				sender: "user",
				message: messageText,
			});
		},
		setResponseMessage: function (messageText: string) {
			this.chatMessages.push({
				tracking_id: Date.now() + 1,
				sender: "ai",
				message: messageText,
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
			this.responseNotice = null;
		},
		setCloseModal: function () {
			this.isAiModalOpen = false;
			this.responseNotice = null;
		},
	},
});
