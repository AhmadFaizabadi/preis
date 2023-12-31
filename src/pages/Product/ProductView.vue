<template>
  <q-page padding>
    <div class="row q-pa-lg q-gutter-lg">
      <div class="text-h6">{{ product.Name }}</div>
      <product-image :id="product?.Id" />
    </div>
    <object-board :object="product" />
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue';
import ObjectBoard from 'src/components/ObjectBoard.vue';
import ProductImage from 'components/ProductImage.vue';
import { getAction } from 'src/api/manage';
import { useRoute } from 'vue-router';

const product = ref({})
const $route = useRoute()
watch(() => $route.params.id, async (id) => {
  if (id) product.value = await getAction(`api/v1/product/${id}`)
}
  , { immediate: true })
</script>
