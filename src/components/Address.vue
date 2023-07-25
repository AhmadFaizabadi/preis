<template>
  <q-list>
    <template v-for="adr in model.items" :key="adr.name">
      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label overline>{{ adr.name }}</q-item-label>
          <q-item-label>{{ adr.address }}</q-item-label>
          <q-item-label caption>{{ adr.postalCode }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
    </template>
    <q-item clickable v-ripple>
      <q-item-section>
        {{ $t('newAddress') }}
      </q-item-section>
      <q-item-section side>
        <q-icon name="las la-plus-circle" color="green" />
      </q-item-section>
      <q-popup-proxy class="fixed-center">
        <new-address :model-value="newAddress" @update:model-value="model.push($event)" is-new />
      </q-popup-proxy>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from 'vue'
import NewAddress from 'src/components/NewAddress.vue'
const props = defineProps({
  modelValue: Object
})
defineEmits(['update:model-value'])
const model = ref(props.modelValue)
const newAddress = { name: '', address: '', postalCode: 0 }
</script>
