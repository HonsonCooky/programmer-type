import { SuiteDataBase } from "../../db/suites.js";

export class Content extends EventTarget {
  // Elements
  #contentDisplayPane = document.getElementById("_enter_content");
  #infoDisplayBtn = document.getElementById("_i_info");

  // Cached Templates
  #infoTemplate;
  #resultsTemplate;

  /**@type {{name: string; type: string; seenTests:string[]}|null}*/
  #suite;
  #currentContent = "";

  constructor() {
    super();

    // Setup Click actions
    this.#contentDisplayPane.addEventListener("click", () => {
      this.#contentDisplayPane.tabIndex = -1;
      this.#contentDisplayPane.focus();
    });

    this.#infoDisplayBtn.addEventListener("click", () => this.#displayInfoMessage());
  }

  //-------------------------------------------------------------------------------------------------------------------
  // UTILS
  //-------------------------------------------------------------------------------------------------------------------

  /** Display Loading Screen */
  #loading() {
    this.#currentContent = `<div class="screen">Loading...</div>`;
    this.#render();
  }

  #render() {
    this.#contentDisplayPane.innerHTML = this.#currentContent;
    this.#contentDisplayPane.scrollTo({ top: 0 });
  }

  //-------------------------------------------------------------------------------------------------------------------
  // INTERNAL LOADING - INFO
  //-------------------------------------------------------------------------------------------------------------------

  /** Display Information Screen */
  #displayInfoMessage() {
    const isInfoShowing = !!this.#contentDisplayPane.querySelector("#info-message");
    if (isInfoShowing) {
      this.displayTest();
      return;
    }

    this.#loading();
    this.dispatchEvent(new CustomEvent("interrupt"));
    if (!this.#infoTemplate) {
      fetch("../../templates/info-message.html")
        .then((res) => res.text())
        .then((txt) => {
          this.#infoTemplate = txt;
          this.#currentContent = this.#infoTemplate;
        })
        .catch(() => {
          this.#currentContent = `<div class="screen">Oops! We had a technical issue getting the info template. How embarassing.</div>`;
        })
        .finally(() => this.#render());
      return;
    }

    this.#currentContent = this.#infoTemplate;
    this.#render();
  }

  //-------------------------------------------------------------------------------------------------------------------
  // INTERNAL LOADING - TESTS
  //-------------------------------------------------------------------------------------------------------------------

  /**
   * Manipulate the file contents of an Action Test into an HTML string ready for testing.
   * @param {string} fileContents
   */
  #loadActionTestHTML(fileContents) {
    /**@type {ATFile}*/
    const instructions = JSON.parse(fileContents);
    const stepBlocks = instructions.map((instruct, i) => {
      const { action, comments, content, keybind } = instruct;

      const nlLine = `<div class="line newline"></div>`;
      const commentStrs = comments.map((c) => {
        if (c.includes("Title:")) return `<div class="line title">${c}</div>`;
        return `<div class="line comment">// ${c}</div>`;
      });
      let inputDiv = "";

      // If the user requires come action.
      if (action && content && keybind) {
        const inputStrs = keybind.split("").map((k) => `<span line="${i}">${k}</span>`);
        const inputDivAttrs = `class="line" action="${action}" content="${content.join("\\n")}"`;
        inputDiv = `<div ${inputDivAttrs}>${inputStrs.join("")}</div>`;
      }

      return `${commentStrs.join("")}${inputDiv}${nlLine}`;
    });

    // Wrap it all in a div with a class to help identify the type of test.
    this.#currentContent = `<div class="test action">${stepBlocks.join("")}</div>`;
  }

  /**
   * Manipulate the file contents of a Coding Test into an HTML string ready for testing.
   * @param {string} fileContents
   */
  #loadCodeTestHTML(fileContents) {
    // Get the lines.
    const lines = fileContents.split(/\r?\n/g);

    // Get characters and indentation level.
    const linesMapped = lines
      .map((line) => {
        const indent = (line.match(/^(\s+)/) || [""])[0].length;
        const chars = line.trim().split("");
        return { indent, chars };
      })
      .map((lineMap, i, lineMaps) => {
        // Align empty newlines with their previous scope. Doesn't work for newlines after scope entry.
        if (i > 0 && lineMap.chars.length === 0) {
          lineMap.indent = lineMaps[i - 1].indent;
        }
        return lineMap;
      });

    // Map each line to a DIV of SPANs, each span being a character.
    const lineStrs = linesMapped.map(({ indent, chars }) => {
      const cStrs = chars.map((c) => `<span>${c}</span>`);
      const nlStr = `<span class="newline">\\n</span>`;
      const divAttr = `class="line" style="margin-left:calc(var(--fs--2) * ${indent})"`;

      // Little complicated, but we are just creating the DIV of SPANs with
      // some styling for indentation. We also append a newline character.
      return `<div ${divAttr}>${cStrs.join("")}${nlStr}</div>`;
    });

    // Wrap it all in a div with a class to help identify the type of test.
    this.#currentContent = `<div class="test code">${lineStrs.join("")}</div>`;
  }

  //-------------------------------------------------------------------------------------------------------------------
  // INTERNAL LOADING - RESULTS
  //-------------------------------------------------------------------------------------------------------------------

  /** @param {import("../evaluators/KeyboardEvaluator.js").TestRecording[]} recordings*/
  #loadResultsTitles(recordings) {
    const suiteName = this.#contentDisplayPane.querySelector("#result-suite-name");
    suiteName.innerText = this.#suite.name;
    const suiteType = this.#contentDisplayPane.querySelector("#result-suite-type");
    suiteType.innerText = this.#suite.type;
    const testDuration = this.#contentDisplayPane.querySelector("#result-duration");
    testDuration.innerText = recordings[0].duration ? `${recordings[0].duration}s` : "Infinite";
  }

  /** @param {import("../evaluators/KeyboardEvaluator.js").TestRecording[]} recordings*/
  #loadResultsGraphs(recordings) {
    // Create a canvas for the graph
    const resultsDiv = this.#contentDisplayPane.querySelector("#results");
    const graph = document.createElement("canvas");

    /**
     * @param {Element} resultsDiv
     * @param {HTMLCanvasElement} graph
     */
    function renderGraph(resultsDiv, graph) {
      const width = resultsDiv.offsetWidth;
      const height = (window.innerHeight / 100) * 40;
      graph.width = width;
      graph.height = height;
      const ctx = graph.getContext("2d");
      drawAxis({ ctx, width, height });
    }

    /**@param {Object} param0
     * @param {(CanvasRenderingContext2D & ImageBitmapRenderingContext & WebGLRenderingContext & WebGL2RenderingContext)} param0.ctx
     * @param {number} param0.width
     * @param {number} param0.height */
    function drawAxis({ ctx, width, height }) {
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(10, height - 10);
    }

    renderGraph(graph, resultsDiv);
    window.addEventListener("resize", renderGraph(graph, resultsDiv));
    resultsDiv.appendChild(graph);
  }

  //-------------------------------------------------------------------------------------------------------------------
  // API
  //-------------------------------------------------------------------------------------------------------------------

  /**
   * Display a test. If no suite is parsed in, then we assume the new test
   * comes from the existing suite. If a suite (name and type) are passing in,
   * then we assume a new suite has been selected.
   *
   * @param {{name: string; type: string}|undefined} suite
   */
  displayTest(suite) {
    if (suite) this.#suite = { name: suite.name, type: suite.type };
    if (!this.#suite) return;

    this.#loading();
    SuiteDataBase.getNextTest(this.#suite.name)
      .then((fileContents) => {
        if (this.#suite.type === "Action") this.#loadActionTestHTML(fileContents);
        else if (this.#suite.type === "Code") this.#loadCodeTestHTML(fileContents);
        else throw Error("Unknown suite type");
      })
      .catch((e) => {
        this.#currentContent = `<div class="error screen">${e.message}</div>`;
      })
      .finally(() => {
        this.#render();
        if (this.#suite.type === "Action") this.dispatchEvent(new CustomEvent("actionTestLoaded"));
        if (this.#suite.type === "Code") this.dispatchEvent(new CustomEvent("codeTestLoaded"));
      });
  }

  /**
   * Display the results from the current test.
   * @param {import("../evaluators/KeyboardEvaluator.js").TestRecording[]} recordings
   */
  displayResults(recordings) {
    if (recordings.length === 0) {
      this.#currentContent = `<div class="screen">No test recordings</div>`;
      this.#render();
      return;
    }

    this.#loading();

    if (!this.#resultsTemplate) {
      fetch("../../templates/results-sheet.html")
        .then((res) => res.text())
        .then((template) => {
          this.#resultsTemplate = template;
          this.displayResults(recordings);
        });
      return;
    }

    this.#currentContent = this.#resultsTemplate;
    this.#render();

    // Add the test titles and details
    this.#loadResultsTitles(recordings);
    this.#loadResultsGraphs(recordings);

    // Remove the loading component
    const loadingElement = this.#contentDisplayPane.querySelector("#loading");
    loadingElement.parentNode.removeChild(loadingElement);

    console.log(results);
  }
}
