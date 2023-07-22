<template>
  <q-splitter v-model="splitterModel" style="height: 70vh">

    <template v-slot:before>
      <div class="q-pa-md">
        <q-input ref="filterRef" filled v-model="filter" label="Search - type in some letters ...">
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          </template>
        </q-input>

        <q-tree ref="treeRef" :nodes="services.items" node-key="fullName" accordion :filter="filter"
          :filter-method="myFilterMethod" v-model:selected="selected">
          <template v-slot:default-header="prop">
            <div :class="prop.node.children ? 'text-weight-bold' : ''">

              <q-icon :name="prop.node.icon" class="q-mr-md" :size="prop.node.children ? 'md' : 'sm'"
                :color="prop.node.children ? 'deep-orange' : 'blue-14'" />{{ prop.node.label }}
              <q-popup-proxy>
                <div class="row q-gutter-sm bg-teal-11 text-black">{{ prop.color }}
                  <q-btn flat dense icon="las la-folder-plus"><q-tooltip>{{ $t('newCategoryOrService')
                  }}</q-tooltip>
                    <q-popup-edit v-model="prop.node" :validate="val => val.length > 5">
                      <new-service v-model="prop.node" is-new @on-save="onNew(prop.node, $event)" />
                    </q-popup-edit>
                  </q-btn>
                  <q-btn flat dense icon="las la-edit"><q-tooltip>{{ $t('editTitle') }}</q-tooltip>
                    <q-popup-edit v-model="prop.node" :validate="val => val.length > 5">
                      <new-service v-model="prop.node" @on-save="onEdit(prop.node, $event)" />
                    </q-popup-edit>
                  </q-btn>
                  <q-btn flat dense icon="las la-trash" @click="onDelete(prop.node)"><q-tooltip>{{
                    $t('deleteCategoryOrService')
                  }}</q-tooltip></q-btn>
                </div>
              </q-popup-proxy>
            </div>
          </template>
        </q-tree>
      </div>
    </template>

    <template v-slot:after>
      <div class="q-pa-md">
        <div class="text-h4 q-mb-md">After</div>
        <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda
          consectetur culpa fuga nulla ullam. In, libero.</div>
      </div>
    </template>

  </q-splitter>
</template>

<script setup>
import { ref } from 'vue'
import { services } from 'src/data/demoServices'
import NewService from 'src/components/NewService.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $q = useQuasar()
const filter = ref('')
const selected = ref('')
const filterRef = ref(null)
const treeRef = ref(null)
const splitterModel = ref(50)
const myFilterMethod = (node, filter) => {
  const filt = filter.toLowerCase().split(' ')
  const found = filt.every(e => node.fullName.indexOf(e) > -1)
  if (found) {
    treeRef.value.setExpanded(node.fullName, true)
    for (const p of findAllParents(services.items, node.fullName))
      treeRef.value.setExpanded(p, true)
    // treeRef.value.setTicked(node.fullName, true)
    selected.value = node.fullName
    // const rootNode = getRootNode(treeRef.value, node)
    // console.log('root node is ', rootNode)
  }
  return found
}
const resetFilter = () => {
  filter.value = ''
  treeRef.value.collapseAll()
  filterRef.value.focus()
}


function findAllParents(tree, nodeFullName, parentList = []) {
  for (const item of tree) {
    if (item.fullName === nodeFullName) {
      return parentList;
    } else if (item.children) {
      parentList.push(item.fullName);
      const result = findAllParents(item.children, nodeFullName, parentList);
      if (result) {
        return result;
      }
      parentList.pop();
    }
  }
  return null;
}

defineExpose({ selected })

const onEdit = (node, e) => {
  node.label = e.label
  node.icon = e.icon
  const p = findAllParents(services.items, node.fullName)
  if (p.length > 0)
    treeRef.value.setExpanded(p[0], true)
}

const onNew = (node, e) => {
  if (!('children' in node))
    node.children = []
  node.children.push({ ...e, fullName: node.fullName + '-' + e.label.toLowerCase() })
  const p = findAllParents(services.items, node.fullName)
  if (p.length > 0)
    treeRef.value.setExpanded(p[0], true)
  treeRef.value.setExpanded(node.fullName, true)
}

function onDelete(node) {
  let msg = 'children' in node ? t('nodeHasChildRemovingWarning') : ''
  msg += t('areYouSureForDeletion')
  $q.dialog({
    title: t('deleteConfirm') + ' ' + node.fullName,
    message: msg,
    cancel: true,
    persistent: true
  }).onOk(() => {
    const p = findAllParents(services.items, node.fullName)
    if (p.length > 0) {
      const children = treeRef.value.getNodeByKey(p.at(-1)).children
      children.splice(children.findIndex(f => f.fullName === node.fullName), 1)
      treeRef.value.setExpanded(p[0], true)
    } else {
      services.items.splice(services.items.findIndex(f => f.fullName === node.fullName), 1)
    }
  })
}
</script>
<style lang="sass" scoped>

.flex-break
  flex: 1 0 100% !important
</style>
