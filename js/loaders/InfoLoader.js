import { IContentLoader } from "./IContentLoader.js";

export class InfoLoader extends IContentLoader {
  #dropdown = document.getElementById("_i_info");

  constructor() {
    super();
    this.#dropdown.addEventListener("focus", this.load.bind(this));
    this.#dropdown.addEventListener("click", this.load.bind(this));
  }

  /**@override*/
  load(_) {
    if (!this._HTML) {
      this._HTML = `<div class="screen">Loading Info...</div>`;
      fetch("../../assets/templates/info-message.html")
        .then((res) => res.text())
        .then((txt) => (this._HTML = txt))
        .catch(() => (this._HTML = `<div class="error screen">!!! Failed to load information template !!!</div>`))
        .then(() => this.dispatchEvent(new Event("update")));
    }
    this.dispatchEvent(new Event("update"));
  }
}
