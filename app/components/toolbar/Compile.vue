<template>
	<div class="d-flex gap-1 align-items-center">
		<span class="white-text me-1">Export</span>
		<select
			v-model="selectedFramework"
			class="form-select form-select-sm w-auto"
			@mouseenter="
				showAndHideToolTip(hints.exportFormat, {
					left: 0,
					top: 30,
				})
			">
			<option value="vue">Vue</option>
			<option value="react">React</option>
		</select>
		<button
			type="button"
			class="btn btn-success white-text"
			:disabled="isCompiling"
			@click="handleCompileClick">
			{{ isCompiling ? "Compiling..." : "Go" }}
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import { vueCompiler, reactCompiler } from "../../compiler";
	import { useCanvasElemsStore, useImageLibraryStore } from "~/store";
	import { showAndHideToolTip, hints } from "#imports";

	const selectedFramework = ref("vue");
	const isCompiling = ref(false);

	const canvasElemsStore = useCanvasElemsStore();
	const imageLibraryStore = useImageLibraryStore();

	/**
	 * Runs the compile process for whichever framework is selected,
	 * returning both the file content and the correct filename/extension
	 * for that framework's output. Passes the current image library
	 * snapshot through so any userImg/userBgImg references resolve to
	 * real relative filenames instead of raw base64.
	 */
	function compileForSelectedFramework(): {
		content: string;
		fileName: string;
	} {
		if (selectedFramework.value === "vue") {
			return {
				content: vueCompiler().createVueFile(
					canvasElemsStore.elems,
					imageLibraryStore.getImages
				),
				fileName: "DragzyExport.vue",
			};
		}

		if (selectedFramework.value === "react") {
			return {
				content: reactCompiler().createReactFile(
					canvasElemsStore.elems,
					imageLibraryStore.getImages
				),
				fileName: "DragzyExport.tsx",
			};
		}

		throw new Error(`Unsupported framework: ${selectedFramework.value}`);
	}

	/**
	 * Handles the Go button click: runs the compiler and downloads
	 * the output file, guarding against overlapping clicks.
	 */
	function handleCompileClick(): void {
		if (isCompiling.value) {
			return;
		}

		isCompiling.value = true;

		try {
			const { content, fileName } = compileForSelectedFramework();
			downloadFile(content, fileName);
		} finally {
			isCompiling.value = false;
		}
	}

	/**
	 * Triggers a browser download of a generated file.
	 * e.g. downloadFile("<template>...</template>", "MyComponent.vue")
	 *   -> browser starts downloading "MyComponent.vue"
	 */
	const downloadFile = function (fileContent: string, fileName: string): void {
		const blob = new Blob([fileContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = fileName;
		anchor.click();

		URL.revokeObjectURL(url);
	};
</script>

<style scoped></style>
