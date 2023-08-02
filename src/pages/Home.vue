<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script>
export default {
  name: "HomePage",
};
</script>
<script setup>
import { onMounted } from "vue";
import { useInvoiceStore } from "src/stores/invoice";
onMounted(async () => {
  const { loadData, get } = useInvoiceStore();
  loadData("base");
  await get("base");
});
</script>
