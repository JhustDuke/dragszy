import { defineStore } from "pinia";
import { useCanvasElemsStore } from "~/store";
import type { CanvasElem } from "~/types";
import { trackAnalytics } from "~/utils";

interface CanvasHistory {
	canvasState: CanvasElem[];
	action: string;
}

//maps a store action name to a readable label for the undo/redo toast.
//add a line here whenever a new canvas action is added - an action
//without an entry just falls back to its raw name
const actionLabels: Record<string, string> = {
	addElem: "add element",
	addElemFromPreset: "add preset",
	appendToNewParent: "move element into new parent",
	unparentElem: "move element to root",
	deleteElem: "delete element",
	duplicateActiveElem: "duplicate element",
	moveElemUp: "move element up",
	moveElemDown: "move element down",
	updateElemClasses: "update on elem class",
	updateElemInlineStyles: "update on elem inline styles",
	updateElemTextContent: "update on elem text",
	updateElemCustomId: "update on elem id",
	updateElemAttribute: "update on elem attribute",
	setElemBgImageId: "update on elem background image",
	changeSelectedImage: "change element image",
};

const getActionLabel = function (name: string): string {
	if (actionLabels[name]) {
		return actionLabels[name];
	}

	return name;
};

export const useHistoryStore = defineStore("history", {
	state: function () {
		return {
			previousCanvasStates: [] as CanvasHistory[],
			futureCanvasStates: [] as CanvasHistory[],
			lastUndoneAction: null as string | null,
			lastRedoneAction: null as string | null,
		};
	},

	actions: {
		trackCanvasChanges: function (): void {
			const canvasElemsStore = useCanvasElemsStore();
			const historyStore = this;

			canvasElemsStore.$onAction(function ({ name, args, after }) {
				const canvasStateBeforeAction = JSON.stringify(canvasElemsStore.elems);

				after(function () {
					const canvasStateAfterAction = JSON.stringify(canvasElemsStore.elems);

					if (canvasStateBeforeAction === canvasStateAfterAction) {
						return;
					}

					historyStore.previousCanvasStates.push({
						canvasState: JSON.parse(canvasStateBeforeAction),
						action: getActionLabel(name),
					});

					// what was placed e.g. { tag: "div" }
					if (name === "addElem") {
						trackAnalytics("elem-added", { tag: args[0] as string });
					} else if (name === "addElemFromPreset") {
						const placedPreset = args[0] as CanvasElem;

						trackAnalytics("preset-added", {
							presetId: placedPreset.id,
							rootTag: placedPreset.elemType,
						});
					} else if (name === "addElemFromAiChat") {
						const placedAiElem = args[0] as CanvasElem;

						trackAnalytics("ai-apply", { rootTag: placedAiElem.elemType });
					} else {
						// every other change e.g. { action: "deleteElem" }
						trackAnalytics("canvas-action", { action: name });
					}

					historyStore.futureCanvasStates = [];
					historyStore.lastUndoneAction = null;
					historyStore.lastRedoneAction = null;
				});
			});
		},

		//manual snapshot for cases that mutate elems directly, bypassing
		//$onAction's automatic before/after timing on purpose (resize -
		//it mutates on every mousemove for drag performance, and by the
		//time any action call happens, the drag is already over, so the
		//automatic "before" would already equal "after"). call this once,
		//right when a drag STARTS, before any mutation happens.
		snapshot: function (actionLabel: string): void {
			const canvasElemsStore = useCanvasElemsStore();

			this.previousCanvasStates.push({
				canvasState: JSON.parse(JSON.stringify(canvasElemsStore.elems)),
				action: actionLabel,
			});
			this.futureCanvasStates = [];
			this.lastUndoneAction = null;
			this.lastRedoneAction = null;
		},

		undo: function (): void {
			if (this.previousCanvasStates.length === 0) return;

			const canvasElemsStore = useCanvasElemsStore();

			const currentCanvasState = JSON.parse(
				JSON.stringify(canvasElemsStore.elems)
			);

			const previousHistory = this.previousCanvasStates.pop();
			if (!previousHistory) return;

			trackAnalytics("undo");

			this.futureCanvasStates.push({
				canvasState: currentCanvasState,
				action: previousHistory.action,
			});

			canvasElemsStore.elems = previousHistory.canvasState;
			this.lastUndoneAction = previousHistory.action;
			this.lastRedoneAction = null;
		},

		redo: function (): void {
			if (this.futureCanvasStates.length === 0) return;

			const canvasElemsStore = useCanvasElemsStore();

			const currentCanvasState = JSON.parse(
				JSON.stringify(canvasElemsStore.elems)
			);

			const nextHistory = this.futureCanvasStates.pop();
			if (!nextHistory) return;

			trackAnalytics("redo");

			this.previousCanvasStates.push({
				canvasState: currentCanvasState,
				action: nextHistory.action,
			});

			canvasElemsStore.elems = nextHistory.canvasState;
			this.lastRedoneAction = nextHistory.action;
			this.lastUndoneAction = null;
		},
	},
});
