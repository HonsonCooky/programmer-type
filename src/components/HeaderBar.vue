<script lang="ts" setup>
import { ref } from "vue";

const langDropDownActive = ref(false);

const languageSelectToggle = () =>
  (langDropDownActive.value = !langDropDownActive.value);

window.addEventListener("keydown", (event) => {
  if (event.key === "l") languageSelectToggle();
});
</script>

<template>
  <header>
    <hgroup>
      <h2>&lt; Programmer See /&gt;</h2>
      <h1>&lt; Programmer Type /&gt;</h1>
    </hgroup>
    <div id="banner">
      <div id="language-select">
        <label>[L]anguage</label>
        <button @click="languageSelectToggle">
          {}
          <v-icon name="bi-chevron-down" />
        </button>
        <div class="dropdown" :class="{ active: langDropDownActive }">
          <button>
            <v-icon name="si-typescript" />
            TypeScript
          </button>
          <button>C#</button>
          <button>PowerShell</button>
          <button>Windows OS Naviagtion</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  padding: var(--s-m);

  hgroup {
    flex: 4;
    display: flex;
    flex-direction: column;
    text-align: center;

    h1 {
      font-size: var(--fs-5);
      font-weight: bold;
      margin: 0;
    }

    h2 {
      font-size: var(--fs-2);
      font-weight: bold;
      margin: 0;
    }
  }

  #banner {
    flex: 1;
    display: flex;
    flex-direction: row;
    text-align: center;

    #language-select {
      display: flex;
      flex-direction: row;
      row-gap: var(--s-3xs);
    }
  }
}
</style>
