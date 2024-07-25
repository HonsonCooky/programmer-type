export class IContentLoader extends EventTarget {
  /**@type {string|null}*/
  _HTML;

  /** Load the template into runtime memory */
  load(obj) {
    throw Error("Unimplemeneted 'getHTML' method");
  }

  /**
   * Get the HTML contents from this loader.
   * @returns {string}
   */
  getHTML() {
    if (!this._HTML) return `<div class="info screen">Unable to load info just yet, try again in a second</div>`;
    return this._HTML;
  }
}
