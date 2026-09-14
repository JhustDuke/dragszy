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

					<!-- Lets the user decide whether the global root div should
					     appear in the exported HTML. Its children are still
					     exported when the root itself is excluded. Read fresh
					     at DOWNLOAD time (not when Go was clicked), since this
					     is the only point in the flow where the checkbox has
					     actually been visible/settable by the user. -->
					<div
						v-if="isDownloadReady"
						class="form-check mt-3">
						<input
							id="excludeRootFromExport"
							v-model="excludeRootFromExport"
							class="form-check-input"
							type="checkbox" />

						<label
							for="excludeRootFromExport"
							class="form-check-label">
							Exclude root div from export
						</label>

						<small class="d-block text-muted">
							Leaves the root div out of the exported HTML while keeping all of
							its children.
						</small>
					</div>

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
	const excludeRootFromExport = ref(false); // controls whether app-root is excluded from exported HTML

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
	 * real relative filenames instead of raw base64. Reads
	 * excludeRootFromExport fresh every time it's called - so calling
	 * this again later (e.g. right before download) picks up whatever
	 * the checkbox is set to AT THAT MOMENT, not whatever it was when
	 * Go was first clicked.
	 */
	function compileForSelectedFramework(): {
		content: string;
		fileName: string;
	} {
		const appRoot = canvasElemsStore.elems.find(function (elem) {
			return elem.id === "app-root";
		});

		if (!appRoot) {
			console.log("app-root was not found. Returning early.");
			throw new Error("app-root was not found.");
		}

		appRoot.excludeRootFromExport = excludeRootFromExport.value;

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
	 * Handles the Go button click: runs the compiler once up front just
	 * to validate everything works (catches errors early, before the
	 * user waits through CompileFeedback's whole message sequence for
	 * nothing) and opens the modal. The content built HERE is NOT what
	 * gets downloaded - downloadCompiledFile recompiles fresh at click
	 * time instead, so the checkbox's final state is always respected.
	 */
	function handleCompileClick(): void {
		if (isCompiling.value) {
			console.log("Compile already in progress. Returning early.");
			return;
		}

		isCompiling.value = true;
		isDownloadReady.value = false;

		try {
			const { fileName } = compileForSelectedFramework();

			compiledFileName.value = fileName;
		} catch (error) {
			console.error("Compilation failed:", error);

			isCompiling.value = false;
		}
	}

	// --- Modal / download flow -----------------------------------------------

	/**
	 * Runs when CompileFeedback finishes its message sequence.
	 * Compilation has already been validated at this point, so
	 * both Download and Close can now appear in the modal.
	 */
	function handleCompileComplete(): void {
		isDownloadReady.value = true;
	}

	/**
	 * Downloads the compiled file and closes the modal. Recompiles
	 * RIGHT HERE, at the moment of the click - not using whatever was
	 * built back when Go was pressed - so excludeRootFromExport's
	 * current checkbox value (which the user may have only just now
	 * toggled, since this is the first point it's even visible) is
	 * exactly what ends up in the downloaded file. The anchor is
	 * attached to the DOM before .click() (some browsers ignore
	 * .click() on detached elements) and the object URL is revoked
	 * on a delay so the download has time to actually start before
	 * the URL is invalidated.
	 */
	function downloadCompiledFile(): void {
		if (!isDownloadReady.value) {
			console.log("Download is not ready. Returning early.");
			return;
		}

		let content: string;
		let fileName: string;

		try {
			const result = compileForSelectedFramework();
			content = result.content;
			fileName = result.fileName;
		} catch (error) {
			console.error("Compilation failed at download time:", error);
			return;
		}

		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = fileName;

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
