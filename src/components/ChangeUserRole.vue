<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">Change user role</div>
    </q-card-section>
    <q-card-section>
      <q-form class="justify-center q-gutter-md" @submit="onSubmit">
        <q-select autofocus label="user role" transition-show="flip-up" transition-hide="flip-down" filled
          v-model="roleName" :options="allRoles" style="width: 250px" />
        <q-btn v-close-popup label="cancel" />
        <q-btn type="submit" label="change role" />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios';

const props = defineProps({
  userId: {
    type: Number,
    required: true
  },
})
const roleName = ref("")
const allRoles = ref([])
let prvRoleName = ""
const $q = useQuasar()
const emits = defineEmits(['on-ok'])
const onSubmit = async () => {
  if (roleName.value === prvRoleName) {
    $q.notify({ type: 'negative', message: 'user\'s role has not been changed!' })
    return
  }
  const res = await api.patch(`api/user/role/${props.userId}/${roleName.value}`)
  if (res.status === 204) {
    $q.notify({ type: 'positive', message: 'user role changed successfully.' })
    emits("on-ok")
  } else {
    $q.notify({ type: 'negative', message: res.data?.errorMessage || 'error in changing user\'s role' })
  }
}
onMounted(async () => {
  let res = await api.get('api/user/roles/all')
  allRoles.value = res.data
  res = await api.get(`api/user/role/${props.userId}`)
  roleName.value = res.data
  prvRoleName = res.data
})
</script>
