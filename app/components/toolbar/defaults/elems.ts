// single source of truth for which HTML tags Dragsy currently supports.
// typed against keyof HTMLElementTagNameMap so a typo here is a
// compile-time error, not a silently-broken elem type.
export const supportedElemTypes: (keyof HTMLElementTagNameMap)[] = [
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
];

export type SupportedElemType = (typeof supportedElemTypes)[number];
