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
      :model-value="model"
      :options="customers"
      stack-label
      :label="$t('customer')"
      :display-value="
        'name' in model
          ? `${model?.name} (${model?.selectedAddress?.name})`
          : ''
      "
      @update:model-value="$emit('update:model-value', $event)"
      @new-value="onNewCustomer($event)"
      ><template v-slot:before>
        <q-icon name="person_add" class="cursor-pointer" @click="onNewCustomer"
          ><q-tooltip>{{ $t("newCustomer") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="model?.name"
          name="edit"
          class="cursor-pointer"
          @click="onEditCustomer"
          ><q-tooltip>{{ $t("editCustomer") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="model?.name"
          name="delete"
          class="cursor-pointer"
          @click="onDeleteCustomer"
          ><q-tooltip>{{ $t("deleteCustomer") }}</q-tooltip></q-icon
        >
      </template>
      <template v-slot:option="{ itemProps, opt }">
        <q-item v-bind="itemProps">
          <q-item-section>
            <q-item-label>{{ opt.name }}</q-item-label>
            <q-item-label caption>{{ opt.email }}</q-item-label>
          </q-item-section>
          <q-item-section side
            >{{ opt.selectedAddress.address }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useInvoiceStore } from "src/stores/invoice";
import { useQuasar } from "quasar";
import NewCustomer from "src/components/NewCustomer.vue";

const showNewCustomer = ref(false);
const $q = useQuasar();
const props = defineProps({ modelValue: Object });
const emit = defineEmits(["update:model-value"]);
const model = ref({ ...props.modelValue });
const isNew = ref(true);
const { customers, saveData } = useInvoiceStore();
const { t } = useI18n();

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
const onEditCustomer = () => {
  isNew.value = false;
  showNewCustomer.value = true;
};
const onDeleteCustomer = () => {
  const msg = t("sureToDelete") + " " + model.value.name;
  $q.dialog({
    title: t("deleteConfirm"),
    message: msg,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const foundIndex = customers.findIndex((f) => f.name === model.value.name);
    if (foundIndex != -1) {
      customers.splice(foundIndex, 1);
      saveData("customer");
      model.value = ref(null);
      emit("update:model-value", null);
    }
  });
};

const onCustomerUpdated = (c) => {
  const found = customers.find((f) => f.name === c.name);
  if (found) {
    for (let o in Object.entries(c)) found[o[0]] = o[1];
  } else customers.push({ ...c });

  saveData("customer");
  model.value = { ...c };
  emit("update:model-value", c);
  showNewCustomer.value = false;
};
</script>
