import Dexie, { type Table } from "dexie";
import type { CanvasElem } from "~/types";

export interface SavedCanvas {
	id: string;
	name: string;
	elems: CanvasElem[];
	updatedAt: number;
}

class DragsyDatabase extends Dexie {
	canvases!: Table<SavedCanvas, string>;

	constructor() {
		super("dragzy");

		this.version(1).stores({
			canvases: "id",
		});
	}
}

export const db = new DragsyDatabase();
