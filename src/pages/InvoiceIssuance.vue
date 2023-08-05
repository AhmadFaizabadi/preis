<template>
  <q-page padding>
    <q-card class="my-card bg-grey-12 q-pa-md">
      <q-card-section>
        <div class="text-h6">
          {{ isNew ? $t("newInvoice") : $t("editInvoice") }}
        </div>
      </q-card-section>
      <q-card-section>
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
      </q-card-section>
      <q-card-section>
        <customer v-model="model.customer" />
      </q-card-section>
      <q-card-section>
        <q-list>
          <template v-for="item in model.items" :key="item.service.fullName">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>{{
                  item.service.fullName.split("-")[0]
                }}</q-item-label>
                <q-item-label>{{ item.service.label }}</q-item-label>
                <q-item-label caption
                  >{{ item.count }} x {{ item.service.unitName }}</q-item-label
                >
              </q-item-section>
              <q-item-section avatar></q-item-section>
            </q-item>
            <q-separator />
          </template>
          <q-item clickable v-ripple>
            <q-item-section>
              {{ $t("newItem") }}
            </q-item-section>
            <q-item-section side>
              <q-icon name="las la-plus-circle" color="green" />
            </q-item-section>
            <q-popup-proxy class="fixed-center">
              <new-address
                :model-value="newAddress"
                @update:model-value="model.push($event)"
                is-new
              />
            </q-popup-proxy>
          </q-item>
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
import Customer from "src/components/Customer.vue";
const props = defineProps({ modelValue: Object });
const model = ref(
  props.modelValue || { date: undefined, customer: undefined, items: [] }
);
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
</style>
