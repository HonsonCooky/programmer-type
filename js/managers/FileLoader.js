import { IElementManager } from "./IElementManager.js";

export class FileLoader extends IElementManager {
  #testSuitePath = "../../assets/test-suites";

  // Elements
  #contentsPanel = document.getElementById("content");
  #suiteValue = document.getElementById("suite-value");

  /** @type {import("../singletons/SharedState.js").SuiteItem} */
  #suite;
  #testUrl;
  #fileContents;

  #shoudCache = () => document.getElementById("cache-btn")?.checked ?? false;

  #loadRandomTestUrl() {
    if (!this.#suite) {
      console.error("No suite loaded");
      return;
    }

    const prevUrl = this.#testUrl;
    let newUrl = prevUrl;

    // Try get a new random test, retry 5 times max.
    for (let i = 0; i < 5; i++) {
      const randIndex = Math.floor(Math.random() * this.#suite.tests.length);
      const randTest = this.#suite.tests[randIndex];
      newUrl = `${this.#testSuitePath}/${this.#suite.name}/${randTest}`;
      if (this.#suite.tests.length < 2 || newUrl != prevUrl) break;
    }

    return newUrl;
  }

  async #fetchFileContents() {
    const local = localStorage.getItem(this.#testUrl);
    if (local) return local;

    const remote = await fetch(this.#testUrl).then((res) => res.text());
    if (this.#shoudCache()) localStorage.setItem(this.#testUrl, remote);
    return remote;
  }

  #loadCodeTest() {
    console.log(this.#fileContents);
  }

  #loadActionTest() {}

  /**@param {import("./SharedState").SuiteItem} suite */
  async loadRandomTest(suite) {
    this.#suite = suite;
    this.renderLoading();
    this.#testUrl = this.#loadRandomTestUrl();
    this.#fileContents = await this.#fetchFileContents();
    if (this.#suite.type === "Code") this.#loadCodeTest();
    else this.#loadActionTest();
    this.render();
  }

  renderLoading() {
    this.#suiteValue.innerText = `Loading ${this.#suite.type}`;
    this.#contentsPanel.innerHTML = `<div class="loading">Loading...</div>`;
  }

  render() {
    this.#suiteValue.innerText = this.#suite.type;
    this.dispatchEvent("update");
  }
}
