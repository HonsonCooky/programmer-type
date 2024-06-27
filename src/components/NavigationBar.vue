<template>
  <nav>
    <header>
      <h2>Programmer See</h2>
      <h1>Programmer Type</h1>
    </header>
    <LanguageSelect />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LanguageSelect from "./LanguageSelect.vue";

export default defineComponent({
  name: "NavigationBar",
  components: {
    LanguageSelect,
  },
});
</script>

<style scoped>
@import url("../App.css");

nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: var(--gold);
  padding: var(--s-3xs) var(--s-m);

  header {
    display: flex;
    flex-direction: column;

    * {
      color: var(--text);
      margin: 0;
    }
  }

  h1 {
    font-size: var(--fs-5);
    font-weight: bold;
  }

  h2 {
    font-size: var(--fs-2);
    line-height: 100%;
  }
}
</style>
