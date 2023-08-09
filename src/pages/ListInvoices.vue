<template>
  <q-page padding>
    <div class="text-h6 shadow-10 rounded-borders text-center q-pa-md q-ma-xl">
      {{ $t("listInvoices") }}
    </div>
    <q-virtual-scroll
      class="the-list q-ml-lg q-pa-lg"
      :items="invoices"
      separator
      v-slot="{ item, index }"
    >
      <q-item :key="index">
        <q-item-section side>
          <q-item-label overline>{{ item.customer?.name }}</q-item-label>
          <q-item-label>{{ new Date(item.date).toDateString() }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="4">
            {{ item.items.map((m) => m.supply.label).join(" - ") }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          {{ item.total.toLocaleString() }}€
        </q-item-section>
      </q-item>
    </q-virtual-scroll>
  </q-page>
</template>

<script setup>
import { useInvoiceStore } from "src/stores/invoice";
const { invoices } = useInvoiceStore();
</script>
<style lang="sass" scoped>
.the-list
  max-height: calc( 80vh - 150px )
</style>
