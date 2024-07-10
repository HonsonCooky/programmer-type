export class TextEditorManager {
	setup() {
		document.getElementById("play").addEventListener("click", () => {
			document.getElementById("text-editor").tabIndex = -1;
			document.getElementById("text-editor").focus();
		});
	}

	/**
	* @param {KeyboardEvent} ev
	*/
	keydown(ev) {
		let key = ev.key;

	}

	lostFocus() { }
}
