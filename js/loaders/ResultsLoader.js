import { IContentLoader } from "./IContentLoader.js";

export class ResultsLoader extends IContentLoader {
  /**@override*/
  load(obj) {
    console.log(obj);
  }
}
