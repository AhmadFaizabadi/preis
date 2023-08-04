<template>
  <component
    :is="nodeType === 'price' ? NewPrice : NewService"
    :is-new="isNew"
    @on-save="$emit('on-save', { nodeType, isNew, event: $event })"
  />
</template>

<script setup>
import NewService from "src/components/NewSupply.vue";
import NewPrice from "src/components/NewPrice.vue";
defineProps({
  nodeType: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
});
defineEmits(["on-save"]);
</script>
