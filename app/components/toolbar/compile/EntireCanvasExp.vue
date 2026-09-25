<template>
	<ClientOnly>
		<Teleport to="body">
			<div
				class="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
				style="z-index: 9999">
				<div
					class="rounded white p-2"
					style="
						max-width: 500px;
						width: 90%;
						box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
					">
					<!-- Compile messages -->
					<div>
						<p
							v-for="(message, index) in messages"
							:key="index"
							class="mb-2"
							:class="{
								'red-text text-uppercase fw-bold':
									showRedText && activeMessageIndex === index,
							}">
							{{ message }}
						</p>
					</div>

					<!-- Export controls shown after messages finish -->
					<div v-if="isComplete">
						<!-- HTML only: unchecked = fragment, checked = full-page -->
						<div
							v-if="props.exportFormat === 'HTML'"
							class="form-check mt-3">
							<input
								id="full-page-export"
								v-model="isFullPageExport"
								class="form-check-input"
								type="checkbox" />

							<label
								for="full-page-export"
								class="form-check-label">
								Export as full page
							</label>
						</div>

						<!-- Vue/React only -->
						<div
							v-else
							class="form-check mt-3">
							<input
								id="include-root-export"
								v-model="includeRootInExport"
								class="form-check-input"
								type="checkbox" />

							<label
								for="include-root-export"
								class="form-check-label">
								Include root div in export
							</label>
						</div>

						<div class="d-flex gap-2 mt-3">
							<button
								type="button"
								class="btn btn-success"
								@click="emitStartCompile">
								Download
							</button>

							<button
								type="button"
								class="btn btn-outline-secondary"
								@click="closeCompile">
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useCanvasElemsStore } from "~/store";
	import type { CanvasElem } from "~/types";

	const props = defineProps<{
		framework: "tw" | "bs5";
		exportFormat: "HTML" | "Vue" | "React";
	}>();

	const emit = defineEmits<{
		startEntireCompile: [
			{
				rootElem: CanvasElem;
				includeRootInExport: boolean;
				isFullPageExport: boolean;
			}
		];
		close: [];
	}>();

	const activeMessageIndex = ref(0);
	const showRedText = ref(true);
	const isComplete = ref(false);
	const includeRootInExport = ref(true);
	const isFullPageExport = ref(false);

	const frameworkName = props.framework === "tw" ? "Tailwind" : "Bootstrap 5";

	const messages = [
		"Your project is compiling...",
		"Images will not be included in the exported file. Relative image paths will be preserved, for example: ./image.png",
		`Your exported project uses ${frameworkName}.`,
		"Font Awesome 4.7.3+ is used. Be sure to include Font Awesome in your index.html.",
		"All elems with id 'dragzy-' would not be included in the exported file",
	];

	onMounted(function () {
		showNextMessage();
	});

	function showNextMessage(): void {
		setTimeout(function () {
			if (activeMessageIndex.value === messages.length) {
				showRedText.value = false;
				isComplete.value = true;
				return;
			}

			activeMessageIndex.value += 1;
			showNextMessage();
		}, 3900);
	}

	function emitStartCompile(): void {
		const canvasElemsStore = useCanvasElemsStore();

		const rootElemToExport = {
			...canvasElemsStore.elems[0]!,
		};

		// Send the fresh root and the user's export choices to the parent.
		emit("startEntireCompile", {
			rootElem: rootElemToExport,
			includeRootInExport: includeRootInExport.value,
			isFullPageExport: isFullPageExport.value,
		});
	}

	function closeCompile(): void {
		emit("close");
	}
</script>

<style scoped>
	.compile-active {
		font-size: 1.4rem;
		color: red;
		font-weight: 600;
	}
</style>
