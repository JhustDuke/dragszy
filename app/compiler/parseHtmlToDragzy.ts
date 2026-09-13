import type { CanvasElem } from "~/types";
import { allElems } from "~/presets/common";
import { generateId } from "~/store/utils/canvasElemFactory";

const MAX_IMPORT_ELEMENTS = 100;

export interface ParseResult {
	tree: CanvasElem | null;
	error: string | null;
}

//tags we know how to render as a real elem type - anything not in here
//becomes a div instead, keeping its children/text but losing its
//original semantic tag
function isRecognizedTag(tagName: string): boolean {
	return tagName in allElems;
}

//parses a raw "style" attribute string into the same flat property->value
//shape customStyles already expects
function parseInlineStyle(styleAttr: string | null): Record<string, string> {
	const result: Record<string, string> = {};
	if (!styleAttr) return result;

	const declarations = styleAttr.split(";");

	for (const declaration of declarations) {
		const trimmed = declaration.trim();
		if (!trimmed) continue;

		const colonIndex = trimmed.indexOf(":");
		if (colonIndex === -1) continue;

		const property = trimmed.slice(0, colonIndex).trim();
		const value = trimmed.slice(colonIndex + 1).trim();

		if (!property || !value) continue;

		result[property] = value;
	}

	return result;
}

//counts every element in the tree, including all nested children - this
//is what catches "wrapped a whole page in one div" attempts, since it
//counts real content, not just top-level sibling count
function countElements(node: Element): number {
	let count = 1;

	for (const child of Array.from(node.children)) {
		count += countElements(child);
	}

	return count;
}

//converts one real DOM node into a CanvasElem, recursing into children.
//<script> tags are dropped entirely (return null, filtered out by the
//caller). every attribute starting with "on" (onclick, onmouseover,
//etc.) is stripped unconditionally, regardless of tag or source trust.
function convertNode(node: Element): CanvasElem | null {
	const tagName = node.tagName.toLowerCase();

	if (tagName === "script") return null;

	const isRecognized = isRecognizedTag(tagName);
	const elemType = isRecognized ? tagName : "div";

	const cssClasses =
		node.classList.length > 0 ? Array.from(node.classList) : [];
	const customStyles = parseInlineStyle(node.getAttribute("style"));

	const props: Record<string, string> = {};
	for (const attr of Array.from(node.attributes)) {
		if (attr.name === "class" || attr.name === "style") continue;
		if (attr.name.toLowerCase().startsWith("on")) continue;
		props[attr.name] = attr.value;
	}

	const children: CanvasElem[] = [];
	let textContent = "";

	for (const child of Array.from(node.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) {
			const text = child.textContent?.trim();
			if (text) textContent += text;
			continue;
		}

		if (child.nodeType === Node.ELEMENT_NODE) {
			const converted = convertNode(child as Element);
			if (converted) children.push(converted);
		}
	}

	return {
		id: generateId(),
		elemType: elemType as CanvasElem["elemType"],
		textContent,
		cssClasses,
		props,
		customStyles,
		children,
	};
}

//the ONE public export - parses a raw HTML string into a single
//CanvasElem tree, or returns an error message instead of throwing.
//only walks <body>'s children - <head> (styles, meta, etc.) is never
//touched. rejects anything over MAX_IMPORT_ELEMENTS total nodes, since
//that's what actually catches "uploaded a whole page" regardless of
//how it's wrapped.
export function parseHtmlToDragzy(htmlString: string): ParseResult {
	const doc = new DOMParser().parseFromString(htmlString, "text/html");

	//DOMParser inserts this element when the input was too malformed to
	//parse as markup at all - catches genuinely broken/non-html content
	const parserError = doc.querySelector("parsererror");
	if (parserError) {
		return { tree: null, error: "That file doesn't look like valid HTML." };
	}

	const bodyChildren = Array.from(doc.body.children);

	if (bodyChildren.length === 0) {
		return { tree: null, error: "Couldn't find any elements in that file." };
	}

	const totalElementCount = bodyChildren.reduce(function (sum, el) {
		return sum + countElements(el);
	}, 0);

	if (totalElementCount > MAX_IMPORT_ELEMENTS) {
		return {
			tree: null,
			error:
				"This looks like more than one component (" +
				totalElementCount +
				" elements found, max " +
				MAX_IMPORT_ELEMENTS +
				"). Try importing just the piece you need.",
		};
	}

	//converted with a plain loop instead of map+filter - skips any node
	//that came back null (currently only <script> tags)
	const convertedChildren: CanvasElem[] = [];

	for (const el of bodyChildren) {
		const converted = convertNode(el);

		if (converted !== null) {
			convertedChildren.push(converted);
		}
	}

	if (convertedChildren.length === 0) {
		return { tree: null, error: "Nothing importable was found in that file." };
	}

	if (convertedChildren.length === 1) {
		return { tree: convertedChildren[0] ?? null, error: null };
	}

	//multiple top-level siblings that still passed the element-count cap -
	//wrap in one synthetic root div so the import is still one placeable unit
	return {
		tree: {
			id: generateId(),
			elemType: "div",
			textContent: "",
			cssClasses: [],
			props: {},
			customStyles: {},
			children: convertedChildren,
		},
		error: null,
	};
}
