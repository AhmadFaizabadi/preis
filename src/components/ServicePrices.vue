<template>
  <q-list bordered class="rounded-borders" style="max-width: 350px">
    <q-item clickable v-ripple>
      {{ $t('newPrice') }}
      <q-popup-proxy>
        <new-price @on-save="onNew($event)" is-new />
      </q-popup-proxy>
    </q-item>
    <template v-for="p in servicePrices" :key="p.priceName">
      <q-item clickable v-ripple>
        <q-popup-proxy v-slot="dPrice">
          <div class="row q-gutter-sm bg-blue-grey-14 text-white">
            <q-btn flat dense icon="las la-edit"><q-tooltip>{{ $t('editPrice') }}</q-tooltip>
              <q-popup-edit v-model="dPrice.value">
                <new-price v-model="dPrice.value" @on-save="onEdit(dPrice, $event)" />
              </q-popup-edit>
            </q-btn>
            <q-btn flat dense icon="las la-trash" @click="onDelete(prop.node)"><q-tooltip>{{
              $t('deleteCategoryOrService')
            }}</q-tooltip></q-btn>
          </div>
        </q-popup-proxy>
        <q-item-section>
          <q-item-label lines="2">{{ p.priceName }}</q-item-label>
        </q-item-section>

        <q-item-section side top>

          <q-item-label>{{ p.unitValue.toLocaleString() }}<q-icon name="las la-euro-sign"
              color="orange-14" /></q-item-label>
          {{ p.unitName }}
        </q-item-section>
      </q-item>

      <q-separator inset="item" />
    </template>
  </q-list>
</template>

<script setup>
import { prices } from 'src/data/demoPrices';
import { computed } from 'vue';
import NewPrice from 'src/components/NewPrice.vue'
const props = defineProps({
  serviceName: String
})
const onNew = (p) => {
  prices.items.push({ ...p, serviceName: props.serviceName })
  console.log('prices are', prices.items)
}
const servicePrices = computed(() => prices.items.filter(f => f.serviceName === props.serviceName))
</script>
