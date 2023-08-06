<template>
  <q-card class="my-card bg-grey-12 q-pa-md">
    <q-card-section>
      <div class="text-h6">
        {{ isNew ? $t("newAddress") : $t("editAddress") }}
      </div>
    </q-card-section>
    <q-card-section>
      <div class="q-pa-md">
        <q-input
          v-model="model.name"
          :label="$t('name')"
          stack-label
          autofocus=""
        />
        <q-input
          color="purple-12"
          v-model="model.address"
          :label="$t('address')"
          type="textarea"
        >
          <template v-slot:prepend>
            <q-icon name="las la-address-card" />
          </template>
        </q-input>
        <q-input
          color="purple-12"
          v-model="model.postalCode"
          :label="$t('postalCode')"
          type="tel"
        >
          <template v-slot:prepend>
            <q-icon name="las la-map-marked" />
          </template>
        </q-input>
      </div>
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
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  modelValue: Object,
  isNew: Boolean,
});
defineEmits(["update:model-value"]);
const model = ref(props.isNew ? {} : { ...props.modelValue });
</script>

<style lang="sass" scoped>
.my-card
  max-width: 650px
</style>
