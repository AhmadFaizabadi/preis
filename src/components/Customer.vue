<template>
  <q-select filled v-model="model" :options="customers" stack-label :label="$('customer')"
    :display-value="`${model ? model.name : '*none*'}`">
    <template v-slot:append>
      <q-icon class="cursor-pointer" name="la-plus-circle" @click.stop.prevent="newCustomer = true" />
    </template>
  </q-select>
</template>

<script setup>
import { ref } from 'vue'
const newCustomer = ref(false)
</script>
