import { KeyEvaluator } from "./evaluators/KeyEvaluator.js";
import { Content } from "./managers/Content.js";
import { Duration } from "./managers/Duration.js";
import { Suite } from "./managers/Suite.js";
import { Theme } from "./managers/Theme.js";
import { Timer } from "./managers/Timer.js";

export class Program {
  // Time managers
  #duration = new Duration();
  #timer = new Timer();

  // Test managers
  #suite = new Suite();
  #content = new Content();

  // Non-Mouse Evaluations
  #keyEvaluator = new KeyEvaluator();

  constructor() {
    // NavBar - Duration Update -> Set Timer
    this.#duration.addEventListener("updated", (ev) => {
      const { duration } = ev.detail ?? {};
      if (duration === undefined) throw Error(`Missing duration update event information`);
      this.#timer.prime(ev.detail.duration); // This will interrupt a running timer.
    });

    // NavBar - Suite Update -> Set Test Content
    this.#suite.addEventListener("updated", (ev) => {
      const { name, type, shortcut } = ev.detail ?? {};
      if (!name || !type || !shortcut) throw Error(`Missing suite update event information`);
      this.#content.displayTest();
    });

    // Test state - Test interruptions = Reset all without evaluation.
    this.#content.addEventListener("interrupt", () => this.#timer.interrupt());
    this.#timer.addEventListener("interrupted", () => {
      // Note: Timer resets itself, just need to reload the test, and reset the test state.
      this.#content.displayTest();
      this.#keyEvaluator.reset();
    });

    // Keyboard input evaluation
    window.addEventListener("keydown", this.#keyEvaluator.keydown);

    // Do these to trigger the event listeners after construction to setup
    this.#duration.init();
    this.#suite.init();
  }
}

new Theme(); // Self sufficient object - Attempt no flashbang
export const PTProgram = new Program();
