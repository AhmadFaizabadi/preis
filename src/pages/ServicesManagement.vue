<template>
  <q-page padding>
    <q-banner>{{ $t('serviceManagement') }}</q-banner>
    <q-toolbar>
      <q-btn no-caps right-icon="plus-circle" @click="onNewService">{{ $t('newService') }}</q-btn>
    </q-toolbar>
    <div class="row">
      <services-tree ref="serviceTreeRef" />
      <div v-if="newService" class="col">
        <div class="q-pa-md">
          <q-btn no-caps :label="$t('reset')" push color="white" text-color="primary" @click="step = 1" class="q-mb-md" />

          <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated keep-alive>
            <q-step :name="1" :title="$t('selectCategory')" icon="caret-square-right"
              :done="!!$refs['serviceTreeRef'].selected || newCategory" header-nav>
              {{ $t('selectCategoryDesc') }}
              <q-checkbox v-model="newCategory" :label="$t('newCategory')" color="teal" />
              <q-stepper-navigation>
                <q-btn @click="() => { done1 = true; step = 2 }" color="primary" :label="$t('continue')" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="2" :title="$t('selectServiceName')" :caption="$t('chooseServiceNameDesc')" icon="question"
              :done="step > 2" :header-nav="step > 2">
              <p>{{ $t('chooseServiceNameDesc') }}</p>
              <q-input outlined v-model="newServiceName" :label="$t('serviceName')" stack-label />

              <q-stepper-navigation>
                <q-btn @click="() => { done2 = true; step = 3 }" color="primary" :label="$t('continue')" />
                <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>

            <q-step :name="3" title="Create an ad" icon="add_comment" :header-nav="step > 3">
              Try out different ad text to see what brings in the most customers, and learn how to
              enhance your ads using features like ad extensions. If you run into any problems with
              your ads, find out how to tell if they're running and how to resolve approval issues.

              <q-stepper-navigation>
                <q-btn color="primary" @click="done3 = true" :label="$t('finish')" />
                <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ServicesTree from 'src/components/ServicesTree.vue'
const newService = ref(false)
const newServiceName = ref(null)
const newCategory = ref(false)
const serviceTreeRef = ref(null)
const step = ref(1)
const onNewService = () => {
  newService.value = true
}
</script>
