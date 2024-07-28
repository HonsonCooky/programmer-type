import { KeyboardEvaluator } from "./evaluators/KeyboardEvaluator.js";
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

  // State evaluations
  #keyEvaluator = new KeyboardEvaluator();

  constructor() {
    // Evaluator - Reload Test
    this.#keyEvaluator.addEventListener("reload", () => this.#content.displayTest());
    // Evaluator - Start Test
    this.#keyEvaluator.addEventListener("start", () => this.#timer.run());
    // Evaluator - Pause Test
    this.#keyEvaluator.addEventListener("pause", () => this.#timer.pause());
    // Evaluator - Quit Test
    this.#keyEvaluator.addEventListener("quit", () => this.#timer.stop());

    // NavBar - Duration Update -> Set Timer
    this.#duration.addEventListener("updated", (ev) => {
      const { duration } = ev.detail ?? {};
      if (duration === undefined) throw Error(`Missing duration update event information`);
      this.#timer.prime(ev.detail.duration); // This will interrupt a running timer.
    });

    // NavBar - Suite Update -> Set Test Content
    this.#suite.addEventListener("updated", (ev) => {
      this.#timer.interrupt();
      const { name, type, shortcut } = ev.detail ?? {};
      if (!name || !type || !shortcut) throw Error(`Missing suite update event information`);
      this.#content.displayTest({ name, type });
    });

    // Test state - New Test Loaded
    this.#content.addEventListener("actionTestLoaded", () => this.#keyEvaluator.loadActionTokens());
    this.#content.addEventListener("codeTestLoaded", () => this.#keyEvaluator.loadCodeTokens());

    // Test state - Test ticked = Record current results
    this.#timer.addEventListener("tick", (ev) => this.#keyEvaluator.record(ev.detail));

    // Test state - Test stopped = Reset all with evaluation.
    this.#timer.addEventListener("stopped", () => {
      const recordings = this.#keyEvaluator.getRecordings();
      this.#keyEvaluator.reset();
      this.#content.displayResults(recordings);
    });

    // Test state - Test interruptions = Reset all without evaluation.
    this.#content.addEventListener("interrupt", () => this.#timer.interrupt());
    this.#timer.addEventListener("interrupted", () => {
      // Note: Timer resets itself, just need to reload the test, and reset the test state.
      this.#content.displayTest();
      this.#keyEvaluator.reset();
    });

    // Keyboard input evaluation
    window.addEventListener("keydown", (ev) => this.#keyEvaluator.keydown(ev));
    window.addEventListener("mousedown", () => this.#keyEvaluator.reset(true));

    // Do these to trigger the event listeners after construction to setup
    this.#duration.init();
    this.#suite.init();
  }
}

new Theme(); // Self sufficient object - Attempt no flashbang
export const PTProgram = new Program();
