import { IContext } from "../IContext.js";

export class ActionEvaluator extends IContext {
  /**@override*/
  activate() {
    throw Error("Unimplemeneted 'activate' method");
  }

  /**@override*/
  deactivate() {
    throw Error("Unimplemeneted 'deactivate' method");
  }

  /**@override*/
  keydown(ev) {
    throw Error("Unimplemeneted 'keydown' method");
  }
}
