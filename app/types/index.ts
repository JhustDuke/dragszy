// types/index.ts
export type AppAction = "create" | "move" | "resize";
export type ResizeEdge = "top" | "right" | "bottom" | "left";

export interface CanvasElem {
	id: string;
	width?: number;
	height?: number;
	elemType: keyof HTMLElementTagNameMap;
	widthUnit: string;
	heightUnit: string;
	textContent?: string;
	cssClasses?: string[];
	props?: Record<string, string>;
	children: CanvasElem[];
}

// single source of truth for which HTML tags Dragsy currently supports.
// typed against keyof HTMLElementTagNameMap so a typo here is a
// compile-time error, not a silently-broken elem type.
export const supportedElemTypes = [
	"div",
	"span",
	"p",
	"a",
	"button",
	"ul",
	"li",
	"form",
	"label",
	"input",
	"textarea",
	"select",
	"option",
	"img",
] as const satisfies (keyof HTMLElementTagNameMap)[];

export type SupportedElemType = (typeof supportedElemTypes)[number];
