export class InfoManager extends EventTarget {

  setup() {
    fetch("../../assets/help-message.html")
      .then(res => res.text())
      .then(htmlStr => {
        this.helpInfoElement = document.createElement("div");
        this.helpInfoElement.id = "help-wrapper";
        this.helpInfoElement.innerHTML = htmlStr;
        console.log(this.helpInfoElement);
      })
  }

  loadHelpInformation() {

  }
}
