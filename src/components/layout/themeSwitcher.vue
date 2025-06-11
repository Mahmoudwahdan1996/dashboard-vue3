<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    class="mr-2 custom-button"
    @click="toggleDark()"
  />
</template>

<script setup>
import { inject } from "vue";
import Button from "primevue/button";

const toggleDark = inject("toggleDark");
const isDark = inject("isDark");

// // On page load or when changing themes, best to add inline in `head` to avoid FOUC
// document.documentElement.classList.toggle(
//   "dark",
//   localStorage.theme === "dark" ||
//     (!("theme" in localStorage) &&
//       window.matchMedia("(prefers-color-scheme: dark)").matches)
// );
// // Whenever the user explicitly chooses light mode
// localStorage.theme = "light";
// // Whenever the user explicitly chooses dark mode
// localStorage.theme = "dark";
// // Whenever the user explicitly chooses to respect the OS preference
// localStorage.removeItem("theme");
</script>

<style scoped>
/* Additional Tailwind or custom styles can go here */
</style>
