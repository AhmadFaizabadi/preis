<template>
  <div>
    <q-dialog v-model="showNewCustomer">
      <snap-new-customer
        v-model="model"
        :is-new="isNew"
        @done="onCustomerAdded"
      />
    </q-dialog>
    <q-select
      transition-show="flip-up"
      transition-hide="flip-down"
      filled
      use-input
      option-value="Name"
      v-model="model"
      :options="options"
      stack-label
      :label="$t('customer') + (required ? ' *' : '')"
      :display-value="
        'Name' in model ? `${model?.Name} (${model?.StreetAndNumber})` : ''
      "
      @new-value="newCustomer($event)"
      @filter="filterFn"
      ><template v-slot:before>
        <q-icon name="person_add" class="cursor-pointer" @click="newCustomer"
          ><q-tooltip>{{ $t("newCustomer") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="model?.Name"
          name="edit"
          class="cursor-pointer"
          @click="editCustomer"
          ><q-tooltip>{{ $t("editCustomer") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="model?.Name"
          name="delete"
          class="cursor-pointer"
          @click="onDeleteCustomer"
          ><q-tooltip>{{ $t("deleteCustomer") }}</q-tooltip></q-icon
        >
      </template>
      <template v-slot:option="{ itemProps, opt }">
        <q-item v-bind="itemProps">
          <q-item-section>
            <q-item-label>{{ opt.Name }}</q-item-label>
            <q-item-label caption>{{ opt.Email }}</q-item-label>
          </q-item-section>
          <q-item-section side
            >{{ opt.SelectedAddress?.Address }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { getAction } from "src/api/manage";
import SnapNewCustomer from "src/components/SnapNewCustomer.vue";

const showNewCustomer = ref(false);
const $q = useQuasar();
const props = defineProps({ modelValue: Object, required: Boolean });
const emit = defineEmits(["update:model-value"]);
const model = computed({
  get: () => props.modelValue || {},
  set: (v) => emit("update:model-value", v),
});
const isNew = ref(true);
const loading = ref(false);
let customers = [];
const options = ref([]);
const { t } = useI18n();

const newCustomer = (e) => {
  isNew.value = true;
  showNewCustomer.value = true;
};
const editCustomer = () => {
  isNew.value = false;
  showNewCustomer.value = true;
};
const onDeleteCustomer = () => {
  const msg = t("sureToDelete") + " " + model.value.Name;
  $q.dialog({
    title: t("deleteConfirm"),
    message: msg,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const foundIndex = customers.findIndex((f) => f.Name === model.value.Name);
    if (foundIndex != -1) {
      customers.splice(foundIndex, 1);
      // saveData("customer");
      model.value = ref(null);
      emit("update:model-value", null);
    }
  });
};
onBeforeMount(async () => {
  loading.value = true;
  try {
    customers = await getAction("api/v1/customers/list/active");
  } finally {
    loading.value = false;
  }
});
onMounted(() => (options.value = customers));
const filterFn = (val, update) => {
  update(() => {
    const needle = val?.trim().toLocaleLowerCase().split(" ");
    options.value = customers.filter((f) =>
      needle.every((e) => f.Name.toLocaleLowerCase().indexOf(e) > -1)
    );
  });
};
const onCustomerAdded = (c) => {
  if (isNew.value) customers.push(c);
  showNewCustomer.value = false;
};
</script>
