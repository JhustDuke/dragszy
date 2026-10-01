```vue
<template>
	<div class="px-3 pt-2">
		<span
			class="badge bg-secondary mb-1 d-block text-truncate"
			style="max-width: 45%; overflow: hidden">
			{{ activeElement.id || activeElement.children }}
		</span>
		<br />

		<textarea
			v-model="promptText"
			class="form-control form-control-sm prompt-box"
			rows="2"
			placeholder="Describe what you want..."
			@blur="emitUserPrompt" />
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import type { CanvasElem } from "~/types";

	defineProps<{
		activeElement: CanvasElem;
	}>();

	const emit = defineEmits<{
		"user-prompt": [promptText: string];
	}>();

	const promptText = ref("");

	function emitUserPrompt() {
		emit("user-prompt", promptText.value);
	}
</script>

<style scoped>
	.prompt-box {
		resize: none;
	}
</style>
```
