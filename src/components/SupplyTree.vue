<template>
  <q-card class="column">
    <div class="col">
      <q-card-section class="q-pa-md">
        <q-btn v-if="editable && selected" icon="menu" flat dense>
          <q-menu auto-close>
            <q-list style="min-width: 100px" class="q-pa-md">
              <q-item
                clickable
                @click="editNode({ type: 'supply', isNew: true })"
              >
                <q-item-section thumbnail
                  ><q-icon name="category"
                /></q-item-section>
                <q-item-section>{{ $t("newCategory") }}</q-item-section>
              </q-item>
              <q-item
                clickable
                @click="editNode({ type: 'price', isNew: true })"
              >
                <q-item-section thumbnail
                  ><q-icon name="euro"
                /></q-item-section>
                <q-item-section>{{ $t("newPrice") }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="editNode({ isNew: false })">
                <q-item-section thumbnail
                  ><q-icon name="edit"
                /></q-item-section>
                <q-item-section>{{ $t("edit") }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="onDelete">
                <q-item-section thumbnail
                  ><q-icon name="delete"
                /></q-item-section>
                <q-item-section>{{ $t("delete") }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-input
          ref="filterRef"
          autofocus
          dens
          v-model="filter"
          style="width: 250px"
          @keyup.enter="selectBtnRef.click()"
        >
          <template v-slot:append>
            <q-icon
              v-if="filter !== ''"
              name="clear"
              class="cursor-pointer"
              @click="resetFilter"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
    </div>
    <div class="col">
      <q-card-section>
        <q-scroll-area style="height: 60vh; max-width: 600px">
          <div class="q-pa-md">
            <q-tree
              ref="treeRef"
              :nodes="supplies"
              node-key="fullName"
              accordion
              :filter="filter"
              :duration="10"
              selected-color="teal-7"
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
                      ? `🔸 ${prop.node.label} - ${prop.node.unitValue}€ (${prop.node.unitName})`
                      : prop.node.label
                  }}
                </div>
              </template>
            </q-tree>
          </div>
        </q-scroll-area>
      </q-card-section>
    </div>
    <div class="col">
      <q-card-actions v-if="!editable" class="justify-end">
        <q-btn
          ref="selectBtnRef"
          :disable="!(selected && treeRef?.getNodeByKey(selected)?.unitValue)"
          flat
          v-close-popup
          :label="$t('select')"
          @click="onSelect"
        />
        <q-btn flat v-close-popup :label="$t('cancel')" />
      </q-card-actions>
      <q-dialog v-model="supplyFormVisible">
        <new-supply
          :model-value="theModel"
          :is-new="isNew"
          @update:modelValue="onUpdate($event)" /></q-dialog
      ><q-dialog v-model="priceFormVisible">
        <new-price
          :model-value="theModel"
          :is-new="isNew"
          @update:modelValue="onUpdate($event)"
      /></q-dialog>
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useInvoiceStore } from "src/stores/invoice";
import { storeToRefs } from "pinia";
import NewSupply from "src/components/NewSupply.vue";
import NewPrice from "src/components/NewPrice.vue";

const props = defineProps({
  editable: Boolean,
  modelValue: Object,
});
const emit = defineEmits(["update:model-value"]);
const invoiceStore = useInvoiceStore();
const { supplies } = storeToRefs(invoiceStore);
const { t } = useI18n();
const $q = useQuasar();
const filter = ref("");
const selected = ref(props.modelValue?.fullName || "");
const filterRef = ref(null);
const treeRef = ref(null);
const isNew = ref(false);
const theModel = ref();
const supplyFormVisible = ref(false);
const priceFormVisible = ref(false);
const selectBtnRef = ref(null);

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
  // treeRef.value.collapseAll();
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

const editNode = (node) => {
  if (!node.isNew) {
    const snode = treeRef.value.getNodeByKey(selected.value);
    node.type = snode?.unitValue ? "price" : "supply";
    node.model = snode;
  } else {
    node.model =
      node.type === "supply"
        ? { label: "", icon: "" }
        : { label: "", unitName: "", unitValue: 0 };
  }
  isNew.value = node.isNew;
  theModel.value = node.model;
  if (node.type === "supply") {
    supplyFormVisible.value = true;
  } else if (node.type === "price") {
    priceFormVisible.value = true;
  }
};

function onDelete() {
  const node = treeRef.value.getNodeByKey(selected.value);
  if (!node) return;
  let msg = "children" in node ? t("nodeHasChildRemovingWarning") : "";
  msg += t("areYouSureForDeletion");
  $q.dialog({
    title: t("deleteConfirm") + " " + node.fullName,
    message: msg,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    const p = findAllParents(supplies.value, node.fullName);
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
const onUpdate = (u) => {
  if (u.unitValue) {
    const p = findAllParents(supplies.value, selected.value);
    if (p?.length > 0) u.icon = treeRef.value.getNodeByKey(p.at(-1)).icon;
  }
  theModel.value.label = u.label;
  ({ ...theModel.value } = u);
  const parent = treeRef.value.getNodeByKey(selected.value);
  theModel.value.fullName =
    parent.fullName + "-" + theModel.value.label.toLowerCase();
  if (isNew.value) {
    if (!("children" in parent)) parent.children = [];
    parent.children.push({ ...theModel.value });
  }
  invoiceStore.saveData("base", true);
};
const onSelect = () => {
  theModel.value = treeRef.value.getNodeByKey(selected.value);
  emit("update:model-value", theModel.value);
};
onMounted(() => {
  if (selected.value !== "") {
    try {
      for (const p of findAllParents(supplies.value, selected.value))
        treeRef.value.setExpanded(p, true);
    } catch (error) {
      console.log("error on expand", error);
    }
  }
});
</script>
<style lang="sass" scoped>

.flex-break
  flex: 1 0 100% !important
</style>
