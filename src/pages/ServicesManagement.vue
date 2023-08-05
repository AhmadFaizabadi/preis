<template>
  <q-page padding>
    <q-banner
      ><div class="text-h5 text-center">
        {{ $t("serviceManagement") }}
      </div></q-banner
    >
    <div class="row">
      <supply-tree editable class="full-width" />
    </div>
  </q-page>
</template>

<script setup>
import SupplyTree from "src/components/SupplyTree.vue";
</script>
