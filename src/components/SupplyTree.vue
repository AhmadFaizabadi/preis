<template>
  <q-scroll-area style="height: 70vh; max-width: 600px">
    <div class="q-pa-md">
      <q-input
        ref="filterRef"
        dens
        outlined=""
        input-style="font-size: xx-small;"
        v-model="filter"
        label="Search - type in some letters ..."
      >
        <template v-slot:append>
          <q-icon
            v-if="filter !== ''"
            name="clear"
            class="cursor-pointer"
            @click="resetFilter"
          />
        </template>
      </q-input>

      <q-tree
        ref="treeRef"
        :nodes="supplies"
        node-key="fullName"
        accordion
        :filter="filter"
        :duration="10"
        :filter-method="myFilterMethod"
        v-model:selected="selected"
      >
        <template v-slot:default-header="prop">
          <div :class="prop.node.children ? 'text-weight-bold' : ''">
            <q-icon
              :name="prop.node.icon"
              class="q-mr-md"
              size="xs"
              :color="
                prop.node.children
                  ? 'deep-orange'
                  : prop.node.unitValue
                  ? 'green-14'
                  : 'blue-14'
              "
            />{{
              prop.node.unitValue
                ? `🔸 ${prop.node.label} - ${prop.node.unitValue}💲 (${prop.node.unitName})`
                : prop.node.label
            }}
            <q-popup-proxy v-if="editable" context-menu>
              <div class="row q-gutter-sm bg-teal-11 text-black">
                <q-btn flat dense icon="las la-folder-plus"
                  ><q-tooltip>{{ $t("newCategory") }}</q-tooltip>
                  <q-popup-proxy>
                    <new-item
                      is-new
                      node-type="category"
                      @on-save="onSave(prop.node, $event)"
                    />
                  </q-popup-proxy>
                </q-btn>
                <q-btn flat dense icon="las la-tag"
                  ><q-tooltip>{{ $t("newPrice") }}</q-tooltip>
                  <q-popup-proxy>
                    <new-item
                      is-new
                      node-type="price"
                      @on-save="onSave(prop.node, $event)"
                    />
                  </q-popup-proxy>
                </q-btn>
                <q-btn flat dense icon="las la-edit"
                  ><q-tooltip>{{ $t("editTitle") }}</q-tooltip>
                  <q-popup-proxy>
                    <new-item
                      :node-type="prop.node.price ? 'price' : 'category'"
                      @on-save="onSave"
                    />
                  </q-popup-proxy>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="las la-trash"
                  @click="onDelete(prop.node)"
                  ><q-tooltip>{{
                    $t("deleteCategoryOrService")
                  }}</q-tooltip></q-btn
                >
              </div>
            </q-popup-proxy>
          </div>
        </template>
      </q-tree>
    </div>
    <div v-if="!editable" class="justify-end">
      <q-btn flat v-close-popup :label="$t('close')" />
    </div>
  </q-scroll-area>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useInvoiceStore } from "src/stores/invoice";
import { storeToRefs } from "pinia";
import NewItem from "src/components/NewItem.vue";
defineProps({
  editable: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["on-select"]);
const invoiceStore = useInvoiceStore();
const { supplies } = storeToRefs(invoiceStore);
const { t } = useI18n();
const $q = useQuasar();
const filter = ref("");
const selected = ref("");
const filterRef = ref(null);
const treeRef = ref(null);

const myFilterMethod = (node, filter) => {
  const filt = filter.toLowerCase().split(" ");
  const found = filt.every((e) => node.fullName.indexOf(e) > -1);
  if (found) {
    treeRef.value.setExpanded(node.fullName, true);
    for (const p of findAllParents(supplies.value, node.fullName))
      treeRef.value.setExpanded(p, true);
    selected.value = node.fullName;
  }
  return found;
};
const resetFilter = () => {
  filter.value = "";
  treeRef.value.collapseAll();
  filterRef.value.focus();
};

function findAllParents(tree, nodeFullName, parentList = []) {
  for (const item of tree) {
    if (item.fullName === nodeFullName) {
      return parentList;
    } else if (item.children) {
      parentList.push(item.fullName);
      const result = findAllParents(item.children, nodeFullName, parentList);
      if (result) {
        return result;
      }
      parentList.pop();
    }
  }
  return null;
}

defineExpose({ selected });

const onSave = (parent, e) => {
  if (!("children" in parent)) parent.children = [];
  parent.children.push({
    ...e.event,
    fullName: parent.fullName + "-" + e.event.label.toLowerCase(),
  });
  treeRef.value.setExpanded(parent.fullName, true);
  invoiceStore.saveData("base", true);
};
const onEdit = (node, updated) => {
  node.label = updated.label;
  node.icon = updated.icon;
  const p = findAllParents(supplies.value, node.fullName);
  if (p.length > 0) treeRef.value.setExpanded(p[0], true);
  invoiceStore.saveData("base", true);
};

const onNew = (parent, node) => {
  if (!("children" in parent)) parent.children = [];
  parent.children.push({
    ...node,
    fullName: parent.fullName + "-" + node.label.toLowerCase(),
  });
  invoiceStore.saveData("base", true);
  const p = findAllParents(supplies.value, parent.fullName);
  if (p.length > 0) treeRef.value.setExpanded(p[0], true);
  treeRef.value.setExpanded(parent.fullName, true);
};

function onDelete(node) {
  let msg = "children" in node ? t("nodeHasChildRemovingWarning") : "";
  msg += t("areYouSureForDeletion");
  $q.dialog({
    title: t("deleteConfirm") + " " + node.fullName,
    message: msg,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const p = findAllParents(supplies, node.fullName);
    if (p.length > 0) {
      const children = treeRef.value.getNodeByKey(p.at(-1)).children;
      children.splice(
        children.findIndex((f) => f.fullName === node.fullName),
        1
      );
      treeRef.value.setExpanded(p[0], true);
    } else {
      supplies.splice(
        supplies.findIndex((f) => f.fullName === node.fullName),
        1
      );
    }
  });
}
onMounted(async () => {
  invoiceStore.loadData("base");
  try {
    await invoiceStore.get("base");
  } catch {}
});
</script>
<style lang="sass" scoped>

.flex-break
  flex: 1 0 100% !important
</style>
