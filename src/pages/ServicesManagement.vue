<template>
  <q-page padding>
    <q-banner>{{ $t("serviceManagement") }}</q-banner>
    <div class="row">
      <supply-tree editable class="full-width" />
    </div>
  </q-page>
</template>

<script setup>
import SupplyTree from "src/components/SupplyTree.vue";
</script>
