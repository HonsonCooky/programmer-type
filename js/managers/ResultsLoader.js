import { IElementManager } from "./IElementManager.js";

export class ResultsLoader extends IElementManager {
  /**@type {{correct: number; incorrect: number; index: number; time: number;}[]}*/
  #lastResults = [];

  /**
   * @param {{correct: number; incorrect: number; index: number; time: number;}[]} testResults
   */
  loadResults(testResults) {
    this.#lastResults = testResults;
    console.log(testResults);
  }

  getResultsHTML() {
    return "";
  }

  render() {
    this.dispatchEvent(new Event("update"));
  }
}
