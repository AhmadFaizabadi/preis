<template>
  <Form ref="form" @submit.prevent="onSubmit">
    <Input v-model.trim="model.UserName" autocomplete="off" :label="$t('userName')"
      :rules="[(v) => required(v, 'userName')]" class="q-pt-md" />
    <Input v-model.trim="model.Password" autocomplete="off" :label="$t('password')"
      :rules="[(v) => required(v, 'password')]" class="q-pt-md" :type="visibility ? 'text' : 'password'">
    <template #append>
      <q-icon :name="visibility ? 'visibility_off' : 'visibility'" class="cursor-pointer"
        @click="visibility = !visibility" />
    </template>
    </Input>
    <div class="q-pt-lg row justify-between">
      <div class="col-6">
        <div class="row">
          <router-link :to="{ name: 'Register' }" class="col-12">
            <span>{{ $t('register') }}</span>
          </router-link>
          <q-btn flat icon="la-unlock-alt" :label="$t('forgottenPassword')" @click="onForgot" />
        </div>
      </div>
      <div class="col-6 text-right">
        <q-btn :label="$t('login')" aria-label="Login" type="submit" :loading="loading" />
      </div>
    </div>
  </Form>
</template>

<script setup>
import { ref } from "vue";
import useValidation from "src/api/validation.js";
// import { extractErrorMessage } from "src/api/utils";
import { useQuasar } from 'quasar'
const { required } = useValidation();
const form = ref(null);
const $q = useQuasar();
const model = ref({ userName: undefined, password: undefined });
const visibility = ref(false);
const router = useRouter();
const onSubmit = async function () {
  const success = form.value.validate();
  if (success) {
    try {
      await store.startup(user.value);
      router.push({ name: "Home" });
    } catch (error) {
      const { caption, message } = extractErrorMessage(error);
      $q.notify({
        type: "negative",
        caption,
        message,
      });
    }
  }
};
</script>
