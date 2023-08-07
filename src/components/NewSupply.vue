<template>
  <q-card class="q-pa-md q-gutter-y-md" style="width: 400px">
    <q-card-section v-if="isNew" class="text-red">{{
      $t("newSupply")
    }}</q-card-section>
    <q-card-section>
      <q-input
        outlined
        v-model="model.label"
        :label="$t('supplyName')"
        stack-label
        autofocus
      />
      <q-input v-model="model.icon" label="Icon" clearable>
        <template #append>
          <q-icon name="extension" class="cursor-pointer">
            <q-popup-proxy v-model="showIconPicker">
              <div
                class="items-center q-gutter-md bg-cyan"
                style="height: 400px"
              >
                <q-input
                  v-model="filter"
                  label="Filter"
                  outlined
                  clearable
                  dense
                  class="q-ma-md"
                />
                <q-icon-picker
                  v-model="model.icon"
                  v-model:model-pagination="pagination"
                  :filter="filter"
                  :icons="lineIcons.icons"
                  tooltips
                  style="height: 220px; width: 300px"
                />
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions>
      <div class="full-width q-gutter-md q-mt-lg">
        <q-btn
          v-close-popup
          label="save"
          @click="$emit('update:model-value', model)"
        />
        <q-btn v-close-popup label="cancel" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
<script setup>
import { QIconPicker } from "@quasar/quasar-ui-qiconpicker";
import lineIcons from "@quasar/quasar-ui-qiconpicker/dist/icon-set/line-awesome.umd.js";
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: Object,
  isNew: Boolean,
});
const emits = defineEmits(["update:model-value"]);
const model = ref(props.modelValue || { label: "", icon: "" });
const filter = ref("");
const showIconPicker = ref(false);
const pagination = ref({
  itemsPerPage: 25,
  page: 0,
});
watch(
  () => model.value.icon,
  (m) => {
    showIconPicker.value = false;
  }
);
</script>
