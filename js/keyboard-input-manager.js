import { NavigationMangager } from "./navigation-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";

export class KeyboardInputManager {
  constructor() {
    this.currentContext = window.navigationManager;

    // This is the critical logic for why this class exists
    const textEditorElement = document.getElementById("text-editor");
    textEditorElement.addEventListener("focusin", () => {
      this.currentContext = window.textEditorManager;
    });
    textEditorElement.addEventListener("focusout", () => {
      this.currentContext = window.navigationManager;
    });

    window.addEventListener(
      "keydown",
      function (ev) {
        if (this.currentContext) this.currentContext.keydown(ev);
      }.bind(this),
    );
  }
}
