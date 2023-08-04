<template>
  <q-card class="my-card bg-grey-12 q-pa-md">
    <q-card-section>
      <div class="text-h6">{{ isNew ? $t("newPrice") : $t("editPrice") }}</div>
    </q-card-section>
    <q-card-section>
      <div class="q-pa-md q-ma-md">
        <q-input
          color="purple-12"
          v-model="priceModel.label"
          :label="$t('priceName')"
          autofocus
        >
          <template v-slot:prepend>
            <q-icon name="las la-hand-point-right" />
          </template>
        </q-input>
        <q-input
          color="purple-12"
          v-model="priceModel.unitName"
          :label="$t('unitName')"
        >
          <template v-slot:prepend>
            <q-icon name="las la-ruler-vertical" />
          </template>
        </q-input>
        <q-input
          color="purple-12"
          v-model="priceModel.unitValue"
          :label="$t('unitValue')"
        >
          <template v-slot:prepend>
            <q-icon name="las la-euro-sign" />
          </template>
        </q-input>
      </div>
    </q-card-section>
    <q-card-actions class="justify-end">
      <q-btn
        v-close-popup
        @click="$emit('on-save', priceModel)"
        :label="$t('save')"
      />
      <q-btn :label="$t('cancel')" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  price: {
    type: Object,
    required: false,
  },
  isNew: {
    type: Boolean,
    required: false,
  },
});
const priceModel = ref(
  props.price || { label: "", unitName: "", unitValue: 0 }
);
defineEmits(["on-save"]);
</script>

<style lang="sass" scoped>
.my-card
  max-width: 550px
</style>
