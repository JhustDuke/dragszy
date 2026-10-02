export const initDownload = function (content: string, filename: string) {
	const blob = new Blob([content], { type: "text/plain" });
	const url = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;

	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);

	setTimeout(function () {
		URL.revokeObjectURL(url);
	}, 2000);
};
