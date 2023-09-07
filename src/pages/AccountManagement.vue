<template>
  <q-page padding>
    <q-dialog v-model="showNewUser">
      <new-user
        v-model="user"
        :is-new="isNewUser"
        @update:model-value="onUpdateUser"
      />
    </q-dialog>
    <div class="row">
      <q-btn :label="$t('newUser')" @click="onNewUser" />
      <q-btn :label="$t('editUser')" @click="onEditUser" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NewUser from "src/components/NewUser.vue";

const user = ref({});
const users = ref([]);
const isNewUser = ref(false);
const showNewUser = ref(false);
const onNewUser = () => {
  isNewUser.value = true;
  showNewUser.value = true;
};
const onUpdateUser = (u) => {};
onMounted(() => {});
</script>
