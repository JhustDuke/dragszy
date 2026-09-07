import type { CanvasElem } from "~/types";
import { escapeAttr, escapeText, selfClosingTags } from "./utils";

interface NormalizedTag {
	tagName: string;
	isSelfClosingTag: boolean;
	attributes: Record<string, string>;
	textContent: string;
	children: NormalizedTag[];
}

//shape of one image library entry - kept as a plain interface here
//(not imported from the store) so normalizer.ts stays fully
//store-agnostic. the caller (vueCompiler/reactCompiler/export button)
//is responsible for actually reading the real library and passing it in.
interface LibraryImage {
	id: string;
	fileName: string;
	base64: string;
}

const normalizer = function () {
	/**
	 * Looks up one image by id from whatever list was passed in.
	 * Plain lookup, no store dependency - normalizer.ts never talks to
	 * Pinia directly.
	 */
	const findImageById = function (
		images: LibraryImage[],
		id: string
	): LibraryImage | null {
		for (const img of images) {
			if (img.id === id) return img;
		}
		return null;
	};

	/**
	 * Creates an empty NormalizedTag shell from an elem type.
	 * e.g. "img" -> { tagName: "img", isSelfClosingTag: true }
	 * e.g. "div" -> { tagName: "div", isSelfClosingTag: false }
	 */
	const createTagShell = function (elemType: string): NormalizedTag {
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
	 * Builds the style attribute from an elem's customStyles object. If
	 * this elem's background/backgroundImage came from the image
	 * library (elem.userBgImg set), the stored base64 gets swapped for
	 * a real relative filename resolved from the library. Any elem
	 * without userBgImg keeps its styles exactly as typed/stored.
	 * e.g. elem.customStyles = { width: "100px", color: "red" }
	 *   -> tag.attributes.style = "width: 100px; color: red"
	 */
	const insertInlineStyles = function (
		tag: NormalizedTag,
		elem: CanvasElem,
		images: LibraryImage[]
	): void {
		if (!elem.customStyles) {
			return;
		}

		const resolvedImage = elem.userBgImg
			? findImageById(images, elem.userBgImg)
			: null;

		const styleParts: string[] = [];

		for (const property in elem.customStyles) {
			let value = elem.customStyles[property as keyof typeof elem.customStyles];
			if (!value) continue;

			//only the property actually holding the uploaded image gets
			//swapped - background/backgroundImage are the only two
			//properties the Inline Styles tab's image upload ever writes to
			if (
				resolvedImage &&
				(property === "background" || property === "backgroundImage")
			) {
				value = `url('./${resolvedImage.fileName}')`;
			}

			styleParts.push(`${property}: ${value}`);
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
		if (elem.textContent?.startsWith("dragzy")) {
			return;
		}
		tag.textContent = elem.textContent ?? "";
	};

	/**
	 * Stamps the elem's internal id onto the tag as an id attribute.
	 * e.g. elem.id = "dop01ig5" -> tag.attributes.id = "dop01ig5"
	 * id with prefixed is never exported only used for app internal tracking
	 */
	const insertId = function (tag: NormalizedTag, elem: CanvasElem): void {
		if (!elem.customId) {
			return;
		}
		tag.attributes.id = elem.customId;
	};

	/**
	 * Copies an elem's type-specific props (href, type, name, etc.) onto
	 * the tag, skipping any that are empty. src specifically gets
	 * resolved against the image library first if this elem's src came
	 * from an upload (elem.userImg set) - swaps the live base64 for a
	 * real relative filename. Any elem without userImg keeps its src
	 * exactly as-is (a plain URL, or empty).
	 * e.g. elem.props = { href: "https://x.com" } -> tag.attributes.href = "https://x.com"
	 */
	const insertProps = function (
		tag: NormalizedTag,
		elem: CanvasElem,
		images: LibraryImage[]
	): void {
		if (!elem.props) {
			return;
		}

		for (const key in elem.props) {
			const value = elem.props[key];
			if (!value) continue;
			if (value.startsWith("dragzy")) continue;

			if (key === "src" && elem.userImg) {
				const image = findImageById(images, elem.userImg);
				tag.attributes.src = image ? `./${image.fileName}` : value;
				continue;
			}

			tag.attributes[key] = value;
		}
	};

	/**
	 * Walks a single CanvasElem (and its nested children) and builds a
	 * fully-populated NormalizedTag tree, by running every insert* step
	 * on it in order, then recursing into children. Zero framework
	 * knowledge lives here - this is the one tree shape every exporter
	 * (Vue, React, plain HTML, whatever comes next) builds from. images
	 * is threaded through every recursive call unchanged, so the whole
	 * tree resolves against the exact same library snapshot.
	 * e.g. elem = { elemType: "div", cssClasses: ["box"], children: [{ elemType: "span", ... }] }
	 *   -> { tagName: "div", attributes: { class: "box" }, children: [{ tagName: "span", ... }] }
	 */
	const buildNormalizedTag = function (
		elem: CanvasElem,
		images: LibraryImage[] = []
	): NormalizedTag {
		const tag = createTagShell(elem.elemType);

		insertAttributes(tag);
		insertInlineStyles(tag, elem, images);
		insertCssClasses(tag, elem);
		insertTextContent(tag, elem);
		insertId(tag, elem);
		insertProps(tag, elem, images);

		tag.children = elem.children.map(function (child) {
			return buildNormalizedTag(child, images);
		});

		return tag;
	};

	/**
	 * Serializes a NormalizedTag tree into indented plain HTML markup.
	 * Nothing Vue-specific here - this is just HTML, which is why Vue's
	 * <template> block (and any other framework that accepts real HTML
	 * syntax) can use it directly. indentLevel tracks how deep in the
	 * tree we are, increasing by 1 per recursive call into a child.
	 * e.g. parseHtml({ tagName: "div", children: [{ tagName: "span", ... }] })
	 *   -> "<div>\n\t<span></span>\n</div>"
	 */
	const parseHtml = function (
		element: NormalizedTag,
		indentLevel: number = 0
	): string {
		const indentation = "\t".repeat(indentLevel);

		let openingTag = `<${element.tagName}`;

		for (const attributeName in element.attributes) {
			const attributeValue = element.attributes[attributeName];
			if (!attributeValue) continue;
			openingTag += ` ${attributeName}="${escapeAttr(attributeValue)}"`;
		}

		if (element.isSelfClosingTag) {
			openingTag += " />";
			return `${indentation}${openingTag}`;
		}

		openingTag += ">";

		const textContentMarkup = element.textContent
			? `${indentation}\t${escapeText(element.textContent)}`
			: "";

		const childElementsMarkup = element.children
			.map(function (childElement) {
				return parseHtml(childElement, indentLevel + 1);
			})
			.join("\n");

		const innerMarkup = [textContentMarkup, childElementsMarkup]
			.filter(function (markupSection) {
				return markupSection.length > 0;
			})
			.join("\n");

		if (!innerMarkup) {
			return `${indentation}${openingTag}</${element.tagName}>`;
		}

		return `${indentation}${openingTag}\n${innerMarkup}\n${indentation}</${element.tagName}>`;
	};

	return {
		buildNormalizedTag,
		parseHtml,
	};
};

export { normalizer };
export type { NormalizedTag, LibraryImage };
