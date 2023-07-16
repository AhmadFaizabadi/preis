<template>
  <div class="q-pa-md q-gutter-sm" style="min-width: 400px;">
    <q-input ref="filterRef" filled v-model="filter" label="Search - type in some letters ...">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>

    <q-tree ref="treeRef" :nodes="services.items" node-key="fullName" :filter="filter" :filter-method="myFilterMethod"
      v-model:selected="selected" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { services } from 'src/data/demoServices'

const filter = ref('')
const selected = ref('')
const filterRef = ref(null)
const treeRef = ref(null)
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

</script>
