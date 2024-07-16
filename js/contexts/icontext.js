export class IContext extends EventTarget {
  constructor() {
    super();
  }

  /**@param {KeyboardEvent} ev */
  keydown(ev) {
    throw Error("Unimplemented keydown function");
  }
}
