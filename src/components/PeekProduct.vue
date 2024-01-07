<!-- eslint-disable vue/valid-v-model -->
<template>
  <div class="row no-wrap bg-grey-1" style="height: 100%">
    <div class="col-3">
      <div class="column" style="height: 100%">
        <div class="col-1">
          <div
            class="text-center q-pa-md rounded-borders bg-blue text-white text-h6"
          >
            {{ $t("select products and services") }}
          </div>
          <div>
            <q-btn icon="delete" size="sm" round flat @click="deselectAll()" />
          </div>
        </div>
        <q-list
          v-if="peeked?.length > 0"
          class="col-10 rounded-borders bg-lime-12 text-grey-10 scroll q-pa-lg"
          style="width: 100%"
        >
          <ol>
            <li v-for="p in peeked" :key="p.Id">
              <peek-product-item
                :product="p"
                @dropped="onDropped"
                @entity-updated="onUpdate($event)"
              />
            </li>
          </ol>
        </q-list>
        <div
          v-else
          class="col-10 row justify-center vertical-middle text-h6 text-blue-grey-10"
        >
          {{ $t("please select something ➡️") }}
        </div>
        <div class="col-1 q-pa-md q-gutter-md">
          <q-btn
            icon="check"
            color="primary"
            :label="$t('select')"
            @click="
              $emit(
                'onSelect',
                seeds.filter((f) => f.Selected)
              )
            "
            :disable="peeked?.length === 0"
          />
          <q-btn icon="cancel" :label="$t('cancel')" v-close-popup />
        </div>
      </div>
    </div>
    <div class="col-9">
      <div class="column" style="height: 100%">
        <div class="col-11 row q-gutter-sm scroll">
          <peek-product-item
            v-for="p in products"
            :key="p.Id"
            :product="p"
            @peeked="onPeeked"
          />
        </div>
        <div class="col-1 q-pa-md">
          <q-input
            outlined
            clearable
            v-model="search"
            :placeholder="$t('search')"
            input-class="text-h6"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "stores/product";
import PeekProductItem from "./PeekProductItem.vue";

const emit = defineEmits(["onSelect"]);
const productStore = useProductStore();
const seeds = ref(null);
const products = computed(() =>
  seeds.value?.filter((f) => {
    if (search.value) {
      const parts = search.value.toLowerCase().split(" ");
      return (
        !f.Selected && parts.every((e) => f.Name.toLowerCase().includes(e))
      );
    } else return !f.Selected;
  })
);
const peeked = computed(() => seeds.value?.filter((f) => f.Selected));
const search = ref(null);
const onDropped = (d) => {
  const found = seeds.value?.find((f) => f.Id === d.Id);
  if (found) found.Selected = false;
};

const onPeeked = (d) => {
  const found = seeds.value?.find((f) => f.Id === d.Id);
  if (found) {
    found.Selected = true;
    found.Entity = d.Entity;
  }
};
const onUpdate = (p) => {
  const found = seeds.value?.find((f) => f.Id === p.Id);
  if (found) {
    found.Entity = p.Entity;
  }
};
onMounted(async () => {
  await productStore.getListProducts();
  seeds.value = [...productStore.listProducts];
});
const deselectAll = () => {
  peeked.value.forEach((p) => {
    const f = seeds.value?.find((f) => f.Id === p.Id);
    if (f) f.Selected = false;
  });
  search.value = undefined;
};
</script>
