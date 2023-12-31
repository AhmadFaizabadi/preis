<template>
  <q-card class="my-card bg-grey-12 q-pa-md">
    <q-form ref="formRef" @submit="onSubmit">
      <q-card-section>
        <div class="text-h6">
          {{ isNew ? $t("newAddress") : $t("editAddress") }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <q-input v-model="model.Name" :label="$t('name')" stack-label autofocus="" hint="Example: home" lazy-rules
            :rules="[
              (val) => (val && val.length > 1) || $t('address name is required!'),
            ]" />
          <q-input v-model="model.City" :label="$t('city')" stack-label hint="Example: Berlin"
            @blur="model.City = capitalize(model.City)" lazy-rules :rules="[
              (val) => (val && val.length > 1) || $t('city name is required'),
            ]" />
          <q-input color="purple-12" v-model="model.AddressText" :label="$t('address')" type="textarea" lazy-rules :rules="[
            (val) => (val && val.length > 1) || $t('address text is required!'),
          ]">
            <template v-slot:prepend>
              <q-icon name="las la-address-card" />
            </template>
          </q-input>
          <q-input color="purple-12" v-model="model.PostalCode" :label="$t('postal code')" type="tel">
            <template v-slot:prepend>
              <q-icon name="las la-map-marked" />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn type="submit" :label="$t('save')" />
        <q-btn :label="$t('cancel')" v-close-popup />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { uuidv4, capitalize } from "src/api/utils";

const props = defineProps({
  modelValue: Object,
  isNew: Boolean,
});
const emit = defineEmits(["update:model-value"]);
const formRef = ref(null);
const model = ref(props.isNew ? { Id: uuidv4(), Name: "home" } : { ...props.modelValue });

const onSubmit = () => formRef.value.validate().then(success => {
  if (success) emit("update:model-value", model.value);
})
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
</style>
