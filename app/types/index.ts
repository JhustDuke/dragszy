// types/index.ts
export type AppAction = "create" | "move" | "resize";
export type ResizeEdge = "top" | "right" | "bottom" | "left";

export interface CanvasElem {
	id: string;
	width?: number;
	height?: number;

	elemType: string;
	widthUnit: string;

	heightUnit: string;
	children: CanvasElem[];
}
