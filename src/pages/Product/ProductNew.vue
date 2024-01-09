<template>
  <q-page padding>
    <q-form ref="form" @submit="onSubmit">
      <div class="row q-gutter-md" style="max-height: 70vh">
        <q-input
          class="col-md-3 col-sm-12"
          v-model="model.Name"
          :label="$t('name')"
          :rules="[(val) => !!val || 'Field is required']"
          lazy-rules
        />
        <q-input v-model="model.Brand" :label="$t('brand')" />
        <q-input v-model="model.Category" :label="$t('category')" />
        <q-input
          v-model.number="model.Power"
          :label="$t('power') + ' (kw)'"
          type="number"
        />
        <div class="flex-break" />
        <q-input v-model="model.Url" :label="$t('URL')" />
        <q-input v-model="model.Tags" :label="$t('tags')" />
        <div class="flex-break" />
        <q-editor
          :placeholder="$t('description')"
          :toolbar="toolbar"
          v-model="model.Description"
          min-height="8rem"
          height="100px"
          content-class="scroll"
        />
        <div class="flex-break" />
        <q-file
          ref="fileRef"
          style="max-width: 300px"
          v-model="model.Image"
          rounded
          :label="$t('image')"
          accept=".jpg, image/*"
        />
        <q-img :src="imageSource" width="200px" height="100px" />
      </div>
      <div class="flex-break" />
      <div>
        <q-btn
          :label="$t('save')"
          type="submit"
          color="primary"
          :loading="loading"
        />
        <q-btn
          :label="$t('cancel')"
          @click="goBack()"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getAction,
  getBlobAction,
  postAction,
  patchAction,
} from "src/api/manage";
import { postedSuccessfully } from "src/api/utils";

const $route = useRoute();
const $router = useRouter();
const model = ref({});
const form = ref(null);
const fileRef = ref(null);
const loading = ref(false);
const imageSource = computed(() =>
  model.value.Image ? URL.createObjectURL(model.value.Image) : ""
);
const toolbar = [
  [
    "left",
    "center",
    "right",
    "justify",
    "bold",
    "italic",
    "underline",
    "strike",
  ],
  ["quote", "unordered", "ordered", "outdent", "indent"],
];
const goBack = () => $router.push("/products");
const onSubmit = () =>
  form.value.validate().then(async (success) => {
    if (success) {
      loading.value = true;
      try {
        const image = model.value.Image;
        const reader = new FileReader();
        reader.onload = async () => {
          const b64 = reader.result.replace("data:", "").replace(/^.+,/, "");
          const res = $route.params.id
            ? await patchAction("api/v1/product", {
                ...model.value,
                Image: b64,
              })
            : await postAction("api/v1/product", {
                ...model.value,
                Image: b64,
              });
          postedSuccessfully();
          goBack();
        };
        reader.readAsDataURL(image);
      } finally {
        loading.value = false;
      }
    }
  });
const loadProduct = async (id) => {
  loading.value = true;
  try {
    model.value = await getAction(`api/v1/product/${id}`);
    model.value.Image = await getBlobAction(`api/v1/product/image/${id}`);
    // fileRef.value.addFiles([img])
    // console.log('typeof image is', img)
  } finally {
    loading.value = false;
  }
};
watch(
  () => $route.params.id,
  async (id) => {
    if (id) await loadProduct(id);
  },
  { immediate: true }
);
</script>
