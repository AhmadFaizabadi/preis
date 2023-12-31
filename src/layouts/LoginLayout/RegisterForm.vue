<template>
  <div class="fit row">
    <q-card-section class="rounded-borders absolute-center col-sm-12 col-md-3">
      <q-card-section>
        <div class="text-center">
          <img src="/images/logo.png" />
        </div>
        <div class="text-h6 text-center q-mt-md q-mb-xs">{{ $t('invoice') }}</div>
        <q-form @submit="onSubmit" class="q-mt-lg gqa-form">
          <q-input :disable="loading" input-class="latin" outlined dense no-error-icon v-model.trim="form.username"
            rounded color="black" :placeholder="$t('username')" :rules="[
              (val) => (val && val.length > 0) || $t('username is required!'),
            ]" />
          <q-input :disable="loading" outlined dense no-error-icon :type="isPwd ? 'password' : 'text'"
            v-model.trim="form.password" :placeholder="$t('password')" rounded color="black" :rules="[
              (val) => (val && val.length > 0) || $t('password input is required!'),
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <div class="column q-gutter-y-md q-mt-none">
            <q-checkbox :disable="loading" v-model="rememberMe" :label="$t('remember me')" dense
              @update:model-value="changeRememberMe" />
          </div>
          <div class="items-center justify-around q-mt-md row">
            <q-btn rounded glossy :label="$t('signin')" type="submit" color="primary" :loading="loading"
              style="width: 100%" />
          </div>
        </q-form>
        <q-inner-loading :showing="loading" style="background-color: rgba(0, 0, 0, 0)">
          <q-spinner-hourglass color="primary" size="3em" />
        </q-inner-loading>
      </q-card-section>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const isPwd = ref(true);
const form = ref({
  username: "",
  password: "",
});
const userStore = useUserStore();
const rememberMe = ref(true);
const loading = ref(false);
const changeRememberMe = (value) => {
  userStore.ChangeRememberMe(value);
};

const onSubmit = async () => {
  loading.value = true;
  try {
    const res = await userStore.HandleLogin({
      UserName: form.value.username,
      Password: form.value.password,
      RememberMe: rememberMe.value,
    });
    if (res)
      await router.back();
  } finally {
    loading.value = false;
  }
};
</script>
