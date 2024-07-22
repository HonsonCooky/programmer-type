import { IElementManager } from "./IElementManager.js";

export class ResultsLoader extends IElementManager {
  #lastResults;

  loadResults() { }

  getResultsHTML() {
    return "";
  }
}
