<template>
  <div>
    <q-dialog v-model="showNewAddress">
      <new-address
        style="width: 300px"
        v-model="model"
        :is-new="isNew"
        @update:model-value="showNewAddress = false"
      />
    </q-dialog>
    <q-select
      transition-show="flip-up"
      transition-hide="flip-down"
      filled
      emit-value
      v-model="model"
      :option-label="(o) => `${o?.Name}: ${o?.AddressText}`"
      :options="addresses"
      stack-label
      :label="$t('address')"
      :display-value="model?.Name"
      @new-value="onNewAddress($event)"
      ><template v-slot:before>
        <q-icon name="add_business" class="cursor-pointer" @click="onNewAddress"
          ><q-tooltip>{{ $t("newAddress") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="model?.Id"
          name="edit"
          class="cursor-pointer"
          @click="onEditAddress"
          ><q-tooltip>{{ $t("editAddress") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="model?.Id"
          name="delete"
          class="cursor-pointer"
          @click="onDeleteAddress"
          ><q-tooltip>{{ $t("deleteAddress") }}</q-tooltip></q-icon
        >
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import NewAddress from "pages/Customer/AddressNew.vue";
const props = defineProps({
  addresses: Array,
  modelValue: Object,
});
const emit = defineEmits(["update:addresses", "update:model-value"]);
const model = computed({
  get: () => props.modelValue,
  set: (v) => {
    emit("update:model-value", v);
    const newarray = addresses.value ? [...addresses.value] : [];
    let found = newarray.find((f) => f.Id === v.Id);
    if (found) {
      for (let o of Object.entries(v)) found[o[0]] = o[1];
    } else newarray.push({ ...v });
    emit("update:addresses", newarray);
  },
});
const addresses = computed({
  get: () => props.addresses,
  set: (v) => emit("update:addresses-value", v),
});

const isNew = ref(true);
const showNewAddress = ref(false);

const onNewAddress = () => {
  isNew.value = true;
  showNewAddress.value = true;
};
const onEditAddress = () => {
  isNew.value = false;
  showNewAddress.value = true;
};
const onDeleteAddress = () => {
  const id = model.value.Id;
  let foundIndex = addresses.value.findIndex((f) => f.Id === id);
  if (foundIndex !== -1) {
    addresses.value.splice(foundIndex, 1);
    model.value = null;
  }
};
</script>
