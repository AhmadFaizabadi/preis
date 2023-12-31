<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="print-hide">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Unitec </q-toolbar-title>

        <div>Vorabrechnung v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer class="print-hide" v-model="leftDrawerOpen" show-if-above bordered :breakpoint="2000">
      <q-list>
        <q-item-label header> UserName </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const leftDrawerOpen = ref(false);
const linksList = [
  {
    title: "signup",
    caption: "signup",
    icon: "las la-user-plus",
    link: "/register",
  },
  {
    title: "productManagement",
    caption: "productManagementCaption",
    icon: "mdi-package-variant",
    link: "/products",
  },
  {
    title: "customers management",
    caption: "customerManagementCaption",
    icon: "mdi-card-account-details-outline",
    link: "/customers",
  },
  {
    title: "serviceManagement",
    caption: "serviceManagementCaption",
    icon: "account_tree",
    link: "/services",
  },
  {
    title: "invoiceManagement",
    caption: "invoiceManagementCaption",
    icon: "account_tree",
    link: "/invoices",
  },
  {
    title: "manageAccounts",
    caption: "manageAccountsCaption",
    icon: "mannage_account",
    link: "/users",
  },
  {
    title: "invoiceIssuance",
    caption: "invoiceIssuanceCaption",
    icon: "post_add",
    link: "/invoices/new",
  },
  {
    title: "settings",
    caption: "settings",
    icon: "settings",
    link: "/settings",
  },
];

const toggleLeftDrawer = () =>
  leftDrawerOpen.value = !leftDrawerOpen.value;
</script>
