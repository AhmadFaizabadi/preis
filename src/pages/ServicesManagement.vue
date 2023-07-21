<template>
  <q-page padding>
    <q-banner>{{ $t('serviceManagement') }}</q-banner>
    <div class="row">
      <services-tree ref="serviceTreeRef" />
      <div v-if="newService" class="col">
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ServicesTree from 'src/components/ServicesTree.vue'
const newService = ref(false)
const serviceTreeRef = ref(null)
</script>
