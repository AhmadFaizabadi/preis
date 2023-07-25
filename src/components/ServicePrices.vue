<template>
  <q-list bordered class="rounded-borders" style="max-width: 350px">
    <template v-for="p in servicePrices" :key="p.priceName">
      <q-item clickable v-ripple @click="$emit('on-select', { serviceName: serviceName, price: p })">
        <q-popup-proxy v-if="editable" context-menu>
          <div class="row q-gutter-sm bg-blue-grey-14 text-white">
            <q-btn flat dense icon="las la-edit"><q-tooltip>{{ $t('editPrice') }}</q-tooltip>
              <q-popup-proxy>
                <new-price :price="p" @on-save="onEdit($event)" />
              </q-popup-proxy>
            </q-btn>
            <q-btn flat dense icon="las la-trash" @click="onDelete(p)"><q-tooltip>{{
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
    <q-item v-if="editable" clickable v-ripple>
      <q-item-section>
        {{ $t('newPrice') }}
      </q-item-section>
      <q-item-section side>
        <q-icon name="las la-plus-circle" color="green" />
      </q-item-section>
      <q-popup-proxy class="fixed-center">
        <new-price @on-save="onNew($event)" is-new />
      </q-popup-proxy>
    </q-item>
  </q-list>
</template>

<script setup>
import { prices } from 'src/data/demoPrices';
import { computed, reactive } from 'vue';
import NewPrice from 'src/components/NewPrice.vue'
const props = defineProps({
  serviceName: String,
  editable: {
    type: Boolean,
    default: false
  }
})
defineEmits(['on-select'])
const thePrices = reactive(prices.items)
const onNew = (p) => {
  thePrices.push({ ...p, serviceName: props.serviceName })
}
const onEdit = (p) => {
  for (let e of thePrices)
    if (e.serviceName === p.serviceName && e.priceName === p.priceName) {
      e.unitName = p.unitName
      e.unitValue = p.unitValue
      break
    }
  // const found = thePrices.find(f => f.priceName === p.priceName)
  // console.log('found is', found)
  // if (found)
  //   found = { ...p }
  // thePrices.push({ ...p, serviceName: props.serviceName })
}
const servicePrices = computed(() => thePrices.filter(f => f.serviceName === props.serviceName))
</script>
