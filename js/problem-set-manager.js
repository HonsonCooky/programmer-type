export class ProblemSetManager extends EventTarget {
  async setup() {
    this.sets = await this._getFolderContents("/");
    this.dispatchEvent(new Event("setsLoaded"));

    await this.selectSet(this.sets[0]);
  }

  /**
   *
   * @param {string} folder
   * @returns {Promise<string[]>}
   */
  async _getFolderContents(folder) {
    const filesHtmlStr = await fetch(`${window.location.origin}/tests${folder}`).then((res) => res.text());
    const htmlElement = new DOMParser().parseFromString(filesHtmlStr, "text/html");
    return Array.from(htmlElement.querySelector("#files").children)
      .map((c) => c.querySelector("a")?.title)
      .filter((t) => t && !t.includes("..") && !t.includes("_assist"));
  }

  /** @param {string} set  */
  async selectSet(set) {
    const examples = await this._getFolderContents(`/${set}`);
    if (examples.length === 0) return;
    this.selectedSet = set;
    this.selectedExamples = examples;
    this.dispatchEvent(new Event("setSelected"));
  }

  async selectNextExample() {
    const nextIndex = Math.floor(Math.random() * this.selectedExamples.length);
    const nextExample = this.selectedExamples[nextIndex];
    console.log(nextExample);
    this.currentExample = await fetch(`${window.location.origin}/tests/${this.selectedSet}/${nextExample}`).then(
      (res) => res.blob(),
    );
    this.dispatchEvent(new Event("exampleSelected"));
  }
}
