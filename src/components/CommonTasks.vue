<template>
  <div class="row q-gutter-md">
    <q-btn v-for="b in buttons" :key="b.label" :label="b.label" :icon="b.icon" :to="b.url" size="sm">
      <q-tooltip>{{ b.tooltip }}</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from "vue-i18n";

const props = defineProps({
  crudUrls: Array,
  entityName: String,
  keyValue: Number
})
const { t } = useI18n();
const buttons = ref([
  {
    label: t('new'),
    tooltip: `${t('new')} ${props.entityName}`,
    icon: 'mdi-plus-circle-outline',
    url: props.crudUrls[0]
  },
  {
    label: t('view'),
    tooltip: `${t('view')} ${props.entityName}`,
    icon: 'mdi-card-search-outline',
    url: computed(() => `${props.crudUrls[1]}/${props.keyValue}`)
  },
  {
    label: t('edit'),
    tooltip: `${t('edit')} ${props.entityName}`,
    icon: 'mdi-circle-edit-outline',
    url: computed(() => `${props.crudUrls[2]}/${props.keyValue}`)
  },
  {
    label: t('enable'),
    tooltip: `${t('enable')} ${props.entityName}`,
    icon: 'mdi-camera-retake-outline',
    url: computed(() => `${props.crudUrls[3]}/${props.keyValue}`)
  },
  {
    label: t('disable'),
    tooltip: `${t('disable')} ${props.entityName}`,
    icon: 'mdi-delete-circle-outline',
    url: computed(() => `${props.crudUrls[4]}/${props.keyValue}`)
  },


])
</script>
