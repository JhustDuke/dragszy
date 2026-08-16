import { defineStore } from "pinia";
import { useCanvasElemsStore } from "~/store";
import type { CanvasElem } from "~/types";

interface CanvasHistory {
	canvasState: CanvasElem[];
	action: string;
}

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

			canvasElemsStore.$onAction(function ({ name, after }) {
				const canvasStateBeforeAction = JSON.stringify(canvasElemsStore.elems);

				after(function () {
					const canvasStateAfterAction = JSON.stringify(canvasElemsStore.elems);

					if (canvasStateBeforeAction === canvasStateAfterAction) {
						return;
					}

					historyStore.previousCanvasStates.push({
						canvasState: JSON.parse(canvasStateBeforeAction),
						action: name,
					});

					historyStore.futureCanvasStates = [];
					historyStore.lastUndoneAction = null;
					historyStore.lastRedoneAction = null;
				});
			});
		},

		undo: function (): void {
			if (this.previousCanvasStates.length === 0) return;

			const canvasElemsStore = useCanvasElemsStore();

			const currentCanvasState = JSON.parse(
				JSON.stringify(canvasElemsStore.elems)
			);

			const previousHistory = this.previousCanvasStates.pop();

			if (!previousHistory) return;

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
