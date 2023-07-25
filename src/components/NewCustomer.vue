<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ isNew ? $t('newCustomer') : $t('editCustomer') }}</div>
    </q-card-section>

    <q-card-section>
      <q-input v-model="model.name" :label="$t('name')" stack-label />
      <q-input v-model="model.phone" :label="$t('phone')" stack-label type="tel" />
      <q-input v-model="model.email" label="Email" stack-label type="email" />
      <c-address v-model="customerAddress" />
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat v-close-popup @click="$emit('update:model-value', model)">{{ $t('save') }}</q-btn>
      <q-btn flat v-close-popup>{{ $t('cancel') }}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import CAddress from 'src/components/Address.vue'
const props = defineProps({
  modelValue: Object,
  isNew: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:model-value'])
const model = ref(props.modelValue)
const customerAddress = ref(props.modelValue.Address || [])
</script>
