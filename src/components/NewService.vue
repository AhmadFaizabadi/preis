<template>
  <div class="q-pa-md q-gutter-y-md column">
    <div v-if="isNew" class="text-red">{{ $t('newService') }}</div>
    <q-input outlined v-model="title" :label="$t('serviceName')" stack-label />
    <q-input v-model="icon" label="Icon" clearable>
      <template #append>
        <q-icon name="extension" class="cursor-pointer">
          <q-popup-proxy v-model="showIconPicker" class="column justify-center items-center" style="height: 600px;">
            <div class="column items-center">
              <q-input v-model="filter" label="Filter" outlined clearable dense class="q-ma-md" />
              <q-icon-picker v-model="icon" v-model:model-pagination="pagination" :filter="filter"
                :icons="lineIcons.icons" tooltips style="height: 300px; width: 300px;" />
            </div>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <div class="full-width q-gutter-lg q-mt-lg">
      <q-btn v-close-popup label="save" @click="$emit('on-save', { label: title, icon: icon })" />
      <q-btn v-close-popup label="cancel" />
    </div>
  </div>
</template>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
<script setup>
import { QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import lineIcons from '@quasar/quasar-ui-qiconpicker/dist/icon-set/line-awesome.umd.js'
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: Object,
  isNew: Boolean
})
defineEmits(['update:modelValue', 'on-save'])
const title = ref(props.isNew ? '' : props.modelValue.label)
const icon = ref(props.isNew ? '' : props.modelValue.icon)
const filter = ref('')
const showIconPicker = ref(false)
const pagination = ref({
  itemsPerPage: 25,
  page: 0
})
watch(icon, () => showIconPicker.value = false)
</script>
