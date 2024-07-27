export class Content extends EventTarget {
  // Elements
  #contentDisplayPane = document.getElementById("_enter_content");
  #contextDisplayText = document.getElementById("content-context");
  #infoDisplayBtn = document.getElementById("_i_info");

  // Cached Templates
  #infoTemplate;
  #resultsTemplate;

  // Last known values
  /**@type {{name: string; type: string;}|null}*/
  #lastSuite;
  #lastTestTemplate = "";

  constructor() {
    super();

    // Setup Click actions
    this.#contentDisplayPane.addEventListener("click", () => {
      this.#contentDisplayPane.tabIndex = -1;
      this.#contentDisplayPane.focus();
    });

    this.#infoDisplayBtn.addEventListener("click", () => this.#displayInfo());
  }

  #loading() {
    this.#contentDisplayPane.innerHTML = `<div class="screen">Loading...</div>`;
  }

  #displayInfo() {
    const isInfoShowing = this.#contentDisplayPane.querySelector("#info-message");
    this.#loading();
    this.dispatchEvent(new CustomEvent("interrupt"));

    if (isInfoShowing) {
      this.#contentDisplayPane.innerHTML = this.#lastTestTemplate;
      return;
    }

    if (!this.#infoTemplate) {
      fetch("../../templates/info-message.html")
        .then((res) => res.text())
        .then((txt) => {
          this.#contentDisplayPane.innerHTML = txt;
        })
        .catch(() => {
          this.#contentDisplayPane.innerHTML = `<div class="screen">Oops! We had a technical issue getting the info template. How embarassing.</div>`;
        });
    } else {
      this.#contentDisplayPane.innerHTML = this.#infoTemplate;
    }
  }

  displayTest() {}

  displayResults() {}
}
