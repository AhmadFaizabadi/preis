import { defineStore } from "pinia";
import { getAction } from "src/api/manage";

export const useProductStore = defineStore("product", {
  state: () => ({
    cache: [],
    sortedBy: "Name",
  }),

  getters: {
    listProducts: (state) => state.cache,
  },

  actions: {
    async getListProducts() {
      if (this.cache.length > 0) return;
      const res = await getAction("api/v1/product/list/active");
      if (res) this.cache = res;
    },
    sort: (sortby) => {
      if (this.cache.length == 0) return;
      const sortAsNumber = typeof this.cache[0][sortby] === "number";
      if (sortAsNumber) this.cache.sort((a, b) => a - b);
      else this.cache.sort((a, b) => a.localeCompare(b));
      this.sortedBy = sortby;
    },
  },
});
