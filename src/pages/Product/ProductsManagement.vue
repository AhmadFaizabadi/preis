<template>
  <q-page padding>
    <div class="text-h6 bg-grey text-white rounded-borders q-pa-md">{{ $t('products') }}</div>
    <list-view ref="listRef" :columns="columns" row-key="Id" api-url-get="api/v1/product/list" filter-on-field='"Name"'
      api-url-count="api/v1/product/count">
      <template #top-left>
        <common-tasks :crud-urls="crudUrls" :key-value="$refs.listRef?.selectedKey || 0" :entity-name="$t('product')" />
      </template>
      <template #body-cell="p">
        <q-td v-if="p.col.name !== 'Thumbnail'">
          {{ p.value }}
        </q-td>
        <q-td v-else>
          <product-image :id="p.key" />
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
import ProductImage from 'components/ProductImage.vue';

const { t } = useI18n()
const listRef = ref(null)
const crudUrls = [
  '/products/new',
  '/products/view',
  '/products/edit',
  '/products/undelete',
  '/products/delete']

const columns = [
  {
    name: "Name",
    field: "Name",
    label: t('product name'),
    align: "left",
    sortable: true,
  },
  {
    name: "Category",
    field: "Category",
    label: t('category'),
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
