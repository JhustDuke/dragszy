import { defineStore } from "pinia";

export const useViewportStore = defineStore("viewport", {
	state: function () {
		return {
			activeViewport: "desktop" as "mobile" | "tablet" | "desktop",
			activeWidth: "100%",
		};
	},
	actions: {
		setMobile: function () {
			this.activeViewport = "mobile";
			this.activeWidth = "375px";
		},
		setTablet: function () {
			this.activeViewport = "tablet";
			this.activeWidth = "768px";
		},
		setDesktop: function () {
			this.activeViewport = "desktop";
			this.activeWidth = "100%";
		},
	},
});
