<template>
  <q-card class="my-card bg-amber-11 text-black q-pa-md">
    <q-card-section>
      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        :label="$t('serviceName')"
        :display-value="`${
          model ? model.category + ' - ' + model.priceName : '*none*'
        }`"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="la-search">
            <q-popup-proxy v-model="showTree">
              <services-tree @on-select="onSelect" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-select>
    </q-card-section>
    <q-card-actions class="justify-end">
      <q-btn
        v-close-popup
        @click="$emit('update:model-value', model)"
        :label="$t('save')"
      />
      <q-btn :label="$t('cancel')" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import ServicesTree from "src/components/SupplyTree.vue";
const props = withDefaults(defineProps({ modelValue: Object }), {
  modelValue: {
    service: null,
    count: 0,
  },
});

const onSelect = (e) => {
  model.service = e.service;
  model.price = e.price;
};
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
</style>
