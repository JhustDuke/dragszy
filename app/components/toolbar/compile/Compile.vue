<template>
	<div>
		<!-- shown when a single block is picked for export -->
		<SingleBlockExport
			v-if="useAppActionStore().currentAction === 'export'"
			:is-exporting="isSingleExportBtnClicked"
			@close="useAppActionStore().setActiveAction('create')"
			:exportFormats="exportFormats"
			@on-export-data="handleSingleBlockExport" />

		<!-- shown after Go is clicked, exports the whole canvas -->
		<EntireCanvasExport
			v-if="shouldShowPreExportMsg"
			:framework="canvasFramework"
			:export-format="selectedExportFormat"
			@start-entire-compile="handleEntireCanvasExport"
			@close="shouldShowPreExportMsg = false" />

		<!-- Framework picker + Go button, triggers compileForSelectedFramework -->
		<div class="d-flex gap-1 align-items-center">
			<span class="white-text me-1">Export</span>

			<select
				v-model="selectedExportFormat"
				class="form-select form-select-sm w-auto"
				@mouseenter="
					showAndHideToolTip(hints.exportFormat, {
						left: 0,
						top: 30,
					})
				">
				<option
					v-for="(format, index) in exportFormats"
					:key="index"
					:value="format"
					:selected="format === selectedExportFormat">
					{{ format }}</option
				>
			</select>

			<button
				type="button"
				class="btn btn-success white-text"
				@click="shouldShowPreExportMsg = true">
				Go
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import { vueCompiler, reactCompiler, htmlCompiler } from "../../../compiler";
	import EntireCanvasExport from "./EntireCanvasExp.vue";
	import { initDownload } from "./initDownload";
	import {
		useCanvasElemsStore,
		useImageLibraryStore,
		useAppActionStore,
	} from "~/store";
	import { showAndHideToolTip, hints } from "#imports";
	import type { CanvasElem } from "~/types";
	import SingleBlockExport from "./SingleBlockExport.vue";

	const canvasFramework = ref<"tw" | "bs5">("bs5");

	const canvasElemsStore = useCanvasElemsStore();
	const imageLibraryStore = useImageLibraryStore();

	const exportFormats = ["HTML", "Vue", "React"] as const;

	type allowedExports = (typeof exportFormats)[number];

	// currently selected format, shared between both export flows
	const selectedExportFormat = ref<allowedExports>("Vue");

	// HTML only, unchecked = fragment, checked = full-page
	const isFullPageExport = ref(false);
	// block chosen from SingleBlockExport for the singleBlock flow
	const choosenBlockToExport = ref<CanvasElem | null>(null);
	// true while a single-block export is running, feeds the modal's spinner
	const isSingleExportBtnClicked = ref(false);

	function handleSingleBlockExport(data: {
		choosenFormat: string;
		elemBlock: CanvasElem;
		isFullPageExport: boolean;
	}) {
		//this is selectedFormat affects its global and affects the entire compile if not changed by the user
		selectedExportFormat.value = data.choosenFormat as allowedExports;
		isFullPageExport.value = data.isFullPageExport;
		choosenBlockToExport.value = data.elemBlock;
		isSingleExportBtnClicked.value = true;

		try {
			const output = compiler({
				exportMode: "singleBlock",
				outputType: selectedExportFormat.value,
				elem: choosenBlockToExport.value,
				pageType: isFullPageExport.value ? "full-page" : "fragment",
			});

			if (output) {
				const { exportData, filename } = output;

				initDownload(exportData, filename);
				// close only on success so the user can retry on failure
				useAppActionStore().setActiveAction("create");
			}
		} catch (error: any) {
			console.error("Single block export failed:", error);
		} finally {
			isSingleExportBtnClicked.value = false;
		}
	}

	// true while the entire-canvas export modal is open
	const shouldShowPreExportMsg = ref(false);

	function handleEntireCanvasExport(data: {
		rootElem: CanvasElem;
		includeRootInExport: boolean;
		isFullPageExport: boolean;
	}) {
		try {
			// root exclusion is Vue/React only, HTML always keeps the root
			data.rootElem.excludeRootFromExport =
				selectedExportFormat.value !== "HTML" && !data.includeRootInExport;

			const output = compiler({
				exportMode: "entire",
				outputType: selectedExportFormat.value,
				elem: data.rootElem,
				pageType: data.isFullPageExport ? "full-page" : "fragment",
			});

			if (output) {
				initDownload(output.exportData, output.filename);
				// close only on success so the user can retry on failure
				shouldShowPreExportMsg.value = false;
			}
		} catch (error: any) {
			console.error("an error occured", error);
		}
	}

	type compileData = {
		outputType: allowedExports;
		exportMode?: "singleBlock" | "entire";
		elem: CanvasElem;
		pageType?: "full-page" | "fragment";
	};

	// format picks the compiler, both flows call this the same way
	function compiler({
		//exportMode kept as default exports
		exportMode = "entire",
		outputType,
		elem,
		pageType,
	}: compileData) {
		if (outputType === "Vue") {
			const exportData = vueCompiler().createVueFile(
				[elem],
				imageLibraryStore.getImages
			);
			return { exportData, filename: "d2x.vue" };
		}
		if (outputType === "React") {
			const exportData = reactCompiler().createReactFile(
				[elem],
				imageLibraryStore.getImages
			);
			return { exportData, filename: "d2x.jsx" };
		}
		if (outputType === "HTML") {
			const exportData = htmlCompiler({
				canvasElemsArr: [elem],
				cssFramework: canvasFramework.value,
				images: imageLibraryStore.getImages,
				// fallback, both callers already pass pageType
				pageType: pageType ?? "fragment",
			});
			return { exportData, filename: "d2x.html" };
		} else {
			throw new Error(`unknown export format supplied`);
		}
	}
</script>

<style scoped></style>
