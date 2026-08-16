import { defineStore } from "pinia";
import { useCanvasElemsStore } from "~/store";
import type { CanvasElem } from "~/types";

export const useHistoryStore = defineStore("history", {
	state: function () {
		return {
			previousCanvasStates: [] as CanvasElem[][],
			futureCanvasStates: [] as CanvasElem[][],
		};
	},

	actions: {
		trackCanvasChanges: function (): void {
			const canvasElemsStore = useCanvasElemsStore();
			const historyStore = this;

			canvasElemsStore.$onAction(function ({ after }) {
				const canvasStateBeforeAction = JSON.stringify(canvasElemsStore.elems);

				after(function () {
					const canvasStateAfterAction = JSON.stringify(canvasElemsStore.elems);

					if (canvasStateBeforeAction === canvasStateAfterAction) {
						return;
					}

					historyStore.previousCanvasStates.push(
						JSON.parse(canvasStateBeforeAction)
					);

					historyStore.futureCanvasStates = [];
				});
			});
		},

		undo: function (): void {
			if (this.previousCanvasStates.length === 0) return;

			const canvasElemsStore = useCanvasElemsStore();

			const currentCanvasState = JSON.parse(
				JSON.stringify(canvasElemsStore.elems)
			);

			this.futureCanvasStates.push(currentCanvasState);

			const previousCanvasState = this.previousCanvasStates.pop();

			if (!previousCanvasState) return;

			canvasElemsStore.elems = previousCanvasState;
		},

		redo: function (): void {
			if (this.futureCanvasStates.length === 0) return;

			const canvasElemsStore = useCanvasElemsStore();

			const currentCanvasState = JSON.parse(
				JSON.stringify(canvasElemsStore.elems)
			);

			this.previousCanvasStates.push(currentCanvasState);

			const nextCanvasState = this.futureCanvasStates.pop();

			if (!nextCanvasState) return;

			canvasElemsStore.elems = nextCanvasState;
		},
	},
});
