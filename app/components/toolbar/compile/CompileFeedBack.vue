<template>
	<p
		v-for="(message, index) in messages"
		:key="index"
		class="mb-2"
		:class="{ 'compile-active': activeMessageIndex === index }">
		{{ message }}
	</p>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";

	const props = defineProps<{
		framework: "tw" | "bs5";
	}>();

	const emit = defineEmits<{
		complete: [];
	}>();

	const activeMessageIndex = ref(0);

	const frameworkName = props.framework === "tw" ? "Tailwind" : "Bootstrap 5";

	const messages = [
		"Your project is compiling...",
		"Images will not be included in the exported file. Relative image paths will be preserved, for example: ./image.png",
		`Your exported project uses ${frameworkName}.`,
		"Font Awesome 4.7.3 is used. Be sure to include Font Awesome in your index.html.",
		"Dragzy editor data will not be included in the exported file.",
	];

	function showNextMessage(): void {
		setTimeout(function () {
			if (activeMessageIndex.value >= messages.length - 1) {
				emit("complete");
				return;
			}

			activeMessageIndex.value += 1;
			showNextMessage();
		}, 5900);
	}

	onMounted(function () {
		showNextMessage();
	});
</script>

<style scoped>
	.compile-active {
		font-size: 1.4rem;
		color: red;
		font-weight: 600;
	}
</style>
