import type { CanvasElem } from "~/types";

interface ResizeOptions {
	shouldStart: () => boolean;
	onResizeEnd?: () => void;
}

export function createResize(newElemInfo: CanvasElem, options: ResizeOptions) {
	function right(event: MouseEvent): void {
		if (!options.shouldStart()) return;

		event.stopPropagation();

		const dragStartX = event.clientX;
		const initialWidth = newElemInfo.width ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveX = event.clientX > dragStartX;
			const dragDistanceX = Math.abs(event.clientX - dragStartX);

			if (isDraggingTowardsPositiveX) {
				newElemInfo.width = initialWidth + dragDistanceX;
				return;
			}

			newElemInfo.width = initialWidth - dragDistanceX;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
			options.onResizeEnd?.();
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	function bottom(event: MouseEvent): void {
		if (!options.shouldStart()) return;

		event.stopPropagation();

		const dragStartY = event.clientY;
		const initialHeight = newElemInfo.height ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveY = event.clientY > dragStartY;
			const dragDistanceY = Math.abs(event.clientY - dragStartY);

			if (isDraggingTowardsPositiveY) {
				newElemInfo.height = initialHeight + dragDistanceY;
				return;
			}

			newElemInfo.height = initialHeight - dragDistanceY;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
			options.onResizeEnd?.();
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	function left(event: MouseEvent): void {
		if (!options.shouldStart()) return;

		event.stopPropagation();

		const dragStartX = event.clientX;
		const initialWidth = newElemInfo.width ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveX = event.clientX > dragStartX;
			const dragDistanceX = Math.abs(event.clientX - dragStartX);

			if (isDraggingTowardsPositiveX) {
				newElemInfo.width = initialWidth - dragDistanceX;
				return;
			}

			newElemInfo.width = initialWidth + dragDistanceX;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
			options.onResizeEnd?.();
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	function top(event: MouseEvent): void {
		if (!options.shouldStart()) return;

		event.stopPropagation();

		const dragStartY = event.clientY;
		const initialHeight = newElemInfo.height ?? 0;

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveY = event.clientY > dragStartY;
			const dragDistanceY = Math.abs(event.clientY - dragStartY);

			if (isDraggingTowardsPositiveY) {
				newElemInfo.height = initialHeight - dragDistanceY;
				return;
			}

			newElemInfo.height = initialHeight + dragDistanceY;
		};

		const stopResizeDrag = function (): void {
			document.removeEventListener("mousemove", handleResizeDrag);
			document.removeEventListener("mouseup", stopResizeDrag);
			options.onResizeEnd?.();
		};

		document.addEventListener("mousemove", handleResizeDrag);
		document.addEventListener("mouseup", stopResizeDrag);
	}

	return {
		top,
		right,
		bottom,
		left,
	};
}
