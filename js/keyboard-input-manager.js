import { NavigationMangager } from "./navigation-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";

export class KeyboardInputManager {
  /**
   * The KeyboardInputManager is used to control where keyboard events are set based on the state of the program.
   * @param {Object} param0
   * @param {NavigationMangager} param0.navigationManager
   * @param {TextEditorManager} param0.textEditor
   */
  constructor({ navigationManager, textEditorManager }) {
    this.navigationManager = navigationManager;
    this.textEditorManager = textEditorManager;

    this.currentContext = this.navigationManager;

    // This is the critical logic for why this class exists
    const textEditorElement = document.getElementById("text-editor");
    textEditorElement.addEventListener("focusin", () => {
      this.currentContext = this.textEditorManager;
    });
    textEditorElement.addEventListener("focusout", () => {
      this.currentContext = this.navigationManager;
    });

    window.addEventListener(
      "keydown",
      function (ev) {
        if (this.currentContext) this.currentContext.keydown(ev);
      }.bind(this),
    );
  }
}
