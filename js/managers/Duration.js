export class Duration extends EventTarget {
  // Elements
  #dropdown = document.getElementById("_d_duration");
  #options = this.#dropdown.querySelector(".dropdown-content");
  #displayValue = this.#dropdown.querySelector(".current-value");

  constructor() {
    super();

    const durations = Array.from(this.#options.children);

    durations.forEach((child) => {
      if (child.tagName != "BUTTON") return;
      child.addEventListener("click", () => this.#selectDuration(child));
    });

    const middleIndex = Math.max(Math.floor(durations.length / 2), 0);
    this.#selectDuration(durations[middleIndex]);

    // Ensure post construction event listeners can trigger
    this.init = () => this.#selectDuration(durations[middleIndex]);
  }

  /**
   * Get the selected number of seconds for this test. Infinite time tests will
   * return 0.
   * @returns {number}
   */
  #getDuration(durationLabel) {
    const seconds = Number.parseInt(durationLabel);
    if (isNaN(seconds)) return 0;
    return seconds;
  }

  /**
   * Render the NavBar elements to replicate the selected duration.
   */
  #selectDuration(child) {
    const durationLabel = child.innerText.replace(/\[.*\]/, "").trim();
    this.#displayValue.innerText = durationLabel;
    Array.from(this.#options.children).forEach((child) => {
      if (child.tagName != "BUTTON") return;
      if (child.innerText.includes(durationLabel)) child.classList.add("selected");
      else child.classList.remove("selected");
    });
    this.dispatchEvent(new CustomEvent("updated", { detail: { duration: this.#getDuration(durationLabel) } }));
  }
}
