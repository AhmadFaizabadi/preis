<template>
  <q-page padding>
    <div class="column q-pa-lg q-gutter-lg">
      <p>{{ model.Title }}</p>
      <div class="text-h6">{{ model.FirstName }} {{ model.LastName }}</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { getAction } from "src/api/manage";
import { useRoute } from "vue-router";

const model = ref({});
const $route = useRoute();
watch(
  () => $route.params.id,
  async (id) => {
    if (id) model.value = await getAction(`api/v1/customers/${id}`);
  },
  { immediate: true }
);
</script>
