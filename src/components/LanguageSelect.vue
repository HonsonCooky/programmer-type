<template>
  <div id="LanguageSelect">
    <label>Language Select</label>
    <button>*none*</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ name: "LanguageSelect" });
</script>

<style scoped>
@import url("../App.css");

#LanguageSelect {
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: end;
  row-gap: var(--s-3xs);

  button {
    width: 100%;
  }
}
</style>
