<template>
  <q-page padding>
    {{ undelete }}
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">{{ $t(`${undelete ? 'enable' : 'disable'}`) }} ⚠️</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ model.Name }}</div>
          <div class="text-caption text-grey">
            {{ model.Description }}
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <product-image full-size width="400" :id="model.Id" />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat color="red" :icon="`${undelete ? 'mdi-camera-retake-outline' : 'mdi-delete-circle-outline'}`"
          :label="$t(`${undelete ? 'enable' : 'disable'}`)" @click="onDelete" />
        <q-btn flat color="primary" :label="$t('cancel')" to=".." />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

import ProductImage from 'components/ProductImage.vue';
import { getAction, deleteAction } from 'src/api/manage';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const $q = useQuasar()
const model = ref({})
const $route = useRoute()
const undelete = computed(() => $route.path.toLowerCase().includes('undelete'))
const $router = useRouter()

const onDelete = () => {
  $q.dialog({
    title: t('confirm'),
    message: t(`would you like to ${undelete.value ? 'enable' : 'disable'} this product?`),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const res = await deleteAction(`api/v1/product/${undelete.value ? 'undelete/' : ''}${model.value.Id}`)
    $q.notify({ type: 'positive', message: res })
    await $router.push('..')
  })
}
watch(() => $route.params.id, async (id) => {
  if (id) model.value = await getAction(`api/v1/product/${id}`)
}
  , { immediate: true })
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
