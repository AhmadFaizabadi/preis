<template>
  <q-card style="width: 100%">
    <q-card-section>
      <div class="text-h6">
        {{ isNew ? $t("newCustomer") : $t("editCustomer") }}
      </div>
    </q-card-section>
    <q-form @submit="onSubmit" class="q-gutter-md" autofocus>
      <q-card-section>
        <q-input
          name="name"
          v-model="model.name"
          :label="$t('name')"
          stack-label
          autofocus
          @blur="capitalizeName"
        />
        <q-input
          name="phone"
          v-model="model.phone"
          :label="$t('phone')"
          stack-label
          type="tel"
        />
        <q-input
          name="email"
          v-model="model.email"
          label="Email"
          stack-label
          type="email"
        />
        <c-address
          v-model:addresses="model.addresses"
          v-model:selected="model.selectedAddress"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat type="submit">{{ $t("save") }}</q-btn>
        <q-btn flat v-close-popup>{{ $t("cancel") }}</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import CAddress from "src/components/Address.vue";
const props = defineProps({
  modelValue: Object,
  isNew: Boolean,
});
const model = ref({ ...props.modelValue });
const emit = defineEmits(["update:model-value"]);
const onSubmit = () => {
  emit("update:model-value", model.value);
};
const capitalizeName = () => {
  if (!model.value?.name) return;
  const name = model.value.name
    .split(" ")
    .reduce((t, c) => (t += c.charAt(0).toUpperCase() + c.slice(1) + " "), "")
    .trim();
  model.value.name = name;
};
</script>
