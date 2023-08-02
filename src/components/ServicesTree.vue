<template>
  <div class="column">
    <div class="col">
      <q-splitter v-model="splitterModel" style="height: 70vh">
        <template v-slot:before>
          <div class="q-pa-md">
            <q-input
              ref="filterRef"
              filled
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
                    :size="prop.node.children ? 'md' : 'sm'"
                    :color="prop.node.children ? 'deep-orange' : 'blue-14'"
                  />{{ prop.node.label }}
                  <q-popup-proxy v-if="editable" context-menu>
                    <div class="row q-gutter-sm bg-teal-11 text-black">
                      <q-btn flat dense icon="las la-folder-plus"
                        ><q-tooltip>{{ $t("newCategoryOrService") }}</q-tooltip>
                        <q-popup-edit
                          v-model="prop.node"
                          :validate="(val) => val.length > 5"
                        >
                          <new-service
                            v-model="prop.node"
                            is-new
                            @on-save="onNew(prop.node, $event)"
                          />
                        </q-popup-edit>
                      </q-btn>
                      <q-btn flat dense icon="las la-edit"
                        ><q-tooltip>{{ $t("editTitle") }}</q-tooltip>
                        <q-popup-edit
                          v-model="prop.node"
                          :validate="(val) => val.length > 5"
                        >
                          <new-service
                            v-model="prop.node"
                            @on-save="onEdit(prop.node, $event)"
                          />
                        </q-popup-edit>
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
        </template>

        <template
          v-slot:after
          v-if="
            treeRef?.selected &&
            !treeRef?.getNodeByKey(treeRef?.selected).children
          "
        >
          <div class="q-pa-md">
            <div class="text-h4 q-mb-md">
              {{ treeRef?.selected.split("-").at(-1) }}
            </div>
            <service-prices
              v-model:serviceName="treeRef.selected"
              :editable="editable"
              @on-select="$emit('on-select', $event)"
            />
          </div>
        </template>
      </q-splitter>
    </div>
    <div v-if="!editable" class="justify-end">
      <q-btn flat v-close-popup :label="$t('close')" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import NewService from "src/components/NewService.vue";
import ServicePrices from "src/components/ServicePrices.vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useInvoiceStore } from "src/stores/invoice";
import { storeToRefs } from "pinia";

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
const splitterModel = ref(50);

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

const onEdit = (parent, e) => {
  parent.label = e.label;
  parent.icon = e.icon;
  const p = findAllParents(supplies, parent.fullName);
  if (p.length > 0) treeRef.value.setExpanded(p[0], true);
};

const onNew = (parent, node) => {
  invoiceStore.addSupply(parent, node);
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
</script>
<style lang="sass" scoped>

.flex-break
  flex: 1 0 100% !important
</style>
