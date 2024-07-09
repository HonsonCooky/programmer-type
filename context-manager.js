export class ContextManager {
  currentContext = undefined;

  constructor({ navigationManager, textEditor: textEditorManager }) {
    this.navigationManager = navigationManager;
    this.textEditorManager = textEditorManager;

    this.navigationManager.setup();
    this.textEditorManager.setup();
    this.currentContext = this.navigationManager;

    this.setup();
  }

  setup() {
    // Update context around the focus of the text editor
    document.getElementById("text-editor").addEventListener("focusin", () => {
      this.currentContext.lostFocus();
      this.currentContext = this.textEditorManager;
    });
    document.getElementById("text-editor").addEventListener("focusout", () => {
      this.currentContext.lostFocus();
      this.currentContext = this.navigationManager;
    });

    window.addEventListener("keydown", this.keydown);
  }

  keydown(ev) {
    this.currentContext.keydown(ev);
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
