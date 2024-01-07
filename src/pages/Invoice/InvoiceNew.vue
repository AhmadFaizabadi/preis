<template>
  <q-page padding>
    <q-dialog v-model="showNewItem" full-width>
      <peek-product @on-select="onSelect" />
      <!-- <new-invoice-item :model-value="newItem" :is-new="isNewItem" :is-service="isService"
        @update:model-value="onUpdateItem" /> -->
    </q-dialog>
    <q-card class="my-card bg-grey-12 q-pa-md scroll">
      <q-form
        ref="formRef"
        class="q-gutter-sm"
        @submit="onSubmit"
        greedy
        no-error-focus
      >
        <q-card-section>
          <div class="text-h6">
            {{ isNew ? $t("newInvoice") : $t("editInvoice") }}
          </div>
          <div class="row q-gutter-sm justify-between">
            <q-input
              class="self-end"
              filled
              :label="$t('date') + ' *'"
              v-model="model.Date"
              :hint="new Date(model.Date).toDateString()"
              style="max-width: 170px"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="model.Date" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          :label="$t('close')"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <select-customer
              v-model="model.Customer"
              autofocus
              required
              style="max-width: 350px"
              @update:model-value="
                model.ProjectName = $event.SelectedAddress?.AddressText
              "
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-xl items-center">
            <q-btn
              class="col-3"
              :label="$t('add new product')"
              @click="onNewItem('product')"
              dense
              icon="mdi-package-variant"
            />
            <!-- <q-btn :label="$t('add new service')" @click="onNewItem('service')" style="width:200px"
              icon="mdi-account-hard-hat-outline" /> -->
            <div class="col-2">
              {{ $t("invoiceItems") }}: {{ model.Items.length }}
            </div>
          </div>
          <div class="row q-gutter-md justify-around">
            <q-list style="height: 100%" class="col-8 q-mt-xl scroll">
              <template v-for="item in model.Items" :key="item.Id">
                <q-item
                  clickable
                  @click="selectedId = item.Id"
                  :active="item.Id === selectedId"
                  active-class="bg-grey-4"
                >
                  <q-item-section>
                    <q-item-label overline>{{
                      item.Product.Name
                    }}</q-item-label>
                    <q-item-label caption lines="6">
                      <div
                        class="text-small"
                        v-html="item.Product.Description"
                      />
                    </q-item-label>
                    <q-item-label caption
                      >{{ `${item.Entity} x` }}
                    </q-item-label>
                    <q-item-label caption lines="3">{{
                      item.Note
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar
                    ><product-image :id="item.Product.Id" :width="100"
                  /></q-item-section>
                  <q-item-section side>
                    <div
                      class="row items-center justify-center"
                      style="width: 80px"
                    >
                      <div
                        v-if="item.Id === selectedId"
                        class="col row text-grey-8 q-gutter-xs"
                      >
                        <q-btn
                          icon="edit"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          ><q-popup-edit v-model="item.Entity" v-slot="scope">
                            <q-input
                              v-model="scope.value"
                              dense
                              @keyup.enter="scope.set()"
                            >
                              <template v-slot:append>
                                <q-icon name="edit" />
                              </template>
                            </q-input> </q-popup-edit
                        ></q-btn>
                        <q-btn
                          icon="delete"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          @click="onDeleteItem(item.Id)"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
            <div class="col-2 column q-gutter-lg">
              <q-input
                v-model="model.ProjectNumber"
                :label="$t('projectNumber')"
                class="req-field"
                lazy-rules
                :rules="[
                  (v) =>
                    (v && v?.length > 0) ||
                    $t('projectNumber') + ' is required',
                ]"
              />
              <q-input
                v-model="model.ProjectName"
                :label="$t('projectName')"
                class="req-field"
                lazy-rules
                :rules="[
                  (v) =>
                    (v && v?.length > 0) || $t('projectName') + ' is required',
                ]"
              />
              <q-input
                v-model="model.AgentName"
                :label="$t('agentName')"
                class="req-field"
                @blur="model.AgentName = capitalize(model.AgentName)"
                lazy-rules
                :rules="[
                  (v) =>
                    (v && v?.length > 0) || $t('agentName') + ' is required',
                ]"
              />
              <q-input
                v-model="model.AgentPhone"
                :label="$t('agentPhone')"
                class="req-field"
                lazy-rules
                :rules="[
                  (v) =>
                    (v && v.length > 0) || $t('agentPhone') + ' is required',
                ]"
              />
              <q-input
                v-model="model.TotalPrice"
                :label="$t('total price(€)')"
                type="number"
                lazy-rules
                class="req-field"
                :rules="[
                  (val) => (val && val > 0) || $t('total price is essential!'),
                ]"
              />
              <q-input
                v-model="model.NetPrice"
                :label="$t('net price(€)')"
                type="number"
                lazy-rules
                class="req-field"
                :rules="[
                  (val) => (val && val > 0) || $t('net price is essential!'),
                ]"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            type="submit"
            :label="$t('save')"
            icon="save"
            color="primary"
          />
          <q-btn :label="$t('cancel')" to="/invoices" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { date, LocalStorage, useQuasar } from "quasar";
