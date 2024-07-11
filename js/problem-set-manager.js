export class ProblemSetManager extends EventTarget {
  async setup() {
    this.sets = await this._getFolderContents("/");
    this.dispatchEvent(new Event("setsLoaded"));

    if (this.sets[0]) {
      await this.selectSet(this.sets[0]);
      await this.selectNextExample();
    }
  }

  /**
   *
   * @param {string} folder
   * @returns {Promise<{title:string, isDirectory: boolean}[]>}
   */
  async _getFolderContents(folder) {
    const fetchFiles = await fetch(`${window.location.origin}/tests${folder}`).then((res) => res.text());
    return Array.from(fetchFiles.matchAll(/class="([^"]*)" title="([^"]*)"/g))
      .map(([_, c, t]) => {
        return { title: t, isDirectory: c.includes("directory") };
      })
      .filter((o) => o.title != "..");
  }

  async _determineSetType() {}

  /** @param {{title: string, isDirectory: boolean}} set  */
  async selectSet(set) {
    if (!set.isDirectory) return;

    const examples = await this._getFolderContents(`/${set.title}`);
    if (examples.length === 0) return;

    const metaData = await fetch(`${window.location.origin}/tests/${set.title}/_meta.json`).then((res) => res.json());
    if (!metaData) return;

    this.selectedSet = set;
    this.selectedSet.metaData = metaData;
    this.selectedSet.examples = examples.filter((o) => o.title.startsWith("example"));

    this.dispatchEvent(new Event("setSelected"));
  }

  async selectNextExample() {
    const nextIndex = Math.floor(Math.random() * this.selectedSet.examples.length);
    const nextExample = this.selectedSet.examples[nextIndex];
    this.currentExample = await fetch(
      `${window.location.origin}/tests/${this.selectedSet.title}/${nextExample.title}`,
    ).then((res) => res.blob());
    this.dispatchEvent(new Event("exampleSelected"));
  }
}
