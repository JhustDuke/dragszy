import type { CanvasElem } from "~/types";
import { normalizer } from "./normalizer";
import type { NormalizedTag, LibraryImage } from "./normalizer";
import { escapeAttr, escapeText } from "./utils";

const reactCompiler = function () {
	const { buildNormalizedTag } = normalizer();

	/**
	 * Converts a customStyles-derived style STRING attribute back into a
	 * JSX style OBJECT literal. tag.attributes.style is already a flat
	 * "prop: value; prop2: value2" string (same one both Vue and React
	 * output build from) - this just re-splits it into the
	 * { prop: "value" } shape JSX requires instead of a string.
	 * e.g. "width: 100px; color: red" -> '{ width: "100px", color: "red" }'
	 */
	const buildJsxStyleObject = function (styleString: string): string {
		const declarations = styleString.split(";");
		const entries: string[] = [];

		for (const declaration of declarations) {
			const trimmed = declaration.trim();
			if (!trimmed) continue;

			const colonIndex = trimmed.indexOf(":");
			if (colonIndex === -1) continue;

			const property = trimmed.slice(0, colonIndex).trim();
			const value = trimmed.slice(colonIndex + 1).trim();
			if (!property || !value) continue;

			entries.push(`${property}: "${escapeAttr(value)}"`);
		}

		if (entries.length === 0) return "";

		return `{ ${entries.join(", ")} }`;
	};

	/**
	 * Maps an HTML attribute name to its JSX equivalent where they differ.
	 * Only "class" actually needs remapping for what this compiler
	 * produces today - id, src, href, alt, etc. are identical in JSX.
	 */
	const toJsxAttributeName = function (attributeName: string): string {
		if (attributeName === "class") return "className";
		return attributeName;
	};

	/**
	 * Serializes a NormalizedTag tree into indented JSX markup. Same
	 * recursive shape and indentLevel bookkeeping as the shared
	 * normalizer's parseHtml - only the attribute syntax differs
	 * (className instead of class, style-object instead of
	 * style-string), since that's the only place JSX and HTML diverge
	 * for what this compiler outputs.
	 */
	const parseJsx = function (
		element: NormalizedTag,
		indentLevel: number = 0
	): string {
		const indentation = "\t".repeat(indentLevel);

		let openingTag = `<${element.tagName}`;

		for (const attributeName in element.attributes) {
			const attributeValue = element.attributes[attributeName];
			if (!attributeValue) continue;

			if (attributeName === "style") {
				const styleObject = buildJsxStyleObject(attributeValue);
				if (!styleObject) continue;
				openingTag += ` style={${styleObject}}`;
				continue;
			}

			const jsxAttributeName = toJsxAttributeName(attributeName);
			openingTag += ` ${jsxAttributeName}="${escapeAttr(attributeValue)}"`;
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
				return parseJsx(childElement, indentLevel + 1);
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

	/**
	 * Wraps combined JSX markup in a full .tsx function component file.
	 * Unlike a .vue SFC (which needs no internal name), a React file
	 * needs an actual named function - componentName defaults to
	 * "ExportedComponent" if the caller doesn't provide one.
	 */
	const toReactFile = function (
		jsx: string,
		componentName: string = "ExportedComponent"
	): string {
		return `import React from "react";
 
 export default function ${componentName}() {
  return (
   <>
 ${jsx}
   </>
  );
 }
 `;
	};

	/**
	 * Public entry point: takes the raw elems array from the store and
	 * produces a complete .tsx file as a string. images is the current
	 * image library snapshot, used to resolve any userImg/userBgImg
	 * references into real relative filenames instead of raw base64.
	 * Mirrors createVueFile exactly - same buildNormalizedTag step
	 * (fully reused from the shared normalizer, zero changes), just a
	 * different serializer/wrapper at the final string-formatting stage.
	 */
	const createReactFile = function (
		elems: CanvasElem[],
		images: LibraryImage[] = [],
		componentName?: string
	): string {
		const normalizedTags = elems.map(function (elem) {
			return buildNormalizedTag(elem, images);
		});

		//indentLevel starts at 3 (inside return ( -> <> -> content) so
		//the generated file's indentation looks sane, unlike Vue's
		//createVueFile which starts at 1 for its shallower SFC shell
		const rootSiblingMarkups = normalizedTags.map(function (rootTag) {
			return parseJsx(rootTag, 3);
		});

		const jsx = rootSiblingMarkups.join("\n");

		return toReactFile(jsx, componentName);
	};

	return {
		createReactFile,
	};
};

export { reactCompiler };
