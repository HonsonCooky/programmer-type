export class TextEditorManager {
	setup() {
		document.getElementById("play").addEventListener("click", () => {
			document.getElementById("text-editor").tabIndex = -1;
			document.getElementById("text-editor").focus();
		});
	}

	keydown(ev) { }
	lostFocus() { }
}
