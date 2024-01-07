<template>
  <q-img :src="src" :width="`${width}px`" fit="scale-down">
    <slot />
  </q-img>
</template>

<script setup>
import { ref, watch } from "vue";
import { getBlobAction } from "src/api/manage";

const props = defineProps({
  id: Number,
  fullSize: {
    type: Boolean,
    default: false,
    required: false,
  },
  width: {
    type: Number,
    default: 70,
    required: false,
  },
});
const src = ref(null);
watch(
  () => props.id,
  async (id) => {
    if (!id) return;
    const res = await getBlobAction(
      `api/v1/product/${props.fullSize ? "image" : "thumbnail"}/${props.id}`
    );
    src.value = URL.createObjectURL(res);
  },
  { immediate: true }
);
</script>
