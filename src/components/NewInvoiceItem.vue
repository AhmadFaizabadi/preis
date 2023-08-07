<template>
  <q-card class="my-card bg-amber-11 text-black q-pa-md">
    <q-card-section>
      <q-select
        filled
        v-model="model"
        :options="flatSupplies"
        stack-label
        :label="$t('supplyName')"
        :display-value="model?.fullName?.split('-')[1] + ' - ' + model.label"
      >
        <template v-slot:after>
          <q-icon class="cursor-pointer" name="search">
            <q-popup-proxy>
              <supplies-tree @on-select="onSelect" />
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
import { ref } from "vue";
import SuppliesTree from "src/components/SupplyTree.vue";
import { useInvoiceStore } from "src/stores/invoice";

const { flatSupplies } = useInvoiceStore();

const props = defineProps({ modelValue: Object, isNew: Boolean });
defineEmits(["update:model-value"]);
const model = ref(props.modelValue ? { ...props.modelValue } : {});
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
</style>
