<template>
  <q-page padding>
    <q-dialog v-model="showNewItem">
      <new-invoice-item
        :model-value="newItem"
        :is-new="isNewItem"
        @update:model-value="onUpdate"
      />
    </q-dialog>
    <q-card class="my-card bg-grey-12 q-pa-md scroll">
      <q-card-section>
        <div class="text-h6">
          {{ isNew ? $t("newInvoice") : $t("editInvoice") }}
        </div>
        <div class="column q-gutter-sm">
          <q-input
            class="self-end"
            filled
            v-model="model.date"
            :hint="new Date(model.date).toDateString()"
            mask="date"
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
          <customer v-model="model.customer" />
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
          <q-item clickable v-ripple @click="showNewItem = true">
            <q-item-section avatar
              ><q-icon name="add" color="green" />
            </q-item-section>
            <q-item-section>{{ $t("newItem") }}</q-item-section>
          </q-item>
          <div class="scroll q-ml-xl q-pl-xl">
            <template v-for="item in model.items" :key="item.id">
              <q-item clickable v-ripple @click="editIt(item)">
                <q-item-section>
                  <q-item-label overline>{{
                    item.supply.fullName.split("-").slice(1, -2).join("-")
                  }}</q-item-label>
                  <q-item-label>{{ item.supply.label }}</q-item-label>
                  <q-item-label caption
                    >{{
                      `${item.entity}(${item.supply.unitName}) x ${item.supply.unitValue}€`
                    }}
                  </q-item-label>
                  <q-item-label caption lines="3">{{ item.note }}</q-item-label>
                </q-item-section>
                <q-item-section avatar
                  ><q-icon :name="item.supply.icon" size="lg"
                /></q-item-section>
                <q-item-section side>
                  <q-item-label header
                    >{{
                      (item.entity * item.supply.unitValue).toLocaleString()
                    }}€</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator />
            </template>
          </div>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn to="/" @click="onSave" :label="$t('save')" />
        <q-btn :label="$t('cancel')" to="/" @click="removeUnsavedForm" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { date, LocalStorage } from "quasar";
import Customer from "src/components/Customer.vue";
import NewInvoiceItem from "src/components/NewInvoiceItem.vue";
import { useInvoiceStore } from "src/stores/invoice";

const { uuidv4 } = useInvoiceStore();

const props = defineProps({ modelValue: Object, isNew: Boolean });
const emit = defineEmits("update:model-value");
const newModel = {
  id: uuidv4().split("-").at(-1),
  date: date.formatDate(Date.now(), "YYYY/MM/DD"),
  items: [],
};
const model = ref({ ...newModel, ...props.modelValue });
const newItem = ref();
const isNewItem = ref(true);
const showNewItem = ref(false);

const onUpdate = (u) => {
  if (isNewItem.value) model.value.items.push({ ...u });
  else {
    const foundIndex = model.value.items.findIndex((f) => f.id === u.id);
    if (foundIndex !== -1) {
      model.value.items[foundIndex] = { ...u };
    }
  }
};
const total = computed(() =>
  model.value.items.reduce((t, c) => (t += c.entity * c.supply.unitValue), 0)
);

const editIt = (item) => {
  newItem.value = item;
  isNewItem.value = false;
  showNewItem.value = true;
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
const onSave = () => {
  removeUnsavedForm();
  emit("update:model-value", model.value);
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
