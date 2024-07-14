export class TextEditorManager {
  textEditorElement = document.getElementById("text-editor");
  constructor() {
    this.textEditorElement.addEventListener("click", function () {
      console.log("here");
    });
  }

  /** @param {KeyboardEvent} ev */
  keydown(ev) {
    let key = ev.key;
  }
}
