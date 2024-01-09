<template>
  <q-table
    ref="tableRef"
    dense
    :rows="rows"
    :columns="columns"
    :row-key="rowKey"
    v-model:pagination="pagination"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    separator="cell"
    wrap-cells
    selection="single"
    @selection="onSelect"
    v-model:selected="selected"
    @request="onRequest"
    @row-click="rowClick"
  >
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        :placeholder="$t('search')"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:top-left>
      <slot name="top-left"> </slot>
    </template>
    <template v-slot:body-cell="props">
      <slot name="body-cell" v-bind="props"
        ><q-td :props="props">
          {{ props.value }}
        </q-td></slot
      >
    </template>
  </q-table>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAction } from "src/api/manage";
import { useRoute, useRouter } from "vue-router";

const $route = useRoute();
const $router = useRouter();
const props = defineProps({
  columns: Array,
  rowKey: String,
  filterOnField: {
    type: String,
    required: false,
    default: "Name",
  },
  apiUrlCount: String,
  apiUrlGet: String,
});
const emit = defineEmits(["on-select"]);
const loading = ref(false);
const filter = ref("");
const pagination = ref({
  sortBy: props.columns.at(0)?.field,
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 100,
  whereClause: "",
});

const tableRef = ref(null);
const rows = ref([]);
const selectedKey = ref(null);
const selected = ref([]);
async function onRequest(req) {
  loading.value = true;
  try {
    if (req.filter?.length > 0) {
      const segs = req.filter.trim().split(" ");
      const wc =
        "where " +
        segs.map((m) => `${props.filterOnField} ILike '%${m}%'`).join(" and ");
      req.pagination.whereClause = wc;
    } else req.pagination.whereClause = "";
    const rc = await getAction(props.apiUrlCount, {
      conditions: req.pagination.whereClause,
    });
    pagination.value = { ...req.pagination, rowsNumber: rc };
    const res = await getAction(props.apiUrlGet, pagination.value);
    rows.value = res;
  } finally {
    loading.value = false;
  }
}
const onSelect = ({ keys }) => {
  selectedKey.value = keys[0];
  $router.replace($route.fullPath.replace(/\/\d+/, "/" + selectedKey.value));
  emit("on-select", selectedKey.value);
};
onMounted(() => tableRef.value?.requestServerInteraction());
defineExpose({ tableRef, selectedKey });
const rowClick = (_, r) => {
  selected.value = [r];
  onSelect({ keys: [r[props.rowKey]] });
};
</script>
