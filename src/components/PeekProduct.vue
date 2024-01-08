<!-- eslint-disable vue/valid-v-model -->
<template>
  <div class="row no-wrap bg-grey-1" style="height: 100%">
    <div class="col-2">
      <div class="column" style="height: 100%">
        <div class="col-2 column">
          <div
            class="col text-center q-pb-lg bg-blue text-white text-subtitle1 text-overline"
          >
            {{ $t("select products and services") }}
          </div>
          <div class="col">
            <q-btn icon="delete" size="sm" round flat @click="deselectAll()" />
          </div>
        </div>
        <q-list
          v-if="peeked?.length > 0"
          class="col-8 bg-grey-2 text-grey-10 scroll q-pa-lg"
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
    <div class="col-10">
      <div class="column" style="height: 100%">
        <div class="col-1 row q-gutter-md items-center justify-center">
          <div class="justify-center">{{ $t("sorted by") }}</div>
          <q-btn-toggle
            v-model="sortedOn"
            toggle-color="primary"
            :options="[
              { label: 'Category', value: 'Category' },
              { label: 'Power', value: 'Power' },
              { label: 'Name', value: 'Name' },
            ]"
          />
        </div>
        <div class="col-10 row q-gutter-md scroll q-pa-md justify-center">
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
            ><template #prepend><q-icon name="search" /></template>
          </q-input>
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
const sortedOn = ref("Category");
const products = computed(() =>
  seeds.value
    ?.filter((f) => {
      if (search.value) {
        const parts = search.value.toLowerCase().replace("-", " ").split(" ");
        return (
          !f.Selected && parts.every((e) => f.Name.toLowerCase().includes(e))
        );
      } else return !f.Selected;
    })
    ?.sort((a, b) =>
      String(a[sortedOn.value]).localeCompare(String(b[sortedOn.value]))
    )
);
const peeked = computed(() =>
  seeds.value?.filter((f) => f.Selected).sort((a, b) => b.Entity - a.Entity)
);
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
