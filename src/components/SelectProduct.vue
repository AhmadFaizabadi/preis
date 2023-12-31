<template>
  <q-select transition-show="flip-up" transition-hide="flip-down" filled use-input option-value="Name" v-model="model"
    input-debounce="0" :options="options" stack-label :label="$t('product')" :display-value="model?.Name"
    :loading="loading" @filter="filterFn">
    <template v-slot:option="{ itemProps, opt }">
      <q-item v-bind="itemProps" style="max-width: 350px;">
        <q-item-section>
          <q-item-label>{{ opt.Name }}</q-item-label>
          <q-item-label caption lines="4">
            <div v-html="opt.Description" />
          </q-item-label>
        </q-item-section>
        <q-item-section side><product-image :id="opt.Id" />
        </q-item-section>
      </q-item>
    </template>

  </q-select>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import ProductImage from './ProductImage.vue';
import { getAction } from 'src/api/manage';

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(["update:model-value"]);
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:model-value", v)
})
let products = []
const options = ref([])
const loading = ref(false);
const filterFn = (val, update) => {
  update(() => {
    const needle = val?.trim().toLocaleLowerCase().split(' ')
    options.value = products.filter(f => needle.every(e => f.Name.toLocaleLowerCase().indexOf(e) > -1))
  })
};

onBeforeMount(async () => {
  loading.value = true;
  try {
    products = await getAction('api/v1/product/list/active')
  }
  finally {
    loading.value = false;
  }
})

onMounted(() => options.value = products)
</script>
