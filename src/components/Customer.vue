<template>
  <q-select
    filled
    v-model="model"
    :options="customers"
    stack-label
    :label="$t('customer')"
    :display-value="`${model ? model.name : '*none*'}`"
  >
    <template v-slot:append>
      <q-icon
        class="cursor-pointer"
        name="la-plus-circle"
        @click.stop.prevent="newCustomer = true"
      />
    </template>
  </q-select>
</template>

<script setup>
import { ref } from "vue";
import { useInvoiceStore } from "src/stores/invoice";
const newCustomer = ref(false);
const props = defineProps({ modelValue: Object });
const model = ref(props.modelValue);
const { customers } = useInvoiceStore();
</script>
