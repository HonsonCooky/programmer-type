export class InfoManager extends EventTarget {
  constructor() {
    super();

    const info = document.getElementById("info");
    info.addEventListener("focusin", this.loadHelpInformation.bind(this));
    info.addEventListener("focusout", () => this.dispatchEvent(new Event("reloadTest")));

    fetch("../../assets/templates/help-message.html")
      .then((res) => res.text())
      .then((htmlStr) => new DOMParser().parseFromString(htmlStr, "text/html"))
      .then((element) => (this.helpInfoElement = element));
  }

  loadHelpInformation(retryCount = 0) {
    if (retryCount > 5) {
      this.dispatchEvent(new Event("Can't Load Help Page"));
      return;
    }
    if (!this.helpInfoElement) setTimeout(this.helpInfoElement, 200);

    const textEditor = document.getElementById("text-editor");
    textEditor.innerHTML = this.helpInfoElement.querySelector("body").innerHTML;
  }
}
