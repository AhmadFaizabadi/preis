import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify, Dialog } from "quasar";
import { useUserStore } from "src/stores/user";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  baseURL: process.env.API,
  timeout: 60000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

export default boot(({ app, router }) => {
  const userStore = useUserStore();

  api.interceptors.request.use(
    (request) => {
      const user = userStore.GetUser();
      request.headers = {
        Authorization: `bearer ${user?.AccessToken}`,
      };
      return request;
    },
    (error) => {
      Notify.create({
        type: "negative",
        message: typeof error === "object" ? JSON.stringify(error) : error,
      });
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      // If the ExpiresAt of the JWT has expired,
      // but the RefreshAt has not expired,
      // the background will insert a Gqa Refresh Token in the headers,
      // which will be saved here to form a token replacement logic
      if (
        response.headers["www-authenticate"] &&
        response.headers["www-authenticate"].contains("invalid_token")
      ) {
        // userStore.SetToken(response.headers["gqa-refresh-token"]);
        // // store.dispatch('user/SetToken', response.headers['gqa-refresh-token'])
        // Notify.create({
        //   type: "positive",
        //   message: "Refresh Token Success",
        // });
        router.push("/login");
        // return api(response.config);
      }
      const { status } = response;
      if (status === 200) {
        return response.data;
      } else {
        switch (status) {
          case 0:
            if (responseData.data && responseData.data.reload) {
              Dialog.create({
                title: "Authentication Failed",
                message: response.data.message || "Please Relogin",
                persistent: true,
                ok: {
                  push: true,
                  color: "negative",
                  label: "Relogin",
                },
              }).onOk(() => {
                userStore.HandleLogout();
                router.push({ name: "login" });
              });
            } else {
              Notify.create({
                type: "negative",
                message: response.data.message || "Operation Failed",
              });
              return response.data;
            }
          default:
            return response.data;
        }
      }
    },
    (error) => {
      if (
        error.response.headers["www-authenticate"] &&
        error.response.headers["www-authenticate"].includes("invalid_token")
      ) {
        // userStore.SetToken(response.headers["gqa-refresh-token"]);
        // // store.dispatch('user/SetToken', response.headers['gqa-refresh-token'])
        // Notify.create({
        //   type: "positive",
        //   message: "Refresh Token Success",
        // });
        router.push("/login");
        return;
      }
      // 500
      if (error + "" === "Error: Request failed with status code 500") {
        Dialog.create({
          title: "Error",
          message: "Data Exception, Please Relogin",
          persistent: true,
          ok: {
            push: true,
            color: "negative",
            label: i18n.global.t("Logout"),
          },
        }).onOk(() => {
          userStore.HandleLogout();
          router.push({ name: "login" });
        });
      }
      // timeout
      if (error + "" === "Error: timeout of 40000ms exceeded") {
        Notify.create({
          type: "negative",
          message: "Operation Timeout",
        });
      }
      // network error
      if (error + "" === "Error: Network Error") {
        router.push({ name: "notFound" });
      } else if (error.response && error.response.status === 404) {
        Notify.create({
          type: "negative",
          message:
            "Request Address NotFound " + error.response.request.responseURL,
        });
      } else if (error.response && error.response.status === 400) {
        Notify.create({
          type: "negative",
          message: error.response.data.ErrorReason,
        });
      } else if (error.response && [401, 403].includes(error.response.status)) {
        Notify.create({
          type: "negative",
          message: "Access Denied!\n" + error.response.statusText,
        });
        // router.push("/login");
      }
      return Promise.reject(error);
    }
  );
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
