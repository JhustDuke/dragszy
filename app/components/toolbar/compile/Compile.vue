<template>
	<div>
		<!-- Framework picker + Go button, triggers compileForSelectedFramework -->
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

		<!-- Compile modal: shows CompileFeedback's progress messages while
		     compiling. Once handleCompileComplete fires, both Download and
		     Close appear — closing here just dismisses without downloading.
		     Wrapped in ClientOnly since download logic below needs
		     document/window. -->
		<ClientOnly>
			<div
				v-if="isCompiling"
				class="compile-modal-backdrop">
				<div class="compile-modal">
					<CompileFeedback
						:framework="canvasFramework"
						@complete="handleCompileComplete" />

					<!-- Only shown once the message sequence has finished -->
					<div
						v-if="isDownloadReady"
						class="d-flex gap-2 mt-2">
						<button
							type="button"
							class="btn btn-success"
							@click="downloadCompiledFile">
							Download
						</button>

						<button
							type="button"
							class="btn btn-outline-secondary"
							@click="handleModalClose">
							Close
						</button>
					</div>
				</div>
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";

	import { vueCompiler, reactCompiler } from "../../../compiler";
	import CompileFeedback from "./CompileFeedBack.vue";
	import { useCanvasElemsStore, useImageLibraryStore } from "~/store";
	import { showAndHideToolTip, hints } from "#imports";

	// --- Local state -------------------------------------------------------

	const selectedFramework = ref("vue");
	const isCompiling = ref(false); // controls modal visibility
	const isDownloadReady = ref(false); // controls Download/Close visibility inside modal

	const compiledContent = ref(""); // raw file contents produced by the compiler
	const compiledFileName = ref(""); // filename/extension to use on download

	const canvasElemsStore = useCanvasElemsStore();
	const imageLibraryStore = useImageLibraryStore();

	// tw vs bs5 canvas — determined client-side only, from the current route
	const canvasFramework = ref<"tw" | "bs5">("bs5");

	// --- Lifecycle -----------------------------------------------------------

	onMounted(function () {
		canvasFramework.value = window.location.pathname.includes("/canvas/tw")
			? "tw"
			: "bs5";
	});

	// --- Compilation ---------------------------------------------------------

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
	 * Handles the Go button click: runs the compiler and opens the
	 * modal, which shows CompileFeedback's progress messages.
	 */
	function handleCompileClick(): void {
		if (isCompiling.value) {
			console.log("Compile already in progress. Returning early.");
			return;
		}

		isCompiling.value = true;
		isDownloadReady.value = false;

		try {
			const { content, fileName } = compileForSelectedFramework();

			compiledContent.value = content;
			compiledFileName.value = fileName;
		} catch (error) {
			console.error("Compilation failed:", error);

			isCompiling.value = false;
		}
	}

	// --- Modal / download flow -----------------------------------------------

	/**
	 * Runs when CompileFeedback finishes its message sequence.
	 * Compilation has already produced the file at this point, so
	 * both Download and Close can now appear in the modal.
	 */
	function handleCompileComplete(): void {
		isDownloadReady.value = true;
	}

	/**
	 * Downloads the compiled file and closes the modal. The anchor
	 * is attached to the DOM before .click() (some browsers ignore
	 * .click() on detached elements) and the object URL is revoked
	 * on a delay so the download has time to actually start before
	 * the URL is invalidated.
	 */
	function downloadCompiledFile(): void {
		if (!isDownloadReady.value) {
			console.log("Download is not ready. Returning early.");
			return;
		}

		const blob = new Blob([compiledContent.value], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = compiledFileName.value;

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);

		setTimeout(function () {
			URL.revokeObjectURL(url);
		}, 100);

		isCompiling.value = false;
		isDownloadReady.value = false;
	}

	/**
	 * Closes the modal without downloading — only reachable once
	 * compilation has finished (Close sits next to Download). Resets
	 * state the same way a completed download would, so a later Go
	 * click starts clean.
	 */
	function handleModalClose(): void {
		isCompiling.value = false;
		isDownloadReady.value = false;
	}
</script>

<style scoped>
	/* Fullscreen dimmed overlay for the compile modal */
	.compile-modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1050;
	}

	/* The actual modal card */
	.compile-modal {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1.5rem 2rem;
		max-width: 500px;
		width: 90%;
		box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
	}
</style>
