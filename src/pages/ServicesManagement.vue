<template>
  <q-page padding>
    <div class="full-screen column">
      <div class="col">
        <q-banner
          ><div class="text-h5 text-center">
            {{ $t("serviceManagement") }}
          </div></q-banner
        >
        <div class="col-auto">
          <supply-tree editable />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import SupplyTree from "src/components/SupplyTree.vue";
</script>
