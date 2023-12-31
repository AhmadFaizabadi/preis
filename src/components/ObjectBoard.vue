<template>
  <ul>
    <div class="column q-gutter-md" style="width: 100%;max-height:300px">
      <li v-for=" i in Object.entries(object)" :key="i[0]" @click="copyIt(`${i[0]}: ${i[1]}`)" class="col-2">
        <div>{{ i[0] }}</div>
        <div class="q-pl-md text-bold" v-html="i[1]" />
      </li>
    </div>
  </ul>
  <q-tooltip no-parent-event transition-show="scale" transition-hide="scale" v-model="showing" :hide-delay="2000">{{
    $t('clipboardCopied') }}</q-tooltip>
</template>

<script setup>
import { ref } from "vue";
import { copyToClipboard } from "quasar";

const showing = ref(false);
defineProps({
  object: Object,
});
const copyIt = (t) => {
  copyToClipboard(t);
  showing.value = true;
  setTimeout(() => (showing.value = false), 2000);
};
</script>

<style lang="sass" scoped>
li:hover
  background-color: #325bf24f
  border-radius: 5px
  cursor: pointer
  text-shadow: 1px 1px 3px $blue-grey
</style>
