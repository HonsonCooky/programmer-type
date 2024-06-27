<template>
  <header @keyup.enter="toggleLanguageDropDown">
    <hgroup>
      <h2>Programmer See</h2>
      <h1>Programmer Type</h1>
    </hgroup>
  </header>
</template>

<script lang="ts">
export default {
  name: "HeaderBar",
  methods: {
    toggleLanguageDropDown(event: Event) {
      console.log("lol", event);
    },
  },
};
</script>

<style scoped>
@import url("../App.css");
</style>
