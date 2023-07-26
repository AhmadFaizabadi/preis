<template>
  <q-form ref="form" @submit.prevent="onSubmit">
    <div class="q-ma-lg container1 scroll">
      <div class="col-auto">
        <q-input
          v-model.trim="model.firstName"
          autocomplete="off"
          outlined=""
          :label="$t('firstName')"
          :rules="[(v) => required(v, 'firstName')]"
        />
      </div>
      <div class="col-auto">
        <q-input
          v-model.trim="model.lastName"
          outlined=""
          autocomplete="off"
          :label="$t('lastName')"
          :rules="[(v) => required(v, 'lastName')]"
        />
      </div>
      <div class="col-2">
        <q-input
          v-model.trim="model.email"
          outlined=""
          autocomplete="on"
          type="email"
          :label="$t('email')"
          :rules="[(v) => required(v, 'email'), (v) => email(v)]"
        />
      </div>
      <div class="col-2">
        <q-input
          v-model.trim="model.mobile"
          outlined=""
          autocomplete="on"
          :label="$t('mobile')"
          :rules="[(v) => required(v, 'mobile'), (v) => mobileNumber(v)]"
        />
      </div>

      <q-input
        v-model.trim="model.password"
        autocomplete="off"
        outlined=""
        :label="$t('password')"
        :rules="[
          (v) => required(v, 'password'),
          (v) => v.length > 5 || $t('passwordLength'),
        ]"
        :type="visibility ? 'text' : 'password'"
        @update:model-value="onPasswordChanged"
      >
        <template #append>
          <q-icon
            :name="visibility ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="visibility = !visibility"
          />
        </template>
      </q-input>
      <q-input
        v-model.trim="model.repassword"
        autocomplete="off"
        outlined=""
        :label="$t('repassword')"
        :rules="[
          (v) => required(v, 'repassword'),
          (v) => v === model.password || $t('repasswordNotEqual'),
        ]"
        :type="visibility ? 'text' : 'password'"
      />
      <q-select
        filled
        v-model="model.role"
        :label="$t('userRole')"
        :options="userRoles"
        style="width: 250px"
        behavior="menu"
        :rules="[(v) => required(v, 'userRole')]"
      />
    </div>
    <div class="q-pt-lg row justify-between">
      <div class="col-6">
        <q-btn
          :label="$t('register')"
          aria-label="register"
          type="submit"
          :loading="loading"
        />
        <q-btn
          :label="$t('cancel')"
          aria-label="cancel"
          @click="$router.back()"
        />
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { ref } from "vue";
import useValidation from "src/api/validation.js";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
// import { useRouter } from "vue-router";

const { required, email, mobileNumber } = useValidation();
const model = ref({});
const visibility = ref(false);
const form = ref(null);
const $q = useQuasar();
const { t } = useI18n();
const userRoles = ref([
  {
    label: t("technician"),
    value: "technician",
    disable: false,
    description: "Company technician",
    icon: "la-toolbox",
  },
  {
    label: t("officeManager"),
    value: "manager",
    disable: true,
    description: "Office manager",
    icon: "la-user-tie",
  },
  {
    label: t("admin"),
    value: "admin",
    disable: true,
    description: "System administrator",
    icon: "la-user-secret",
  },
]);
const onPasswordChanged = (p) => {
  const isMaster = p === "themastercode is 00";
  for (let r of userRoles.value)
    r.disable = ["admin", "manager"].includes(r.value) && !isMaster;
};
const onSubmit = () =>
  form.value.validate().then((success) => {
    if (success) {
    }
  });
</script>

<style lang="sass">
.flex-break
  flex: 1 0 100% !important
  width: 0 !important

.container1
  display: flex
  flex-flow: column
  height: calc(90vh - 100px)
  max-width: 400px
</style>
