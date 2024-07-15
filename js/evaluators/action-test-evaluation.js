export class ActionTestEvaluation {
  _actionToFunction(action, content) {
    switch (action) {
      case "copy":
        return function() {
          console.log(content);
          navigator.clipboard.writeText(content).then(() => {
            document.dispatchEvent(new Event("clipboardCopy"));
          });
        };
      case "paste":
        return function() {
          navigator.clipboard.readText().then((txt) => {
            console.log(txt, content);
            document.dispatchEvent(new Event("clipboardPaste"));
          });
        };
      default:
        return function() { };
    }
  }

  reset() {
    throw Error("Unimplemented Method");
  }

  /**
   * @returns {{
   *   index: number,
   *   seq: {char: string, element: HTMLElement}[]
   * }}
   */
  results() {
    throw Error("Unimplemented Method");
  }

  /**
   * @param {KeyboardEvent} ev
   * @returns {boolean}
   */
  evaluate(ev) {
    throw Error("Unimplemented Method");
  }

  /**
   * @param {Object} param0
   * @param {string} param0.currentTest
   * @param {HTMLElement} param0.textEditorElement
   */
  load({ currentTest, textEditorElement }) {
    try {
      this._textEditorElement = textEditorElement;
      const instructions = JSON.parse(currentTest);
      const steps = Object.entries(instructions).map(([k, v]) => {
        const { action, comments, content, keybind } = v;
        const newLine = `<div class="line"></div>`;
        const commentLines = comments.map((c) => `<div class="line comment">// ${c}</div>`).join("");
        if (action) {
          const actionFn = this._actionToFunction(action, content);
          const keybindChars = keybind.split("");
          const keybinds = keybindChars
            .map((c, i) => {
              if (i === keybindChars.length - 1) return `<span class="act">${c}</span>`;
              return `<span>${c}</span>`;
            })
            .join("");
          const actionLine = `<div class="line action">${keybinds}</div>`;
          return {
            action: actionFn,
            elements: [commentLines, actionLine, newLine],
          };
        }
        return {
          elements: [commentLines, newLine],
        };
      });

      this._textEditorElement.innerHTML = steps.reduce((p, c) => p + c.elements.join(""), "");

      console.log(steps);
    } catch (e) {
      textEditorElement.innerHTML = `<span class="error">Unable to load test</span>`;
      console.error(e);
    }
  }
}
