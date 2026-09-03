import { defineStore } from "pinia";

interface StoredImage {
	id: string;
	fileName: string;
	base64: string; // dragzy-only, in-app display, never exported directly
}

export const useImageLibraryStore = defineStore("imageLibrary", {
	state: function () {
		return {
			images: [] as StoredImage[],
		};
	},
	getters: {
		getImages: function (state): StoredImage[] {
			return state.images;
		},
		//looks up one stored image by its id - used at compile time to
		//resolve a dragzy-image- id back into its real filename
		getImageById: function (state) {
			return function (id: string): StoredImage | null {
				return (
					state.images.find(function (img) {
						return img.id === id;
					}) ?? null
				);
			};
		},
	},
	actions: {
		//the ONE upload entry point - both the "upload ahead of time via
		//modal" and "just-in-time on an elem" flows call this same
		//action, so there's only ever one place that creates an image
		//entry. returns the generated id so the caller can immediately
		//tag whichever elem/property this upload was for.
		addImage: function (fileName: string, base64: string): string {
			const id = "dragzy-image-" + Math.random().toString(36).slice(2, 10);

			this.images.push({ id, fileName, base64 });

			return id;
		},

		//deletion is symmetric - removing an image just removes its
		//entry, no cascading cleanup. any elem still referencing this id
		//will simply fail the getImageById lookup at compile time -
		//that's a known, accepted edge case, not handled specially here.
		removeImage: function (id: string): void {
			const index = this.images.findIndex(function (img) {
				return img.id === id;
			});

			if (index === -1) return;

			this.images.splice(index, 1);
		},
	},
});
