import { IEvaluator } from "./ievaluator.js";

export class ActionTestEvaluation extends IEvaluator {
  _locked = false;

  constructor() {
    super();
    document.addEventListener("clipboardCopy", this._indicateCopy.bind(this));
    document.addEventListener("clipboardPaste", this._indicatePaste.bind(this));
  }

  /** @param {CustomEvent<{actionElement: HTMLElement}>} ev */
  _indicateCopy(ev) {
    const comment = document.createElement("span");
    comment.className = "correct";
    comment.innerText = "  -- Copied";
    ev.detail.actionElement.appendChild(comment);
    this._unlock();
  }

  /** @param {CustomEvent<{actionElement: HTMLElement, txt: string}>} ev */
  _indicatePaste(ev) {
    const { actionElement, content, txt } = ev.detail;
    const sanitizedContent = content.replaceAll(/\r?\n/g, "");
    const sanitizedText = txt.replaceAll(/\r?\n/g, "");

    if (sanitizedContent != sanitizedText) {
      Array.from(actionElement.querySelectorAll(".invalid")).forEach((e) => actionElement.removeChild(e));
      setTimeout(() => {
        const comment = document.createElement("span");
        comment.className = "invalid";
        comment.innerText = "  -- Incorrect";
        actionElement.appendChild(comment);
      }, 100);
      this._testIndex--;
      this._resetLine();
      this._unlock();
      return;
    }

    const comment = document.createElement("span");
    comment.className = "correct";
    comment.innerText = "  -- Pasted";
    actionElement.appendChild(comment);
    this._unlock();
  }

  _unlock() {
    this._locked = false;
    this._updateCurrent();
  }

  _actionToFunction(action, content) {
    switch (action) {
      case "copy":
        return function (actionElement) {
          navigator.clipboard.writeText(content).then(
            function () {
              document.dispatchEvent(new CustomEvent("clipboardCopy", { detail: { actionElement } }));
            }.bind(this),
          );
        };
      case "paste":
        return function (actionElement) {
          navigator.clipboard.readText().then(
            function (txt) {
              document.dispatchEvent(new CustomEvent("clipboardPaste", { detail: { actionElement, content, txt } }));
            }.bind(this),
          );
        };
      default:
        return this._updateCurrent;
    }
  }

  _resetLine(curTerm) {
    curTerm = curTerm ?? this._testSequence[this._testIndex];
    const lineTerms = this._testSequence.filter((term) => term.line === curTerm.line);
    lineTerms.forEach((term) => (term.element.className = "invalid"));
    setTimeout(() => {
      lineTerms.forEach((term) => {
        if (term.element.className === "invalid") term.element.className = "";
      });
    }, 200);
    this._testIndex = this._testSequence.indexOf(lineTerms[0]);
  }

  /**
   * @param {{
   * line: number, char: string, element: HTMLElement, action: { fn: Function, element: HTMLElement, }
   * }} curTerm
   */
  _attemptAction(curTerm) {
    curTerm.action.fn(curTerm.action.element);
  }

  _updateCurrent() {
    const element = this._testSequence[this._testIndex]?.element;

    if (!element) {
      this.dispatchEvent(new Event("evaluationComplete"));
      return;
    }

    if (!element) return;
    element.className = "current";
    element.scrollIntoView({ behavior: "smooth" });
  }

  _correctCharacter(curTerm) {
    // Just a normal character
    curTerm.element.className = "correct";
    this._testIndex++;

    // Wait for action to complete before moving on - hand over move on responsibility
    if (curTerm.action) {
      this._locked = true;
      return this._attemptAction(curTerm);
    }

    this._updateCurrent();
  }

  reset() {
    super.reset();
    this._locked = false;
  }

  /**
   * @param {KeyboardEvent} ev
   * @returns {boolean}
   */
  evaluate(ev) {
    if (!this._testSequence || this._locked) return;
    const key = ev.key;
    const curTerm = this._testSequence[this._testIndex];

    if (curTerm.char != key) {
      this._resetLine(curTerm);
      return false;
    }

    this._correctCharacter(curTerm);
  }

  /**
   * @param {Object} param0
   * @param {string} param0.currentTest
   * @param {HTMLElement} param0.textEditorElement
   */
  load({ currentTest, textEditorElement }) {
    try {
      this._locked = false;
      this._testIndex = 0;
      this._textEditorElement = textEditorElement;
      const instructions = JSON.parse(currentTest);
      const steps = instructions.map((v) => {
        const { action, comments, content, keybind } = v;
        const newLine = `<div class="line"></div>`;
        const commentLines = comments
          .map((c) => {
            if (c.includes("Title:")) return `<div class="line comment title">${c.replace(/Title:\s*/, "")}</div>`;
            return `<div class="line comment">// ${c}</div>`;
          })
          .join("");
        if (action) {
          const actionFn = this._actionToFunction(action, content.join("\n"));
          const keybindChars = keybind.split("");
          const keybinds = keybindChars
            .map((c, i) => {
              if (i === keybindChars.length - 1) return `<span class="act">${c}</span>`;
              return `<span>${c}</span>`;
            })
            .join("");
          const actionLine = `<div class="line action">${keybinds}</div>`;
          return {
            keys: keybindChars,
            action: actionFn,
            elements: [commentLines, actionLine, newLine],
          };
        }
        return {
          elements: [commentLines, newLine],
        };
      });

      // Load elements, such that we can get HTMLElement references
      this._textEditorElement.innerHTML = steps.reduce((p, c) => p + c.elements.join(""), "");
      const actions = steps.filter((s) => !!s.action);
      const actionElements = Array.from(this._textEditorElement.querySelectorAll(".action")).map((a) => ({
        element: a,
        charElements: Array.from(a.querySelectorAll("span")),
      }));

      if (actions.length != actionElements.length) throw Error("Mismatched Actions to Action Elements");

      this._testSequence = actions
        .map((a, i) => {
          const chars = a.keys;
          const { element, charElements } = actionElements[i];
          if (chars.length != charElements.length) throw Error("Mismatched Chars to Char Elements");

          return chars.map((c, j) => {
            const charElement = charElements[j];
            return {
              line: i,
              char: c,
              element: charElement,
              action: charElement.classList.contains("act")
                ? {
                    fn: a.action,
                    element,
                  }
                : undefined,
            };
          });
        })
        .flat();
    } catch (e) {
      textEditorElement.innerHTML = `<span class="error">Unable to load test</span>`;
      console.error(e);
    }
  }
}
