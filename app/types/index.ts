// types/index.ts

import type { Properties } from "csstype";

export type AppAction = "create" | "components" | "resize" | "imports";
export type ResizeEdge = "top" | "right" | "bottom" | "left";

export interface CanvasElem {
	id: string;
	width?: number;
	height?: number;
	elemType: keyof HTMLElementTagNameMap;
	//user-chosen id for the exported output - completely separate from
	//the internal "id" above (which is always "dragzy-" prefixed and
	//never exported). this is the ONLY way an elem can carry a real
	//id="..." attribute in the compiled file
	customId?: string;
	isHeightAdjusted?: boolean;
	isWidthAdjusted?: boolean;
	textContent?: string;
	cssClasses?: string[];
	customStyles?: Partial<Properties<string | number>>;
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
