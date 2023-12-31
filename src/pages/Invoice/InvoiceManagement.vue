<template>
  <q-page padding>
    <div class="print-hide text-h6 bg-grey text-white rounded-borders q-pa-md">{{ $t('invoices') }}</div>
    <list-view class="print-hide" ref="listRef" :columns="columns" row-key="Id" api-url-get="api/v1/invoices/list/active"
      filter-on-field='"Name"' api-url-count="api/v1/invoices/count">
      <template #top-left>
        <div class="row q-gutter-md">

          <common-tasks :crud-urls="crudUrls" :key-value="$refs.listRef?.selectedKey || 0" :entity-name="$t('invoice')" />
          <q-btn icon="mdi-file-pdf-box" :label="t('export to pdf')" :to="`/invoices/print/${$refs.listRef?.selectedKey}`"
            size="sm" />
        </div>
      </template>
      <template #body-cell="p">
        <q-td>
          {{ p.value }}
        </q-td>
      </template>
    </list-view>
    <q-separator class="print-hide" />
    <router-view />
  </q-page>
</template>

<script setup>
import { ref, onUpdated } from 'vue'
import ListView from "../ListView.vue";
import CommonTasks from "src/components/CommonTasks.vue";
import { useI18n } from 'vue-i18n';
import { germanDate } from 'src/api/utils';

const { t } = useI18n()
const listRef = ref(null)
const crudUrls = [
  '/invoices/new',
  '/invoices/view',
  '/invoices/edit',
  '/invoices/undelete',
  '/invoices/delete']

const columns = [
  {
    name: "Id",
    field: "Id",
    label: t('invoiceId'),
    align: "left",
    sortable: true,
  },
  {
    name: "Date",
    field: "Date",
    label: t('date'),
    format: f => germanDate(f),
    align: "left",
    sortable: true,
  },
  {
    name: "CustomerName",
    field: r => r.Customer?.Name,
    label: t('customer name'),
    align: "left",
    sortable: true,
  },
  {
    name: "ProjectName",
    field: "ProjectName",
    label: t('project name'),
    align: "left",
    sortable: true,
  },
  {
    name: "AgentName",
    field: "AgentName",
    label: t('agent name'),
    align: "left",
    sortable: true,
  },
  {
    name: "NetPrice",
    field: "NetPrice",
    label: t('net price'),
    format: f => f.toLocaleString() + '€',
    align: "left",
    sortable: true,
  },
  {
    name: "Enabled",
    field: "Enabled",
    label: t('enabled'),
    align: "left",
    sortable: true,
  },
]
onUpdated(() => listRef.value?.tableRef?.requestServerInteraction())
</script>
