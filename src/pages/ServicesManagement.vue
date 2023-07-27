<template>
  <q-page padding>
    api key is
    {{ apikey }}
    <q-banner>{{ $t("serviceManagement") }}</q-banner>
    <div class="row">
      <services-tree editable ref="serviceTreeRef" class="full-width" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import ServicesTree from "src/components/ServicesTree.vue";
const serviceTreeRef = ref(null);
const apikey = ref(import.meta.env.VITE_apikey);
</script>
