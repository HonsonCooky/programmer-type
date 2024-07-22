import { IElementManager } from "./IElementManager.js";

export class InfoLoader extends IElementManager {
	#dropdown = document.getElementById("_i_info");
	/**@type {string|null}*/
	#infoHTML;

	constructor() {
		super();
		fetch("../../assets/templates/info-message.html")
			.then((res) => res.text())
			.then((txt) => (this.#infoHTML = txt))
			.catch(() => (this.#infoHTML = `<div class="error">!!! Failed to load information template !!!</div>`));

		this.#dropdown.addEventListener("focus", this.render.bind(this));
		this.#dropdown.addEventListener("click", this.render.bind(this));
	}

	getInfoHTML() {
		if (!this.#infoHTML) return `<div class="info">Unable to load info just yet, try again in a second</div>`;
		return this.#infoHTML;
	}

	/**
	 * @override
	 */
	render() {
		this.dispatchEvent(new Event("update"));
	}
}
