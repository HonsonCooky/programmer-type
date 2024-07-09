export class TextEditor {
	input = [];

	constructor() {
		this.textEditor = document.getElementById("text-editor");
		document.getElementById("play").addEventListener("click", () => {
			this.textEditor.tabIndex = -1;
			this.textEditor.focus();
		});

		window.addEventListener("keydown", (event) => {
			if (document.activeElement != this.textEditor) return;
			const key = event.key;
		});
	}
}
