<template>
  <q-page padding>
    <q-banner
      ><div class="text-h5 text-center">
        {{ $t("serviceManagement") }}
      </div></q-banner
    >
    <div style="max-height: 70vh">
      <supply-tree editable />
    </div>
  </q-page>
</template>

<script setup>
import SupplyTree from "src/components/SupplyTree.vue";
</script>
