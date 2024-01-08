<template>
  <template v-if="model.Selected">
    <q-item>
      <q-item-section
        ><q-item-label>
          {{ model.Name }}
        </q-item-label>

        <q-item-label caption>{{ model.Category }} </q-item-label>
      </q-item-section>
      <q-item-section side top
        ><q-btn
          size="xs"
          flat
          dense
          icon="delete"
          @click.stop="onDeselect"
        /><q-avatar
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
  <q-card v-else class="my-card">
    <div class="column no-wrap">
      <div class="col row q-gutter-xs q-pa-sm no-wrap">
        <product-image class="col-1" :id="model.Id" :width="50" />
        <div class="col-10 column q-pt-lg">
          <div>
            {{ model.Name }}
          </div>
          <div class="text-small">{{ model.Category }}</div>
        </div>
      </div>
      <div class="col select-bar">
        <q-input
          dense
          input-class="text-right"
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
  height: 130px
  max-width: 220px
.select-bar
  display: none
.my-card:hover
  background-color: $lime-13
.my-card:hover .select-bar
  display: block
</style>
