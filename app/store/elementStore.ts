import { defineStore } from "pinia";
import type { CanvasElem } from "~/types";
import { useDefaultNudgeStore } from "~/store/defaultStore";

export const useCanvasElemsStore = defineStore("canvasElems", {
	state: function () {
		return {
			elems: [] as CanvasElem[],
			activeElemId: null as string | null,
		};
	},
	getters: {
		activeElem: function (state) {
			return (
				state.elems.find(function (elem) {
					return elem.id === state.activeElemId;
				}) ?? null
			);
		},
	},
	actions: {
		addElem: function (type: keyof HTMLElementTagNameMap = "div") {
			const defaultNudgeStore = useDefaultNudgeStore();

			const newElem: CanvasElem = {
				id: Math.random().toString(36).slice(2, 10),
				elemType: type,
				children: [],
				width: defaultNudgeStore.getDefaultWidth,
				height: defaultNudgeStore.getDefaultHeight,
				widthUnit: defaultNudgeStore.getDefaultMeasurementX,
				heightUnit: defaultNudgeStore.getDefaultMeasurementY,
			};
			this.elems.push(newElem);
			this.activeElemId = newElem.id;
		},
		setActiveElem: function (id: string | null) {
			this.activeElemId = id;
		},
		updateElemWidthOrHeight: function (
			changes: Partial<Pick<CanvasElem, "width" | "height">>
		): void {
			if (!this.activeElem) return;
			Object.assign(this.activeElem, changes);
		},
	},
});