import SelectCustomer from "../Customer/SelectCustomer.vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import ProductImage from "components/ProductImage.vue";
import { getAction, patchAction, postAction } from "src/api/manage";
import { postedSuccessfully, capitalize } from "src/api/utils";
import PeekProduct from "src/components/PeekProduct.vue";
import { uuidv1 } from "src/api/utils";

const formRef = ref(null);
const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const { t } = useI18n();
const props = defineProps({ modelValue: Object, isNew: Boolean });
const emit = defineEmits(["update:model-value"]);
const newModel = {
  Date: date.formatDate(Date.now(), "YYYY-MM-DD"),
  Items: [],
};
const model = ref({ ...newModel, ...props.modelValue });
const newItem = ref();
const isNewItem = ref(true);
const isService = ref(true);
const showNewItem = ref(false);
const selectedId = ref("");
const loading = ref(false);

const onUpdateItem = (u) => {
  if (isNewItem.value) model.value.Items.push({ ...u });
  else {
    const foundIndex = model.value.Items.findIndex((f) => f.Id === u.Id);
    if (foundIndex !== -1) {
      model.value.Items[foundIndex] = { ...u };
    }
  }
  showNewItem.value = false;
};

const loadUnSavedForm = () => {
  try {
    if (LocalStorage.has("unsavedForm")) {
      model.value = { ...newModel, ...LocalStorage.getItem("unsavedForm") };
      console.log("model loaded from unsavedForm");
    } else model.value = newModel;
  } catch {
    model.value = newModel;
  }
};
const saveUnsavedForm = () => {
  try {
    LocalStorage.set("unsavedForm", model.value);
  } catch {}
};
function onSubmit() {
  if (model.value.Items.length === 0) {
    $q.notify({ type: "negative", message: t("noItems") });
    return;
  }
  if (!model.value.Customer?.Name) {
    $q.notify({ type: "negative", message: t("noCustomer") });
    return;
  }
  formRef.value.validate().then(async (success) => {
    if (success) {
      // removeUnsavedForm();
      loading.value = true;
      try {
        const data = {
          ...model.value,
          Customer: JSON.stringify(model.value.Customer),
          Items: JSON.stringify(
            model.value.Items.map((m) => {
              const { Entity, Selected, ...rest } = m.Product;
              return { ...m, Product: rest };
            })
          ),
        };
        const res = $route.params?.id
          ? await patchAction("api/v1/invoices/update", data)
          : await postAction("api/v1/invoices", data);
        postedSuccessfully();
        $router.back();
      } finally {
        loading.value = false;
      }
    }
  });
}

const onNewItem = (itype) => {
  isNewItem.value = true;
  showNewItem.value = true;
  isService.value = itype == "service";
};
const onEditItem = (item) => {
  newItem.value = item;
  isService.value = "service" in item;
  isNewItem.value = false;
  showNewItem.value = true;
};
const onDeleteItem = (id) => {
  $q.dialog({
    title: t("confirm"),
    message: t("deleteItemAsk"),
    cancel: true,
  }).onOk(() => {
    const foundIndex = model.value.Items.findIndex((f) => f.Id === id);
    if (foundIndex !== -1) model.value.Items.splice(foundIndex, 1);
  });
};

const onSelect = (s) => {
  s.forEach((e) => {
    const found = model.value.Items.find((f) => f.Product.Id === e.Id);
    if (found) {
      found.Entity = e.Entity;
    } else
      model.value.Items.push({ Id: uuidv1(), Entity: e.Entity, Product: e });
  });
  showNewItem.value = false;
};
// const removeUnsavedForm = () => LocalStorage.remove("unsavedForm");
// watch(
//   model,
//   () => {
//     saveUnsavedForm();
//   },
//   { deep: true }
// );
watch(
  () => $route.params.id,
  async (id) => {
    if (id) model.value = await getAction(`api/v1/invoices/${id}`);
  },
  { immediate: true }
);

// if (props.isNew) loadUnSavedForm();
</script>

<style lang="sass" scoped>
.my-card
  max-width: 90vw
  max-height: calc( 100vh - 100px )
.req-field:after
  content: ' *'
#invoice-title
  background-image: url('assets/invoice2.png')
  background-repeat: no-repeat
</style>
