import { allElems, type AllElemType } from "../../common";
import { defaultClasses } from "./elemDefaultClasses";
import { bootstrapElemVariants } from "./singleElemVariants";
import type { Preset } from "../../types";

/**
 * this factory is the SINGLE SOURCE OF OF TRUTH FOR EVERY SINGLE ELEM CREATED FOR EACH FRAMEWORK
 * IT COMES WITH ABILITY TO ACCESS ATTRIBUTES,CLASSES AND OTHER THINGS PER ELEM
 */
export const SingleElemDataFactory = (function () {
	//builds a fresh, populated attrs object for one elem type.
	//attrNames tells us WHICH keys this elem type is allowed to have
	//(e.g. img is allowed src/alt/width/height, div is allowed none).
	//every value starts blank, except img which gets real values -
	//otherwise it renders as a broken image the moment it's dropped
	//on the canvas (these get stripped later by the compiler anyway)
	const buildAttrs = function (type: AllElemType): Record<string, string> {
		const attrNames = allElems[type].attrs;
		const props: Record<string, string> = {};

		for (const key of attrNames) {
			props[key] = "";
		}

		if (type === "img") {
			props.src = "/dragzy.jpg";
			props.alt = "dragzy-image";
		}

		// gives a every a link a default # in the hrelf
		if (type === "a") {
			props.href = "#";
		}
		return props;
	};

	//starting text content for this elem type (e.g. div → "", span → "dragzy-span")
	//pulled from allElems, the one shared source of truth for text/attrs
	const getDefaultText = function (type: AllElemType): string {
		return allElems[type].text;
	};

	//starting bs5 classes for this elem type. spread (...) makes a COPY of
	//the array instead of handing back the original - so if the caller
	//edits their copy, the master list inside defaultClasses stays untouched
	const getDefaultClasses = function (type: AllElemType): string[] {
		return [...defaultClasses[type]];
	};

	const getDefaultAttrs = function (type: AllElemType): Record<string, string> {
		return buildAttrs(type);
	};

	//variants for this elem type, e.g. div -> [Centered, Container, Card, Aside].
	//returns a fresh copy (both the outer array and each variant's classes array)
	//so nothing the caller does can mutate the factory's internal data
	const getVariants = function (type: AllElemType): Preset[] {
		const sourceVariants = bootstrapElemVariants[type];
		const variants: Preset[] = [];

		for (const variant of sourceVariants) {
			variants.push({
				label: variant.label,
				classes: [...variant.classes],
				customStyles: variant.customStyles ? { ...variant.customStyles } : {},
			});
		}

		return variants;
	};

	//the ONLY public method - one call in, everything out.
	//defaults and variants are separate sibling objects, not flattened
	//together, since variants aren't "defaults" - they're alternate looks
	//you'd pick INSTEAD of the default
	const getElemData = function (type: AllElemType) {
		return {
			defaults: {
				text: getDefaultText(type),
				classes: getDefaultClasses(type),
				attributes: getDefaultAttrs(type),
			},
			variants: getVariants(type),
		};
	};
	return { getElemData };
})();
