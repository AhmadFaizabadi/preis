<template>
  <q-card class="my-card bg-grey-3 text-black q-pa-md">
    <q-card-section class="q-gutter-md">
      <q-select
        autofocus=""
        outlined=""
        v-model="model.supply"
        :options="flatSupplies"
        stack-label
        :label="$t('supplyName')"
        :display-value="
          'label' in (model.supply || {})
            ? model.supply?.fullName?.split('-')[1] +
              ' - ' +
              model.supply?.label
            : ''
        "
      >
        <template v-slot:after>
          <q-icon
            class="cursor-pointer"
            name="search"
            @click="showSupplyTree = true"
          />
        </template>
        <template v-slot:option="{ itemProps, opt }">
          <q-item v-bind="itemProps">
            <q-item-section>
              <q-item-label>{{ opt.label }}</q-item-label>
              <q-item-label overline>{{
                opt.fullName.split("-").slice(1, -1).join("-")
              }}</q-item-label>
            </q-item-section>
            <q-item-section avatar=""
              ><q-icon :name="opt.icon" color="deep-orange-12" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        outlined=""
        :label="$t('entity')"
        v-model="model.entity"
        type="number"
      />
      <q-input
        outlined=""
        :label="$t('note')"
        v-model="model.note"
        type="textarea"
      />
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
  <q-dialog position="right" v-model="showSupplyTree">
    <supplies-tree v-model="model.supply" :editable="false" />
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import SuppliesTree from "src/components/SupplyTree.vue";
import { useInvoiceStore } from "src/stores/invoice";

const { flatSupplies, uuidv4 } = useInvoiceStore();

const props = defineProps({ modelValue: Object, isNew: Boolean });
defineEmits(["update:model-value"]);
const model = ref(props.modelValue ? { ...props.modelValue } : {});
const showSupplyTree = ref(false);
if (props.isNew) model.value.id = uuidv4().split("-").at(-1);
</script>

<style lang="sass" scoped>
.my-card
  width: 350px
</style>
