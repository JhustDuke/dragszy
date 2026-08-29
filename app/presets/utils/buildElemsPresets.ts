import { allElems, type AllElemType } from "../common";
import type { Preset } from "../";

export type SingleElemPresets = Record<AllElemType, Preset[]>;

export function buildSingleElemPresets(
	hasPresets: Partial<SingleElemPresets>
): SingleElemPresets {
	const elemsCollection = {} as SingleElemPresets;

	for (const elem of Object.keys(allElems) as AllElemType[]) {
		elemsCollection[elem] = hasPresets[elem] ?? [];
	}

	return elemsCollection;
}
