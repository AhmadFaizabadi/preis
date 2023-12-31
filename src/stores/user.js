import { defineStore } from "pinia";
import { SessionStorage } from "quasar";
import { postAction, getAction } from "src/api/manage";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: undefined,
    whatsUpTimer: undefined,
    server: undefined,
  }),
  actions: {
    async HandleLogin(loginForm) {
      const res = await postAction("/api/v1/authentication/login", loginForm);
      this.SetUser(res);
      this.SetUser(res);
      return true;
    },
    SetUser(user) {
      this.user = user;
      SessionStorage.set("user", user);
      // }
    },
    GetUser() {
      this.user = SessionStorage.getItem("user");
      return this.user;
    },
    SetToken(token) {
      this.user.Token = token;
      SessionStorage.set("user", this.user);
    },
    HandleLogout() {
      SessionStorage.remove("user");
      this.StopPing();
      this.user = undefined;
    },
    StartPing() {
      if (this.IsUserManager && !this.whatsUpTimer)
        this.whatsUpTimer = setInterval(async () => {
          const res = await getAction("api/v1/invoice/whatsup");
          this.server = res;
        }, 3000);
    },
    StopPing() {
      if (this.whatsUpTimer) {
        clearInterval(this.whatsUpTimer);
        this.whatsUpTimer = undefined;
      }
    },
  },
  getters: {
    IsUserManager: (state) => ["Admin", "Manager"].includes(state.user?.Role),
  },
});

const flatten = (nodes, flatted) => {
  for (const a of nodes) {
    flatted.push(a);
    if ("Childs" in a && a.Childs.length > 0) flatten(a.Childs, flatted);
  }
  return flatted;
};
