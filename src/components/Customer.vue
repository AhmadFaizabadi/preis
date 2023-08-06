<template>
  <div>
    <q-dialog v-model="showNewCustomer">
      <new-customer
        :model-value="model"
        :is-new="isNew"
        style="width: 300px"
        @update:model-value="onCustomerUpdated"
      />
    </q-dialog>
    <q-select
      transition-show="flip-up"
      transition-hide="flip-down"
      filled
      use-input
      option-value="name"
      v-model="model"
      :options="customers"
      stack-label
      :label="$t('customer')"
      :display-value="`${model.name} (${model.selectedAddress})`"
      @update:model-value="$emit('update:model-value', $event)"
      @new-value="onNewCustomer($event)"
      ><template v-slot:prepend>
        <q-icon name="person_add" class="cursor-pointer" @click="onNewCustomer"
          ><q-tooltip>{{ $t("newCustomer") }}</q-tooltip></q-icon
        >
      </template>
      <template v-slot:option="{ itemProps, opt }">
        <q-item v-bind="itemProps">
          <q-item-section>
            <q-item-label>{{ opt.name }}</q-item-label>
            <q-item-label caption>{{ opt.email }}</q-item-label>
          </q-item-section>
          <q-item-section side>{{ opt.selectedAddress }} </q-item-section>
        </q-item>
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
const emit = defineEmits(["update:model-value"]);
const model = ref({ ...props.modelValue });
const isNew = ref(true);
const { customers, saveData } = useInvoiceStore();
const onNewCustomer = (e) => {
  if (typeof e === "string") {
    const name = e
      .split(" ")
      .reduce((t, c) => (t += c.charAt(0).toUpperCase() + c.slice(1) + " "), "")
      .trim();
    model.value.name = name;
  } else model.value = {};
  isNew.value = true;
  showNewCustomer.value = true;
};

const onCustomerUpdated = (c) => {
  if (isNew.value) customers.push({ ...c });
  else {
    const found = customers.find((f) => f.name === c.name);
    if (found) {
      for (let o in Object.entries(c)) found[o[0]] = o[1];
    }
  }
  saveData("customer");
  emit("update:model-value", c);
  showNewCustomer.value = false;
};
</script>
