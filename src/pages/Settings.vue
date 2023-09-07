<template>
  <q-page padding>
    <div class="text-h6 q-pa-lg">{{ $t("settings") }}</div>
    <q-form @submit="onSubmit" style="max-width: 400px">
      <q-list bordered padding style="height: calc(70vh - 50px)" class="scroll">
        <q-item-label header>{{ $t("general") }}</q-item-label>

        <q-item tag="label" v-ripple>
          <q-item-section side top>
            <q-checkbox v-model="model.autoSendEmail" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t("autoSendEmail") }}</q-item-label>
            <q-item-label caption>
              {{ $t("autoSendEmailCaption") }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>Email</q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("senderEmail") }}</q-item-label>
            <q-item-label caption>
              <q-input
                type="email"
                v-model="model.senderEmail"
                :label="$t('senderEmailCaption')"
                lazy-rules
                :rules="[validateEmail]"
              />
              <q-input
                type="password"
                v-model="model.senderEmailPassword"
                :label="$t('senderEmailPassword')"
                lazy-rules
                :rules="[
                  (val) => validateRequired(val, $t('senderEmailPassword')),
                ]"
              />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item>
          <q-item-section>
            <q-item-label>{{ $t("sentInvoiceFormat") }}</q-item-label>
            <q-item-label caption>
              <q-input
                v-model="model.senderInvoiceHeader"
                :label="$t('sentInvoiceHeader')"
                type="textarea"
                autogrow
              />
              <q-input
                v-model="model.senderInvoiceFooter"
                :label="$t('sentInvoiceFooter')"
                type="textarea"
                autogrow
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="row q-pa-md q-gutter-md">
        <q-btn :label="$t('save')" type="submit" />
        <q-btn :label="$t('cancel')" to="/" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { validateEmail, validateRequired } from "src/api/utils";
import { ref } from "vue";

const model = ref({});
const onSubmit = () => console.log("setting submitted", model.value);
</script>
