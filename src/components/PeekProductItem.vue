<template>
  <template v-if="model.Selected">
    <q-item>
      <q-item-section avatar><product-image :id="model.Id" /> </q-item-section>
      <q-item-section caption lines="3">{{ model.Name }} </q-item-section>
      <q-item-section side
        ><q-avatar
          color="deep-purple-2"
          text-color="white"
          class="cursor-pointer"
          square=""
        >
          {{ model.Entity }}
          <q-popup-edit v-model="model.Entity" v-slot="scope">
            <q-input
              v-model="scope.value"
              dense
              @keyup.enter="
                scope.set();
                if (!scope.value) onDeselect();
                $emit('entity-updated', { Id: model.Id, Entity: scope.value });
              "
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </q-popup-edit>
        </q-avatar>
      </q-item-section>
    </q-item>
    <q-separator spaced inset />
  </template>
  <q-card v-else class="my-card" flat bordered>
    <product-image :id="model.Id" :width="200" full-size />
    <div class="column q-pa-xl absolute-bottom">
      <div class="text-subtitle1">{{ model.Name }}</div>
      <div class="text-subtitle2">{{ model.Category }}</div>
    </div>
    <div class="absolute-bottom-right" style="right: 0">
      <q-input
        standout=""
        dense=""
        style="width: 80px"
        v-model="model.Entity"
        :placeholder="$t('Entity')"
        lazy-rules
        :rules="[(r) => r > 0 || $t('required!')]"
        @keyup.enter="onSelect()"
        ><template #after>
          <q-btn flat round color="accent" icon="check" @click="onSelect" />
        </template>
      </q-input>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import ProductImage from "./ProductImage.vue";

const props = defineProps({
  product: Object,
});
const model = ref({ ...props.product, Entity: props.product?.Entity || "1" });
const emit = defineEmits(["peeked", "dropped", "entity-updated"]);
const onSelect = () => {
  model.value.Selected = true;
  emit("peeked", model.value);
};
const onDeselect = () => {
  model.value.Selected = false;
  emit("dropped", model.value);
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  height: 300px
  max-width: 250px

.my-card:hover
  background-color: $lime-13
</style>
