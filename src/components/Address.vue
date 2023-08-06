<template>
  <div>
    <q-dialog v-model="showNewAddress">
      <new-address
        style="width: 300px"
        :model-value="selected"
        @update:model-value="onAddressUpdated"
        :is-new="isNew"
      />
    </q-dialog>
    <q-select
      transition-show="flip-up"
      transition-hide="flip-down"
      filled
      emit-value
      :model-value="selected"
      option-value="name"
      :option-label="(o) => `${o?.name}: ${o?.address}`"
      :options="addresses"
      stack-label
      :label="$t('address')"
      :display-value="selected"
      @new-value="onNewAddress($event)"
      @update:model-value="$emit('update:selected', $event)"
      ><template v-slot:prepend>
        <q-icon name="add_business" class="cursor-pointer" @click="onNewAddress"
          ><q-tooltip>{{ $t("newAddress") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="selected?.name"
          name="edit"
          class="cursor-pointer"
          @click="onEditAddress"
          ><q-tooltip>{{ $t("editAddress") }}</q-tooltip></q-icon
        >
        <q-icon
          v-if="selected?.name"
          name="delete"
          class="cursor-pointer"
          @click="onDeleteAddress"
          ><q-tooltip>{{ $t("deleteAddress") }}</q-tooltip></q-icon
        >
      </template>
    </q-select>
    <!-- <q-list>
      <q-item-label>{{ $t("address") }}</q-item-label>
      <template v-for="adr in model.items" :key="adr.name">
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>{{ adr.name }}</q-item-label>
            <q-item-label>{{ adr.address }}</q-item-label>
            <q-item-label caption>{{ adr.postalCode }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </template>
      <q-item clickable v-ripple @click="onNewAddress">
        <q-item-section>
          {{ $t("newAddress") }}
        </q-item-section>
        <q-item-section side>
          <q-icon name="las la-plus-circle" color="green" />
        </q-item-section>
      </q-item>
    </q-list> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import NewAddress from "src/components/NewAddress.vue";
const props = defineProps({
  addresses: Array,
  selected: String,
});
const emit = defineEmits(["update:addresses", "update:selected"]);
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
  console.log("delete address", model.value);
};
const onAddressUpdated = (a) => {
  const newarray = props.addresses ? [...props.addresses] : [];
  if (isNew.value) newarray.push({ ...a });
  else {
    let found = newarray.find((f) => f.name === a.name);
    if (found) {
      for (let o of Object.entries(a)) found[o[0]] = o[1];
    }
  }
  emit("update:addresses", newarray);
};
</script>
