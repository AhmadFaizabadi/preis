<template>
  <q-card class="q-pa-md" style="width: 100%">
    <q-card-section>
      <div class="text-h6">
        {{ isNew ? $t("newCustomer") : $t("editCustomer") }}
      </div>
    </q-card-section>
    <q-form ref="formRef" @submit="onSubmit" class="q-gutter-md">
      <q-card-section>
        <q-input
          v-model="model.FirstName"
          :label="$t('firstname') + ' *'"
          stack-label
          @blur="model.FirstName = capitalize(model.FirstName)"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 1) || $t('first name is required'),
          ]"
        />
        <q-input
          v-model="model.LastName"
          :label="$t('lastname') + ' *'"
          stack-label
          @blur="model.LastName = capitalize(model.LastName)"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 1) || $t('last name is required'),
          ]"
        />
        <q-select
          v-model="model.Gender"
          :options="genders"
          :label="$t('gender') + ' *'"
          stack-label
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 1) || $t('customer gender is required'),
          ]"
        />
        <q-input
          name="Phone"
          v-model="model.Phone"
          :label="$t('phone') + ' *'"
          stack-label
          type="tel"
        />
        <q-input
          name="Email"
          v-model="model.Email"
          label="Email *"
          stack-label
          type="email"
        />
        <customer-address v-model="model" />
        <q-input
          name="Note"
          v-model="model.Note"
          :label="$t('note') + ' *'"
          stack-label
          type="textarea"
          filled
        />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat type="submit" :loading="loading">{{ $t("save") }}</q-btn>
        <q-btn
          flat
          v-close-popup
          :to="$route.fullPath.includes('customers') ? '/customers' : ''"
          >{{ $t("cancel") }}</q-btn
        >
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CustomerAddress from "./Address.vue";
import { capitalize, postedSuccessfully } from "src/api/utils";
import { getAction, postAction, patchAction } from "src/api/manage";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const genders = [t("Man"), t("Woman"), t("Company")];
const $route = useRoute();
const $router = useRouter();
const isNew = computed(() => !$route.params.id);
const model = ref({ Addresses: [] });
const formRef = ref(null);
const loading = ref(false);
const onSubmit = () =>
  formRef.value.validate().then(async (success) => {
    if (success) {
      loading.value = true;
      try {
        const res = isNew.value
          ? await postAction("api/v1/customers", {
              ...model.value,
              Addresses: JSON.stringify(model.value.Addresses),
              SelectedAddress: JSON.stringify(model.value.SelectedAddress),
            })
          : await patchAction("api/v1/customers/update", {
              ...model.value,
              Addresses: JSON.stringify(model.value.Addresses),
              SelectedAddress: JSON.stringify(model.value.SelectedAddress),
            });
        if (res) {
          postedSuccessfully(res);
          await $router.replace("/customers");
        }
      } finally {
        loading.value = false;
      }
    }
  });
watch(
  () => $route.params.id,
  async (id) => {
    if (id) model.value = await getAction(`api/v1/customers/${id}`);
  },
  { immediate: true }
);
</script>
