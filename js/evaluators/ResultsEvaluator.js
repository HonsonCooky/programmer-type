class ResultsEvaluator {
  /**
   * @param {HTMLDivElement} parent
   * @returns {HTMLCanvasElement}
   */
  #newGraphElement(parent) {
    const graph = document.createElement("canvas");
    const resizeGraph = function () {
      graph.height = Math.min(400, window.innerHeight * 0.4);
      graph.width = Math.max(600, parent.offsetWidth);
    };

    resizeGraph();
    window.addEventListener("resize", resizeGraph);
    return graph;
  }

  /** @param {HTMLCanvasElement} graph */
  #generateAxes(graph) {
    const ctx = graph.getContext("2d");
    ctx.fillText("Chars", 10, 10);
    ctx.fillText("Time", graph.width / 2, graph.height - 10);
  }

  /**
   * @param {HTMLDivElement} parent
   * @param {import("./KeyboardEvaluator").TestRecording[]} recordings
   * @returns {HTMLCanvasElement}
   */
  generateGraph(parent, recordings) {
    const canvas = this.#newGraphElement(parent);
    this.#generateAxes(canvas);
    return canvas;
  }
}

export const ResEval = new ResultsEvaluator();
