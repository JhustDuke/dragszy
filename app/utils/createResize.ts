interface ResizeOptions {
	shouldStart: () => boolean;
	onResizeStart?: () => void;
	onResizeEnd?: () => void;
	onResize: (width: number, height: number) => void;
}

export function createResize(
	getCurrentWidth: () => number,
	getCurrentHeight: () => number,
	options: ResizeOptions
) {
	function right(event: MouseEvent): void {
		if (!options.shouldStart()) return;

		event.stopPropagation();
		options.onResizeStart?.();

		const dragStartX = event.clientX;
		const initialWidth = getCurrentWidth();
		const initialHeight = getCurrentHeight();

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveX = event.clientX > dragStartX;
			const dragDistanceX = Math.abs(event.clientX - dragStartX);

			if (isDraggingTowardsPositiveX) {
				options.onResize(initialWidth + dragDistanceX, initialHeight);
				return;
			}

			options.onResize(initialWidth - dragDistanceX, initialHeight);
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
		options.onResizeStart?.();

		const dragStartY = event.clientY;
		const initialWidth = getCurrentWidth();
		const initialHeight = getCurrentHeight();

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveY = event.clientY > dragStartY;
			const dragDistanceY = Math.abs(event.clientY - dragStartY);

			if (isDraggingTowardsPositiveY) {
				options.onResize(initialWidth, initialHeight + dragDistanceY);
				return;
			}

			options.onResize(initialWidth, initialHeight - dragDistanceY);
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
		options.onResizeStart?.();

		const dragStartX = event.clientX;
		const initialWidth = getCurrentWidth();
		const initialHeight = getCurrentHeight();

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveX = event.clientX > dragStartX;
			const dragDistanceX = Math.abs(event.clientX - dragStartX);

			if (isDraggingTowardsPositiveX) {
				options.onResize(initialWidth - dragDistanceX, initialHeight);
				return;
			}

			options.onResize(initialWidth + dragDistanceX, initialHeight);
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
		options.onResizeStart?.();

		const dragStartY = event.clientY;
		const initialWidth = getCurrentWidth();
		const initialHeight = getCurrentHeight();

		const handleResizeDrag = function (event: MouseEvent): void {
			const isDraggingTowardsPositiveY = event.clientY > dragStartY;
			const dragDistanceY = Math.abs(event.clientY - dragStartY);

			if (isDraggingTowardsPositiveY) {
				options.onResize(initialWidth, initialHeight - dragDistanceY);
				return;
			}

			options.onResize(initialWidth, initialHeight + dragDistanceY);
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
