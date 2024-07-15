export class InfoManager extends EventTarget {
  constructor() {
    super();

    fetch("../../assets/help-message.html")
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
  }
}
