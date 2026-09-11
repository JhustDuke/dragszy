<template>
	<!-- width/height badge - now hover/resize-gated via the showBadge prop,
		instead of always showing whenever this component is rendered -->
	<small
		v-if="(showBadge && width >= 100) || height >= 100"
		class="position-absolute top-50 start-50 translate-middle badge bg-dark">
		w:{{ width }}px h:{{ height }}px
	</small>

	<!-- Top handle -->
	<button
		class="y position-absolute top-0 start-50 translate-middle rounded-circle border border-primary bg-white"
		@mousedown="resize.top"></button>

	<!-- Right handle -->
	<button
		class="x position-absolute top-50 start-100 translate-middle rounded-circle border border-primary bg-white"
		@mousedown="resize.right"></button>

	<!-- Bottom handle -->
	<button
		class="y position-absolute top-100 start-50 translate-middle rounded-circle border border-primary bg-white"
		@mousedown="resize.bottom"></button>

	<!-- Left handle -->
	<button
		class="x position-absolute top-50 start-0 translate-middle rounded-circle border border-primary bg-white"
		@mousedown="resize.left"></button>
</template>

<script setup lang="ts">
	//no logic here - resize.top/right/bottom/left are the SAME functions
	//created once in NewElem.vue via createResize(). this component just
	//wires them to buttons and shows the current w/h. showBadge is passed
	//down from the parent (which already tracks hover state for the
	//delete button) so the badge can follow its own hover/resize rule,
	//separate from the handles, which stay purely selection-gated via
	//the parent's v-if="isSelected" wrapping this whole component.
	defineProps<{
		resize: {
			top: (ev: MouseEvent) => void;
			right: (ev: MouseEvent) => void;
			bottom: (ev: MouseEvent) => void;
			left: (ev: MouseEvent) => void;
		};
		width: number;
		height: number;
		showBadge: boolean;
	}>();
</script>

<style scoped>
	.x {
		width: 14px;
		height: 14px;
		cursor: ew-resize;
	}
	.y {
		width: 14px;
		height: 14px;
		cursor: ns-resize;
	}
</style>
