<template>
  <div>
    <q-dialog v-model="showNewCustomer" style="width: 300px">
      <new-customer v-model="model" />
    </q-dialog>
    <q-select
      transition-show="flip-up"
      transition-hide="flip-down"
      filled
      use-input
      v-model="model"
      :options="customers"
      stack-label
      :label="$t('customer')"
      :display-value="`${model ? model.name : ''}`"
      @new-value="onNewCustomer($event)"
      ><template v-slot:prepend>
        <q-icon name="person_add" class="cursor-pointer" @click="onNewCustomer"
          ><q-tooltip>{{ $t("newCustomer") }}</q-tooltip></q-icon
        >
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useInvoiceStore } from "src/stores/invoice";
import NewCustomer from "src/components/NewCustomer.vue";
const showNewCustomer = ref(false);
const props = defineProps({ modelValue: Object });
const model = ref(
  props.modelValue || { name: "", phone: "", email: "", address: [] }
);
const { customers } = useInvoiceStore();
const onNewCustomer = (e) => {
  if (typeof e === "string") {
    const name = e
      .split(" ")
      .reduce((t, c) => (t += c.charAt(0).toUpperCase() + c.slice(1) + " "), "")
      .trim();
    model.value.name = name;
  }
  showNewCustomer.value = true;
};
</script>
