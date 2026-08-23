export function togglePositionedElemsHighlight(
	elemsId: string[],
	show: boolean,
	color: string
): void {
	elemsId.forEach(function (elem: string) {
		const node = document.getElementById(elem);
		if (!node) return;

		if (show) {
			node.style.setProperty("border", `4px solid ${color}`, "important");
		} else {
			node.style.removeProperty("border");
		}
	});
}
