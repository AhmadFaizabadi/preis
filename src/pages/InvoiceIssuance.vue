<template>
  <q-page padding>
    <q-dialog v-model="showNewItem">
      <new-invoice-item
        :model-value="newItem"
        :is-new="isNewItem"
        @update:model-value="onUpdate"
      />
    </q-dialog>
    <q-card class="my-card bg-grey-12 q-pa-md">
      <q-card-section>
        <div class="text-h6">
          {{ isNew ? $t("newInvoice") : $t("editInvoice") }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-gutter-md justify-around no-wrap">
          <q-input filled v-model="model.date" mask="date" :rules="['date']">
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
          <q-item-label>{{ $t("invoiceItems") }}</q-item-label>
          <q-item clickable v-ripple @click="showNewItem = true">
            <q-item-section avatar
              ><q-icon name="add" color="green" />
            </q-item-section>
            <q-item-section>{{ $t("newItem") }}</q-item-section>
          </q-item>
          <template v-for="item in model.items" :key="item.id">
            <q-item clickable v-ripple>
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
              </q-item-section>
              <q-item-section avatar></q-item-section>
            </q-item>
            <q-separator />
          </template>
        </q-list>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          v-close-popup
          @click="$emit('update:model-value', model)"
          :label="$t('save')"
        />
        <q-btn :label="$t('cancel')" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { date } from "quasar";
import Customer from "src/components/Customer.vue";
import NewInvoiceItem from "src/components/NewInvoiceItem.vue";
import { useInvoiceStore } from "src/stores/invoice";

const { uuidv4 } = useInvoiceStore();

const props = defineProps({ modelValue: Object, isNew: Boolean });
const model = ref(
  props.modelValue || {
    date: date.formatDate(Date.now(), "YYYY/MM/DD"),
    items: [],
  }
);
if (props.isNew) model.value.id = uuidv4().split("-").at(-1);

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
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
</style>
