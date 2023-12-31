<template>
  <q-page>
    <div class="column justify-center" style="height: calc(100vh - 100px)">
      <div class="col-auto row q-gutter-sm">
        <div class="col-9">
          <q-table
            ref="tableRef"
            row-key="id"
            selection="single"
            bordered=""
            v-model:selected="selected"
            v-model:pagination="pagination"
            :title="`User Management`"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :filter="filter"
            binary-state-sort
            @request="onRequest"
            style="height: 90%"
          >
            >
            <template #top-right>
              <q-input
                v-model="filter"
                borderless
                dense
                clearable=""
                debounce="600"
                placeholder="Search"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>
        <div class="col-2">
          <user-stats v-if="selected.length > 0" :user-id="selected[0].id" />
        </div>
      </div>
      <div class="col">
        <user-actions v-if="selected.length > 0" :user-id="selected[0].id" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import UserActions from "src/components/UserActions.vue";
import UserStats from "src/components/UserStats.vue";

const $q = useQuasar();
const selected = ref([]);
const roles = ref([]);
const tableRef = ref();
const rows = ref([]);
const filter = ref("");
const loading = ref(false);
const pagination = ref({
  sortBy: "Id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

const columns = [
  {
    name: "Id",
    label: "Id",
    field: (row) => row.id,
    align: "left",
    sortable: true,
  },
  {
    name: "UserName",
    label: "UserName",
    field: (row) => row.userName,
    align: "left",
    sortable: true,
  },
  {
    name: "Name",
    label: "Name",
    field: (row) => row.name,
    align: "left",
    sortable: true,
  },
  {
    name: "Title",
    label: "Title",
    field: (row) => row.title,
    align: "left",
    sortable: true,
  },
  {
    name: "Email",
    label: "Email",
    field: (row) => row.email,
    align: "left",
    sortable: true,
  },
  {
    name: "Phone",
    label: "Phone",
    field: (row) => row.phone,
    align: "left",
    sortable: true,
  },
  {
    name: "Role",
    label: "Role",
    field: (row) => row.role,
    align: "left",
    sortable: true,
  },
  {
    name: "EmailConfirmed",
    label: "EmailConfirmed",
    field: (row) => row.emailConfirmed,
    align: "left",
    sortable: true,
  },
  {
    name: "Enabled",
    label: "Enabled",
    field: (row) => row.enabled,
    align: "left",
    sortable: true,
  },
  {
    name: "CreatedDateTime",
    label: "CreatedDateTime",
    field: (row) => row.createdDateTime,
    align: "left",
    sortable: true,
  },
  {
    name: "ModifiedDateTime",
    label: "ModifiedDateTime",
    field: (row) => row.modifiedDateTime,
    align: "left",
    sortable: true,
  },
];
async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  loading.value = true;
  try {
    // update rowsCount with appropriate value
    const fetchCount =
      rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
    const startRow = (page - 1) * rowsPerPage;
    const fetchParams = {
      StartRow: startRow,
      FetchCount: fetchCount,
      Flt: filter.value,
      SecondFilter: "Status > 0",
      SortBy: sortBy,
      Descending: descending,
      PageSize: rowsPerPage,
      PageNumber: page,
    };
    const recordCount = await api.post("api/user/users/count", {
      ...fetchParams,
      PageSize: 0,
    });
    pagination.value.rowsNumber = recordCount.data;

    // fetch data from "server"
    const returnedData = await api.post("api/user/users/all", fetchParams);
    // clear out existing data and add new
    rows.value = returnedData.data;

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // get initial data from server (1st page)
  const res = await api.get("api/user/roles/all");
  roles.value = res.data;
  tableRef.value.requestServerInteraction();
});
</script>
