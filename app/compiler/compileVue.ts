import type { CanvasElem } from "~/types";

interface NormalizedTag {
	tagName: string;
	isSelfClosingTag: boolean;
	attributes: Record<string, string>;
	textContent: string;
	children: NormalizedTag[];
}

const compiler = function () {
	/**
	 * Escapes text for HTML attributes.
	 * e.g. title='say "hi"' -> title="say &quot;hi&quot;"
	 */
	const escapeAttr = function (value: string): string {
		return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
	};

	/**
	 * Escapes text inside HTML elements.
	 * e.g. "5 < 10" -> "5 &lt; 10"
	 */
	const escapeText = function (value: string): string {
		return value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
	};

	/**
	 * Creates an empty NormalizedTag shell from an elem type.
	 * e.g. "img" -> { tagName: "img", isSelfClosingTag: true }
	 * e.g. "div" -> { tagName: "div", isSelfClosingTag: false }
	 */
	const createTagShell = function (elemType: string): NormalizedTag {
		const selfClosingTags = [
			"img",
			"input",
			"br",
			"hr",
			"meta",
			"link",
			"source",
			"track",
			"area",
			"base",
			"col",
			"embed",
			"param",
			"wbr",
		];

		return {
			tagName: elemType,
			isSelfClosingTag: selfClosingTags.includes(elemType),
			attributes: {},
			textContent: "",
			children: [],
		};
	};

	/**
	 * Initializes the class and style attributes.
	 * e.g. {} -> { class: "", style: "" }
	 */
	const insertAttributes = function (tag: NormalizedTag): void {
		tag.attributes.class = "";
		tag.attributes.style = "";
	};

	/**
	 * Builds the style attribute from an elem's width/height (+ their units).
	 * e.g. elem = { width: 100, widthUnit: "px", height: 50, heightUnit: "px" }
	 *   -> tag.attributes.style = "width: 100px; height: 50px"
	 */
	const insertInlineStyles = function (
		tag: NormalizedTag,
		elem: CanvasElem
	): void {
		const styleParts: string[] = [];

		if (elem.width !== undefined && elem.widthUnit) {
			styleParts.push(`width: ${elem.width}${elem.widthUnit}`);
		}

		if (elem.height !== undefined && elem.heightUnit) {
			styleParts.push(`height: ${elem.height}${elem.heightUnit}`);
		}

		tag.attributes.style = styleParts.join("; ");
	};

	/**
	 * Joins an elem's cssClasses array into the class attribute.
	 * e.g. elem.cssClasses = ["btn", "btn-primary"] -> tag.attributes.class = "btn btn-primary"
	 */
	const insertCssClasses = function (
		tag: NormalizedTag,
		elem: CanvasElem
	): void {
		if (!elem.cssClasses || elem.cssClasses.length === 0) {
			return;
		}

		if (tag.attributes.class && tag.attributes.class.length === 0) {
			tag.attributes.class = elem.cssClasses.join(" ");
			return;
		}

		tag.attributes.class += " " + elem.cssClasses.join(" ");
	};

	/**
	 * Copies an elem's textContent onto the tag, defaulting to "" if unset
	 * (rather than the string "undefined").
	 * e.g. elem.textContent = "Submit" -> tag.textContent = "Submit"
	 * e.g. elem.textContent = undefined -> tag.textContent = ""
	 */
	const insertTextContent = function (
		tag: NormalizedTag,
		elem: CanvasElem
	): void {
		tag.textContent = elem.textContent ?? "";
	};

	/**
	 * Stamps the elem's internal id onto the tag as an id attribute.
	 * e.g. elem.id = "dop01ig5" -> tag.attributes.id = "dop01ig5"
	 */
	const insertId = function (tag: NormalizedTag, elem: CanvasElem): void {
		if (!elem.id) {
			return;
		}

		tag.attributes.id = elem.id;
	};

	/**
	 * Copies an elem's type-specific props (href, type, name, etc.) onto
	 * the tag, skipping any that are empty.
	 * e.g. elem.props = { href: "https://x.com" } -> tag.attributes.href = "https://x.com"
	 */
	const insertProps = function (tag: NormalizedTag, elem: CanvasElem): void {
		if (!elem.props) {
			return;
		}

		for (const key in elem.props) {
			const value = elem.props[key];
			if (!value) continue;
			tag.attributes[key] = value;
		}
	};

	/**
	 * Walks a single CanvasElem (and its nested children) and builds a
	 * fully-populated NormalizedTag tree, by running every insert* step
	 * on it in order, then recursing into children.
	 * e.g. elem = { elemType: "div", cssClasses: ["box"], children: [{ elemType: "span", ... }] }
	 *   -> { tagName: "div", attributes: { class: "box" }, children: [{ tagName: "span", ... }] }
	 */
	const buildNormalizedTag = function (elem: CanvasElem): NormalizedTag {
		const tag = createTagShell(elem.elemType);

		insertAttributes(tag);
		insertInlineStyles(tag, elem);
		insertCssClasses(tag, elem);
		insertTextContent(tag, elem);
		insertId(tag, elem);
		insertProps(tag, elem);

		tag.children = elem.children.map(function (child) {
			return buildNormalizedTag(child);
		});

		return tag;
	};

	/**
	 * Serializes a NormalizedTag tree into indented HTML/Vue-template markup.
	 * indentLevel tracks how deep in the tree we are — it increases by 1
	 * on every recursive call into a child, which is what produces the
	 * increasing indentation for nested elems.
	 * e.g. parseHtml({ tagName: "div", children: [{ tagName: "span", ... }] })
	 *   -> "<div>\n\t<span></span>\n</div>"
	 */
	const parseHtml = function (
		element: NormalizedTag,
		indentLevel: number = 0
	): string {
		// Create indentation. e.g. level 2 -> "\t\t"
		const indentation = "\t".repeat(indentLevel);

		// Start building the opening tag. e.g. "<div"
		let openingTag = `<${element.tagName}`;

		// Loop through every attribute. e.g. id, class, src
		for (const attributeName in element.attributes) {
			// Get the attribute's value. e.g. "container"
			const attributeValue = element.attributes[attributeName];

			// Skip empty attributes. e.g. class=""
			if (!attributeValue) continue;

			// Append the escaped attribute. e.g. id="hero"
			openingTag += ` ${attributeName}="${escapeAttr(attributeValue)}"`;
		}

		// Return immediately for self-closing tags. e.g. <img />
		if (element.isSelfClosingTag) {
			openingTag += " />";
			return `${indentation}${openingTag}`;
		}

		// Finish the opening tag. e.g. "<div>"
		openingTag += ">";

		// Build the text content if present. e.g. "Hello World"
		const textContentMarkup = element.textContent
			? `${indentation}\t${escapeText(element.textContent)}`
			: "";

		// Recursively generate HTML for every child element
		const childElementsMarkup = element.children
			.map(function (childElement) {
				return parseHtml(childElement, indentLevel + 1);
			})
			.join("\n");

		// Combine text and children into one block
		const innerMarkup = [textContentMarkup, childElementsMarkup]
			// Remove empty sections to avoid blank lines
			.filter(function (markupSection) {
				return markupSection.length > 0;
			})
			// Separate each section with a newline
			.join("\n");

		// Return an empty element. e.g. <div></div>
		if (!innerMarkup) {
			return `${indentation}${openingTag}</${element.tagName}>`;
		}

		// Return the fully formatted HTML element
		return `${indentation}${openingTag}\n${innerMarkup}\n${indentation}</${element.tagName}>`;
	};

	const toVueTemplate = function (html: string) {
		const vueOutput = `<template>
    ${html}
 </template>
 
 <script lang="ts" setup>
 </script>
 
 <style scoped>
 </style>
 `;
		return vueOutput;
	};

	/**
	 * Public entry point: takes the raw elems array from the store and
	 * produces a complete .vue file as a string. Each root-level elem is
	 * built and serialized independently, then joined as siblings — no
	 * synthetic wrapper tag is introduced, so the export stays a faithful
	 * WYSIWYG match of exactly what's on the canvas.
	 */
	const createVueFile = function (elems: CanvasElem[]): string {
		// Step 1: convert each raw CanvasElem into its NormalizedTag tree.
		// e.g. elems = [{ elemType: "div", children: [...] }]
		//   -> normalizedTags = [{ tagName: "div", attributes: {...}, children: [...] }]
		const normalizedTags = elems.map(function (elem) {
			return buildNormalizedTag(elem);
		});

		// Step 2: serialize each normalized tag into its own markup string.
		// Each item here is an independent root-level sibling — no shared
		// wrapper tag is introduced, so multiple root elems just sit side by side.
		// e.g. normalizedTags = [{ tagName: "div", children: [...] }]
		//   -> siblingMarkups = ["<div>\n\t...\n</div>"]
		const rootSiblingMarkups = normalizedTags.map(function (rootTag) {
			return parseHtml(rootTag, 1);
		});

		// Step 3: join the separate root markups as siblings.
		// e.g. siblingMarkups = ["<div>...</div>", "<span>...</span>"]
		//   -> html = "<div>...</div>\n<span>...</span>"
		const html = rootSiblingMarkups.join("\n");

		// Step 4: wrap the combined markup in the full .vue SFC shell.
		return toVueTemplate(html);
	};

	return {
		createVueFile,
	};
};

export { compiler };
