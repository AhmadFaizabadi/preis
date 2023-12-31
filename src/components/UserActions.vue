<template>
  <div>
    <q-dialog v-model="showChangeRole">
      <change-user-role :user-id="userId" @on-ok="showChangeRole = false" />
    </q-dialog>

    <q-btn-group>
      <q-btn
        v-for="item in actions"
        :key="item.id"
        color="#4036f42e"
        glossy
        text-color="black"
        :label="item.label"
        @click="onAction(item)"
      >
        <q-avatar size="32px" square>
          <img :src="item.img" />
        </q-avatar>
      </q-btn>
    </q-btn-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import ChangeUserRole from "src/components/ChangeUserRole.vue";

const $q = useQuasar();
const showChangeRole = ref(false);
const showExtendTrial = ref(false);

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const onAction = (action) => {
  switch (action.id) {
    case "change_user_role":
      showChangeRole.value = true;
      break;
    case "extend_free_trial":
      showExtendTrial.value = true;
      break;
    case "remove_user":
      $q.dialog({
        title: "Alert",
        message: `remove user ${props.userId}?`,
        cancel: true,
      }).onOk(async () => await removeUser());
      break;
  }
};
const actions = [
  {
    label: "Change user role",
    img: "icons/user-role.png",
    id: "change_user_role",
  },
  {
    label: "Extend free trial",
    img: "icons/reward.png",
    id: "extend_free_trial",
  },
  { label: "Remove user", img: "icons/delete-user.png", id: "remove_user" },
  {
    label: "Add new contact list",
    img: "icons/new-contact.png",
    id: "add_new_contact_list",
  },
  {
    label: "Update contact list",
    img: "icons/edit-property.png",
    id: "update_contact_list",
  },
  {
    label: "Remove contact list",
    img: "icons/remove-list.png",
    id: "remove_contact_list",
  },
  {
    label: "Troubleshooting",
    img: "icons/troubleshooting.png",
    id: "troubleshooting",
  },
  { label: "Resend emails", img: "icons/resend.png", id: "resend_emails" },
];

const removeUser = async () => {
  const res = await api.patch(`api/user/remove/${props.userId}`);
  if (res.status === 204) {
    $q.notify({ type: "positive", message: "user removed successfully." });
    emits("on-ok");
  } else {
    $q.notify({
      type: "negative",
      message: res.data?.errorMessage || "error in removing user",
    });
  }
};
</script>
