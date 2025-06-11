import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", () => {
  const searchText = ref("");

  const setSearchText = (text) => {
    searchText.value = text;
  };

  const clearSearchText = () => {
    searchText.value = "";
  };

  return { searchText, setSearchText, clearSearchText };
});
