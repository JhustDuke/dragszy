// utils/measureElem.ts

//finds the elem by id, reads its real on-screen size, and hands both
//numbers to whatever callback the caller provides - this function
//doesn't know or care what happens with the numbers afterward
export function measureElem(
	id: string,
	onMeasured: (width: number, height: number) => void
): void {
	const node = document.getElementById(id);
	if (!node) return;

	const rect = node.getBoundingClientRect();
	onMeasured(rect.width, rect.height);
}
