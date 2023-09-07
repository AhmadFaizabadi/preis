<template>
  <q-form class="q-gutter-md" @submit="onSubmit">
    <q-input
      autofocus
      v-model="model.name"
      :label="$t('name')"
      lazy-rules
      :rules="[(val) => validateRequired(val, $t('name'))]"
    />
    <q-input
      v-model="model.userName"
      :label="$t('userName')"
      lazy-rules
      :rules="[
        (val) => validateRequired(val, $t('name')),
        (val) => val.length > 3 || $t('invalidUsername'),
      ]"
    />
    <q-select :options="roles" v-model="model.role" :label="$t('userRole')" />
    <q-input v-model="model.email" type="email" :label="$t('email')" />
    <q-input v-model="model.password" type="password" :label="$t('password')" />
    <div class="row">
      <q-btn :label="$t('save')" type="submit" />
      <q-btn :label="$t('cancel')" v-close-popup />
    </div>
  </q-form>
</template>

<script setup>
import { validateRequired } from "src/api/utils";
import { ref } from "vue";

const props = defineProps({
  modelValue: Object,
  isNew: Boolean,
});

const model = ref({ ...modelValue });
const emit = defineEmits(["update:model-value"]);
const onSubmit = () => {
  emit("update:model-value", model.value);
};
</script>
