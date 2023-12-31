<template>
  <q-dialog position="right" v-model="showSupplyTree">
    <supplies-tree v-model="model" :editable="false" @update:model-value="showSupplyTree = false" />
  </q-dialog>
  <q-select autofocus outlined v-model="model" :options="flatSupplies" stack-label :label="$t('supplyName') + ' *'"
    :display-value="'label' in (model.supply || {})
      ? model.supply?.fullName?.split('-')[1] + ' - ' + model.supply?.label
      : ''
      " lazy-rules :rules="[(val) => !!val || $t('supplyRequired')]">
    <template v-slot:after>
      <q-icon class="cursor-pointer" name="search" @click="showSupplyTree = true" />
    </template>
    <template v-slot:option="{ itemProps, opt }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
          <q-item-label overline>{{
            opt.fullName.split("-").slice(1, -1).join("-")
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar><q-icon :name="opt.icon" color="deep-orange-12" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, computed } from "vue";
import SuppliesTree from "src/components/SupplyTree.vue";
import { useInvoiceStore } from "src/stores/invoice";

const props = defineProps({ modelValue: Object })
const emit = defineEmits(["update:model-value"])
const { flatSupplies } = useInvoiceStore();
const showSupplyTree = ref(false);
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:model-value", v)
})
</script>
