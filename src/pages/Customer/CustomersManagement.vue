<template>
  <q-page padding>
    <div class="text-h6 bg-grey text-white rounded-borders q-pa-md">{{ $t('customers') }}</div>
    <list-view ref="listRef" :columns="columns" row-key="Id" api-url-get="api/v1/customers/list" filter-on-field='"Name"'
      api-url-count="api/v1/customers/count">
      <template #top-left>
        <common-tasks :crud-urls="crudUrls" :key-value="$refs.listRef?.selectedKey || 0" :entity-name="$t('customer')" />
      </template>
      <template #body-cell="p">
        <q-td>
          {{ p.value }}
        </q-td>
      </template>
    </list-view>
    <q-separator />
    <router-view />
  </q-page>
</template>

<script setup>
import { ref, onUpdated } from 'vue'
import ListView from "../ListView.vue";
import CommonTasks from "src/components/CommonTasks.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const listRef = ref(null)
const crudUrls = [
  '/customers/new',
  '/customers/view',
  '/customers/edit',
  '/customers/undelete',
  '/customers/delete']

const columns = [
  {
    name: "Name",
    field: "Name",
    label: t('customer name'),
    align: "left",
    sortable: true,
  },
  {
    name: "Title",
    field: "Title",
    label: t('customer title'),
    align: "left",
    sortable: true,
  },
  {
    name: "Email",
    field: "Email",
    label: t('email'),
    align: "left",
    sortable: true,
  }, {
    name: "Phone",
    field: "Phone",
    label: t('phone'),
    align: "left",
    sortable: true,
  }, {
    name: "Enabled",
    field: "Enabled",
    label: t('enabled'),
    align: "left",
    sortable: true,
  },
]
onUpdated(() => listRef.value?.tableRef?.requestServerInteraction())
</script>
