import { boot } from "quasar/wrappers";
import { LoadingBar, Loading, QSpinnerGears } from "quasar";
import { useUserStore } from "src/stores/user";

LoadingBar.setDefaults({
  color: "red",
  size: "4px",
  position: "top",
});

function startLoading() {
  Loading.show({
    spinner: QSpinnerGears,
    message: "System Loading",
  });
  LoadingBar.start();
}

function stopLoading() {
  Loading.hide();
  LoadingBar.stop();
}

export default boot(({ router }) => {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    startLoading();
    const user = userStore.GetUser();
    if (user) {
      // userStore.StartPing();
      next();
      stopLoading();
    } else if (to.name !== "login") {
      stopLoading();
      userStore.HandleLogout();
      console.log("is going to login ...");
      next({ path: "/login", replace: true });
    } else next();
  });
  router.afterEach(() => {
    stopLoading();
  });
});
