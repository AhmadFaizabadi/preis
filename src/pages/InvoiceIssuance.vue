<template>
  <q-page padding>
    <q-dialog v-model="showNewItem">
      <new-invoice-item
        :model-value="newItem"
        :is-new="isNewItem"
        @update:model-value="onUpdateItem"
      />
    </q-dialog>
    <q-card class="my-card bg-grey-12 q-pa-md scroll">
      <q-form class="q-gutter-sm" @submit="onSubmit">
        <q-card-section>
          <div class="text-h6">
            {{ isNew ? $t("newInvoice") : $t("editInvoice") }}
          </div>
          <div class="column q-gutter-sm">
            <q-input
              class="self-end"
              filled
              :label="$t('date') + ' *'"
              v-model="model.date"
              :hint="new Date(model.date).toDateString()"
              mask="date"
              lazy-rules
              :rules="['date']"
              style="max-width: 170px"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="model.date">
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
            <customer v-model="model.customer" required />
          </div>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item-label
              >{{ $t("invoiceItems") }}
              {{
                `${model.items.length} (${total.toLocaleString()}€)`
              }}</q-item-label
            >
            <q-item clickable v-ripple @click="onNewItem">
              <q-item-section avatar
                ><q-icon name="add" color="green" />
              </q-item-section>
              <q-item-section>{{ $t("newItem") }}</q-item-section>
            </q-item>
            <div class="scroll q-ml-xl q-pl-xl">
              <template v-for="item in model.items" :key="item.id">
                <q-item
                  clickable
                  @click="selectedId = item.id"
                  :active="item.id === selectedId"
                  active-class="bg-grey-4"
                >
                  <q-item-section>
                    <q-item-label overline>{{
                      item.supply?.label
                    }}</q-item-label>
                    <q-item-label>{{
                      item.supply.fullName.split("-").slice(1, -1).join("-")
                    }}</q-item-label>
                    <q-item-label caption
                      >{{
                        `${item.entity}(${item.supply.unitName}) x ${item.supply.unitValue}€`
                      }}
                    </q-item-label>
                    <q-item-label caption lines="3">{{
                      item.note
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar
                    ><q-icon :name="item.supply.icon" size="lg"
                  /></q-item-section>
                  <q-item-section side>
                    <div
                      class="row items-center justify-center"
                      style="width: 80px"
                    >
                      <div class="col text-text-subtitle2">
                        {{
                          (
                            item.entity * item.supply.unitValue
                          ).toLocaleString()
                        }}€
                      </div>
                      <div
                        v-if="item.id === selectedId"
                        class="col row text-grey-8 q-gutter-xs"
                      >
                        <q-btn
                          icon="edit"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          @click="onEditItem(item)"
                        />
                        <q-btn
                          icon="delete"
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          @click="onDeleteItem"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>
            </div>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn type="supmit" :label="$t('save')" />
          <q-btn :label="$t('cancel')" to="/" @click="removeUnsavedForm" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { date, LocalStorage, useQuasar } from "quasar";
import Customer from "src/components/Customer.vue";
import NewInvoiceItem from "src/components/NewInvoiceItem.vue";
import { useInvoiceStore } from "src/stores/invoice";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { uuidv4, newInvoice } = useInvoiceStore();
const $q = useQuasar();
const $router = useRouter();
const { t } = useI18n();
const props = defineProps({ modelValue: Object, isNew: Boolean });
const emit = defineEmits(["update:model-value"]);
const newModel = {
  id: uuidv4().split("-").at(-1),
  date: date.formatDate(Date.now(), "YYYY/MM/DD"),
  items: [],
};
const model = ref({ ...newModel, ...props.modelValue });
const newItem = ref();
const isNewItem = ref(true);
const showNewItem = ref(false);
const selectedId = ref("");

const onUpdateItem = (u) => {
  if (isNewItem.value) model.value.items.push({ ...u });
  else {
    const foundIndex = model.value.items.findIndex((f) => f.id === u.id);
    if (foundIndex !== -1) {
      model.value.items[foundIndex] = { ...u };
    }
  }
  showNewItem.value = false;
};
const total = computed(() =>
  model.value.items.reduce((t, c) => (t += c.entity * c.supply?.unitValue), 0)
);

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
const onSubmit = () => {
  if (model.value.items.length === 0) {
    $q.notify({ type: "negative", message: t("noItems") });
    return;
  }
  if (!model.value.customer?.name) {
    $q.notify({ type: "negative", message: t("noCustomer") });
    return;
  }
  removeUnsavedForm();
  if (props.isNew) {
    newInvoice({ ...model.value, total });
  }
  emit("update:model-value", model.value);
  $router.back();
  $q.notify({ type: "positive", message: t("invoiceRegistered") });
};
const onNewItem = () => {
  isNewItem.value = true;
  showNewItem.value = true;
};
const onEditItem = (item) => {
  newItem.value = item;
  isNewItem.value = false;
  showNewItem.value = true;
};
const onDeleteItem = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("deleteItemAsk"),
    cancel: true,
  }).onOk(() => {
    const foundIndex = model.value.items.findIndex(
      (f) => f.id === selectedId.value
    );
    if (foundIndex !== -1) model.value.items.splice(foundIndex, 1);
  });
};
const removeUnsavedForm = () => LocalStorage.remove("unsavedForm");
watch(
  model,
  () => {
    saveUnsavedForm();
  },
  { deep: true }
);

if (props.isNew) loadUnSavedForm();
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
  max-height: calc( 100vh - 100px )
#invoice-title
  background-image: url('assets/invoice2.png')
  background-repeat: no-repeat
</style>
