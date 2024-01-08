<template>
  <q-card class="q-pa-md" style="width: 100%">
    <q-card-section horizontal>
      <q-form ref="formRef" @submit="onSubmit" class="q-gutter-md">
        <q-field
          :model-value="model.Property"
          bottom-slots
          :label="$t('property')"
          stack-label
        >
          <template v-slot:control>
            <q-radio
              v-model="model.Property"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="Privat"
              label="Privat"
            />
            <q-radio
              v-model="model.Property"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              val="Gewerbe"
              label="Gewerbe"
            />
          </template>
        </q-field>
        <div class="row q-gutter-xl no-wrap q-pa-md">
          <div class="col">
            <q-field
              :model-value="model.Title"
              bottom-slots
              :label="$t('title')"
              stack-label
            >
              <template v-slot:control>
                <q-radio
                  v-model="model.Title"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="Herr"
                  label="Herr"
                />
                <q-radio
                  v-model="model.Title"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="Frau"
                  label="Frau"
                />
              </template>
            </q-field>
            <q-input
              v-if="model.Property === 'Privat'"
              v-model.trim="model.Name"
              :label="$t('name') + ' *'"
              stack-label
              @blur="model.Name = capitalize(model.Name)"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 1) || $t('customerNameRequired'),
              ]"
            />
            <div v-else class="col">
              <q-input
                v-model="model.AgentName"
                :label="$t('agent name') + ' *'"
                stack-label
                @blur="model.Name = capitalize(model.AgentName)"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 1) || $t('agentNameRequired'),
                ]"
              />
              <q-input
                v-model="model.CompanyName"
                :label="$t('company name') + ' *'"
                stack-label
                @blur="model.Name = capitalize(model.CompanyName)"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 1) || $t('companyNameRequired'),
                ]"
              />
            </div>
          </div>
          <div class="col">
            <q-input
              v-model.trim="model.StreetAndNumber"
              :label="$t('street and house number') + ' *'"
              @blur="model.StreetAndNumber = capitalize(model.StreetAndNumber)"
              stack-label
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 1) ||
                  $t('street and house number is required'),
              ]"
            />
            <q-input
              v-model.trim="model.PostalCode"
              :label="$t('postal code') + ' *'"
              @blur="
                async () => {
                  if (model.PostalCode > 0)
                    model.City = await cityByPostalCode(model.PostalCode);
                }
              "
              type="tel"
              stack-label
              lazy-rules="ondemand"
              :rules="[
                async (val) =>
                  (val && !!(await cityByPostalCode(model.PostalCode))) ||
                  $t('invalid postal code'),
              ]"
            />
            <q-input
              v-model.trim="model.City"
              :label="$t('city') + ' *'"
              stack-label
              lazy-rules
              :rules="[
                async (val) =>
                  (val && val.length > 3) || $t('city is required'),
              ]"
            />
          </div>
          <div class="col">
            <q-input
              v-model="model.Phone"
              :label="$t('landline number')"
              type="tel"
              stack-label
            />
            <q-input
              v-model="model.Mobile"
              :label="$t('mobile number')"
              type="tel"
              stack-label
            />
            <q-input
              v-model="model.Email"
              :label="$t('email address')"
              stack-label
              type="email"
            />
          </div>
        </div>

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
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { capitalize, postedSuccessfully } from "src/api/utils";
import { postAction, patchAction } from "src/api/manage";
import { cityByPostalCode } from "src/api/utils";

const props = defineProps({
  modelValue: Object,
  isNew: {
    type: Boolean,
    default: false,
    required: false,
  },
});
const model = ref(
  props.isNew ? { Property: "Privat", Title: "Herr" } : props.modelValue
);
const formRef = ref(null);
const loading = ref(false);
const emit = defineEmits(["update:model-value", "done"]);
const onSubmit = () =>
  formRef.value.validate().then(async (success) => {
    if (success) {
      loading.value = true;
      try {
        const res = props.isNew
          ? await postAction("api/v1/customers", model.value)
          : await patchAction("api/v1/customers/update", model.value);
        if (res) {
          postedSuccessfully(res);
          emit("update:model-value", model.value);
          emit("done", model.value);
        }
      } finally {
        loading.value = false;
      }
    }
  });
</script>
