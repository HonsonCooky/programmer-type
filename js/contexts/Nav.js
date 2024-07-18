import { Duration } from "../managers/Duration.js";
import { Suite } from "../managers/Suite.js";
import { Theme } from "../managers/Theme.js";
import { PTShared } from "../script.js";
import { IContext } from "./IContext.js";

export class NavContext extends IContext {
  /**@type {Duration}*/
  #duration;
  /**@type {Suite}*/
  #suite;

  constructor() {
    super();

    new Theme(); // Decoupled

    this.#duration = new Duration();
    this.#suite = new Suite();

    this.#duration.addEventListener(
      "update",
      /** @param {CustomEvent<import("../managers/Duration.js").DurationEvent>} ev */
      (ev) => PTShared.setDuration(ev.detail.seconds),
    );

    this.#suite.addEventListener(
      "update",
      /** @param {CustomEvent<import("../managers/Suite.js").SuiteEvent>} ev */
      (ev) => PTShared.setSuite(ev.detail.suiteName),
    );
  }

  activate() {
    // Re-set the duration and suite
    PTShared.setDuration(this.#duration.getSeconds());
    PTShared.setSuite(this.#suite.getSuiteName());
  }

  deactivate() {}

  /** @param {KeyboardEvent} ev */
  keydown(ev) {}
}
