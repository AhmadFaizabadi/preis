<template>
  <q-card class="my-card bg-grey-3 text-black q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-card-section class="q-gutter-md">
        <select-service v-if="isService" v-model="model.Supply" />
        <select-product v-else v-model="model.Product" />
        <q-editor v-if="model.Product" v-model="model.Product.Description" min-height="5rem" max-height="10rem"
          content-class="text-smaller" :toolbar="[['left', 'center', 'right', 'justify', 'bold', 'italic', 'underline', 'strike'],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent']]" />
        <q-input ref="entityRef" outlined :label="$t('entity') + ' *'" v-model="model.Entity" type="number" lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || $t('entityRequired'),
            (val) => val > 0 || $t('entityNotValid'),
          ]" />
        <q-input outlined="" :label="$t('note')" v-model="model.Note" type="textarea" autogrow />
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn type="submit" :label="$t('save')" icon="save" />
        <q-btn :label="$t('cancel')" v-close-popup />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useInvoiceStore } from "src/stores/invoice";
import SelectService from "components/SelectService.vue";
import SelectProduct from "components/SelectProduct.vue";

const { uuidv4 } = useInvoiceStore();

const props = defineProps({ modelValue: Object, isNew: Boolean, isService: Boolean });
const emit = defineEmits(["update:model-value"]);
const model = ref(props.isNew ? {} : { ...props.modelValue });
const entityRef = ref(null);
if (props.isNew) model.value.Id = uuidv4().split("-").at(-1);

const onSubmit = () => {
  emit("update:model-value", model.value);
};
</script>

<style lang="sass" scoped>
.my-card
  width: 350px
</style>
