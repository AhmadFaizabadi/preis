<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-input outlined v-model="title" :label="$t('serviceName')" stack-label />
      <q-input v-model="icon" label="Icon" clearable>
        <template #append>
          <q-icon name="extension" class="cursor-pointer">
            <q-popup-proxy v-model="showIconPicker" class="column justify-center items-center">
              <q-input v-model="filter" label="Filter" outlined clearable dense class="q-ma-md" />
              <q-icon-picker v-model="icon" v-model:model-pagination="pagination" :filter="filter"
                :icons="lineIcons.icons" tooltips style="height: 300px; width: 300px;" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<style src="@quasar/quasar-ui-qiconpicker/dist/index.css"></style>
<script setup>
import { QIconPicker } from '@quasar/quasar-ui-qiconpicker'
import lineIcons from '@quasar/quasar-ui-qiconpicker/dist/icon-set/line-awesome.umd.js'
import { ref, watch } from 'vue';
defineProps({
  node: {
    type: Object,
    required: true
  }
})
const title = ref('')
const icon = ref('')
const filter = ref('')
const showIconPicker = ref(false)
const pagination = ref({
  itemsPerPage: 25,
  page: 0
})
watch(icon, () => showIconPicker.value = false)
</script>
