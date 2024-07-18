import { IElementManager } from "./IElementManager.js";

export class FileLoader extends IElementManager {
  #testSuitePath = "../../assets/test-suites";

  // Elements
  #typeDisplayValue = document.getElementById("suite-value");
  #contentDisplayPane = document.getElementById("content");

  /** @type {import("../singletons/SharedState.js").SuiteItem} */
  #suite;
  #testUrl;
  #fileContents;

  #shoudCache = () => document.getElementById("cache-btn")?.checked ?? false;

  /**
   * Given a suite is selected,
   */
  #getRandomTestUrl() {
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

  async #getFileContents() {
    const local = localStorage.getItem(this.#testUrl);
    if (local) return local;

    const remote = await fetch(this.#testUrl).then((res) => res.text());
    if (!remote) return undefined;
    if (this.#shoudCache()) localStorage.setItem(this.#testUrl, remote);
    return remote;
  }

  #loadCodeTest() {}

  #loadActionTest() {}

  /**@param {import("./SharedState").SuiteItem} suite */
  async loadRandomTest(suite) {
    this.#suite = suite;
    this.renderLoading();
    this.#testUrl = this.#getRandomTestUrl();
    this.#fileContents = await this.#getFileContents();
    if (this.#suite.type === "Code") this.#loadCodeTest();
    else this.#loadActionTest();
    this.render();
  }

  renderLoading() {
    this.#contentDisplayPane.innerHTML = `<div class="screen">Loading...</div>`;
  }

  render() {
    this.#typeDisplayValue.innerText = this.#suite.type;
    if (!this.#fileContents) {
      this.#contentDisplayPane.innerHTML = `<div class="screen"><span class="fail">Failed to load test</span></div>`;
    }
    this.dispatchEvent("update");
  }
}
