<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Unitec </q-toolbar-title>

        <div>Vorabrechnung v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> UserName </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const linksList = [
      {
        title: "signup",
        caption: "signup",
        icon: "las la-user-plus",
        link: "/register",
      },
      {
        title: "serviceManagement",
        caption: "serviceManagementCaption",
        icon: "account_tree",
        link: "/services",
      },
      {
        title: "manageAccounts",
        caption: "manageAccountsCaption",
        icon: "mannage_account",
        link: "/accounts",
      },
      {
        title: "invoiceIssuance",
        caption: "invoiceIssuanceCaption",
        icon: "post_add",
        link: "/invoice",
      },
      {
        title: "listInvoices",
        caption: "listInvoicesCaption",
        icon: "toc",
        link: "/list-invoices",
      },
      {
        title: "settings",
        caption: "settings",
        icon: "settings",
        link: "/settings",
      },
    ];

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
