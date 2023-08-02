<template>
  <q-page padding>
    <q-banner>{{ $t("serviceManagement") }}</q-banner>
    <div class="row">
      <services-tree editable class="full-width" />
    </div>
  </q-page>
</template>

<script setup>
import ServicesTree from "src/components/ServicesTree.vue";
</script>
