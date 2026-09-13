<template>
	<button
		type="button"
		class="info btn red me-2 white-text"
		@click="isModalOpen = true">
		<i class="fa fa-question-circle me-1"></i>
		Help
	</button>

	<div
		v-if="isModalOpen"
		class="position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center"
		style="background: rgba(0, 0, 0, 0.5); z-index: 1050"
		@click.self="closeHelp">
		<div
			class="bg-white rounded p-3"
			style="width: min(900px, 95vw); max-height: 90vh; overflow-y: auto">
			<div class="d-flex justify-content-between align-items-center mb-3">
				<h5 class="m-0">How to use Dragzy</h5>

				<button
					type="button"
					class="btn-close"
					@click="closeHelp"></button>
			</div>

			<div class="d-flex flex-wrap gap-2 mb-3">
				<button
					v-for="topic in topics"
					:key="topic.id"
					type="button"
					class="btn btn-sm"
					:class="
						activeTopic === topic.id
							? 'grey darken-3 white-text'
							: 'btn-outline-secondary'
					"
					@click="activeTopic = topic.id">
					{{ topic.label }}
				</button>
			</div>

			<HelpGettingStarted v-if="activeTopic === 'getting-started'" />
			<HelpElements v-else-if="activeTopic === 'elements'" />
			<HelpEditing v-else-if="activeTopic === 'editing'" />
			<Shortcuts v-else-if="activeTopic === 'shortcuts'" />
			<HelpImport v-else-if="activeTopic === 'import'" />
			<HelpHistory v-else-if="activeTopic === 'history'" />
			<HelpExport v-else-if="activeTopic === 'export'" />
			<HelpTips v-else-if="activeTopic === 'tips'" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import HelpGettingStarted from "./GettingStarted.vue";
	import HelpElements from "./HelpElements.vue";
	import HelpEditing from "./HelpEditing.vue";
	import HelpImport from "./HelpImports.vue";
	import HelpHistory from "./HelpHistory.vue";
	import HelpExport from "./HelpExport.vue";
	import HelpTips from "./HelpTips.vue";
	import Shortcuts from "./Shortcuts.vue";

	type HelpTopicId =
		| "getting-started"
		| "elements"
		| "editing"
		| "shortcuts"
		| "import"
		| "history"
		| "export"
		| "tips";

	const isModalOpen = ref(false);
	const activeTopic = ref<HelpTopicId>("getting-started");

	const topics: Array<{
		id: HelpTopicId;
		label: string;
	}> = [
		{ id: "getting-started", label: "Getting Started" },
		{ id: "elements", label: "Elements & Presets" },
		{ id: "editing", label: "Editing" },
		{ id: "shortcuts", label: "shortcuts" },
		{ id: "import", label: "Import" },
		{ id: "history", label: "Undo / Redo" },
		{ id: "export", label: "Export" },
		{ id: "tips", label: "Tips" },
	];

	function closeHelp(): void {
		isModalOpen.value = false;
	}
</script>

<style scoped>
	.info:hover {
		background: black !important;
		outline: 2px solid red !important;
	}
</style>
