<template>
  <q-page padding>
    <div class="text-h6 bg-grey text-white rounded-borders q-pa-md">{{ $t('packages') }}</div>
    <list-view ref="listRef" :columns="columns" row-key="Id" api-url-get="api/v1/package/list" filter-on-field='"Name"'
      api-url-count="api/v1/package/count">
      <template #top-left>
        <common-tasks :crud-urls="crudUrls" :key-value="$refs.listRef?.selectedKey || 0" :entity-name="$t('package')" />
      </template>
      <template #body-cell="p">
        <q-td v-if="p.col.name !== 'Thumbnail'">
          {{ p.value }}
        </q-td>
        <q-td v-else>
          <package-image :id="p.key" />
        </q-td>
      </template>
    </list-view>
    <q-separator />
    <router-view />
  </q-page>
</template>

<script setup>
import { ref, onUpdated } from 'vue';
import ListView from "../ListView.vue";
import CommonTasks from "src/components/CommonTasks.vue";
import { useI18n } from 'vue-i18n';
import PackageImage from 'src/pages/Package/PackageImage.vue'

const { t } = useI18n()
const listRef = ref(null)
const crudUrls = [
  '/packages/new',
  '/packages/view',
  '/packages/edit',
  '/packages/undelete',
  '/packages/delete']

const columns = [
  {
    name: "Name",
    field: "Name",
    label: t('package name'),
    align: "left",
    sortable: true,
  },
  {
    name: "KW",
    field: "KW",
    label: t('KW'),
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
  {
    name: "Thumbnail",
    label: t("thumbnail"),
    align: "center",
    style: "width: 90px",
    headerStyle: "width: 90px",
  },

]
onUpdated(() => listRef.value?.tableRef?.requestServerInteraction())
</script>
