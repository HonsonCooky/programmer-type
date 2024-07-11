import { NavigationMangager } from "./navigation-manager.js";
import { TextEditorManager } from "./text-editor-manager.js";

/**
 * This seems a little dumb, however, we only have two different major contexts that the application state can be in.
 * Either your doing the typing test, or you're navigating the web app and selecting the test etc.
 * This overarching manager is responsible for sending key events to the right place.
 */
export class ContextManager {
  /**
   * @param {Object} param0
   * @param {NavigationMangager} param0.navigationManager
   * @param {TextEditorManager} param0.textEditor
   */
  constructor({ navigationManager, textEditorManager }) {
    this.navigationManager = navigationManager;
    this.textEditorManager = textEditorManager;
  }

  setup() {
    this.currentContext = this.navigationManager;

    // This is the critical logic for why this class exists
    document.getElementById("text-editor").addEventListener("focusin", () => {
      this.currentContext = this.textEditorManager;
    });
    document.getElementById("text-editor").addEventListener("focusout", () => {
      this.currentContext = this.navigationManager;
    });

    // Here, we give control of the "keydown" event to the ContextManager, and it decides what context should be
    // triggered with this event. This is apposed to each manager deciding if the event was intended for them or
    // not.
    window.addEventListener("keydown", this.keydown.bind(this));
  }

  /**
   * @param {KeyboardEvent} ev
   */
  keydown(ev) {
    if (this.currentContext) this.currentContext.keydown(ev);
  }

  static getModifiers(ev) {
    const mods = [];
    if (ev.ctrlKey) mods.push("ctrl");
    if (ev.metaKey) mods.push("meta");
    if (ev.altKey) mods.push("alt");
    if (ev.shiftKey) mods.push("shift");
    return mods;
  }
}
