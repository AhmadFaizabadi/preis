<template>
  <q-page padding>
    <q-inner-loading v-model="loading" />
    <div class="printme overflow-hidden">
      <table>
        <thead>
          <tr>
            <td>
              <div class="header">
                <div class="row justify-between">
                  <div>
                    <span class="text-light-green-6"
                      >UNITEC Energieservice GmbH</span
                    >
                    · Innungstraße 22, 50354 Hürth
                  </div>
                  <div class="q-mt-lg">
                    <q-img src="images/logo.jpg" width="100px" />
                  </div>
                </div>
                <p>Herr/Frau {{ model.Customer?.Name }}</p>
                <p>{{ model.Customer?.SelectedAddress?.AddressText }}</p>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="column">
                <div>
                  <p class="text-right">Hürth, {{ germanDate(model.Date) }}</p>
                  <p class="text-h6 text-bold q-mb-xs">ANGEBOT</p>
                  <p class="text-subtitle-2 q-mt-xs">
                    <strong> Projekt: {{ model.ProjectNumber }}</strong> ·
                    {{ model.ProjectName }}
                  </p>

                  <p>
                    Sehr geehrter {{ model.Customer?.Title }},<br />vielen Dank
                    für Ihre Anfrage. Gerne unterbreiten wir Ihnen das
                    gewünschte freibleibende Angebot:
                  </p>
                  <p><strong>Produkte Tabelle</strong></p>
                  <q-markup-table
                    separator="cell"
                    flat
                    bordered
                    class="products-table overflow-hidden"
                  >
                    <thead>
                      <tr class="bg-black text-white">
                        <th class="text-left">No</th>
                        <th class="text-center">Bild der Produkte</th>
                        <th class="text-center">Name der Produkte</th>
                        <th class="text-center">Beschreibung</th>
                        <th class="text-center">Menge</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in productItems"
                        :key="'prd' + index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td style="max-width: 200px">
                          <product-image :id="item.Product?.Id" :width="150" />
                        </td>
                        <td
                          style="
                            max-width: 10rem;
                            text-wrap: wrap;
                            overflow: hidden;
                          "
                        >
                          {{ item.Product?.Name }}
                        </td>
                        <td>
                          <div
                            class="text-left text-smaller"
                            style="
                              max-width: 50rem;
                              text-wrap: wrap;
                              max-height: 10rem;
                              overflow: hidden;
                            "
                            v-html="item.Product?.Description"
                          />
                        </td>
                        <td class="text-center">{{ item.Entity }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>

                  <div v-if="serviceItems?.length > 0">
                    <br />
                    <p><strong>Dienste Tabelle</strong></p>
                    <q-markup-table
                      separator="cell"
                      flat
                      bordered
                      class="services-table overflow-hidden"
                    >
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name der Dienste</th>
                          <th>Beschreibung</th>
                          <th>Menge</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in serviceItems"
                          :key="'srv' + index"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.Product?.Name }}</td>
                          <td>
                            <div
                              class="text-left text-smaller"
                              style="
                                max-width: 50rem;
                                text-wrap: wrap;
                                max-height: 10rem;
                                overflow: hidden;
                              "
                              v-html="item.Product?.Description"
                            />
                          </td>
                          <td class="text-center">{{ item.Entity }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>

                  <div class="row justify-end">
                    <table class="col-4">
                      <tbody>
                        <tr>
                          <td>Regulärer Preis</td>
                          <td>
                            {{
                              model.TotalPrice?.toLocaleString().replace(
                                ",",
                                "."
                              )
                            }}
                            €
                          </td>
                        </tr>
                        <tr>
                          <td>Gesetzlicher MwSt. 19%</td>
                          <td>00,00</td>
                        </tr>
                        <tr>
                          <td>Ihr Preis</td>
                          <td>
                            {{
                              model.NetPrice?.toLocaleString().replace(",", ".")
                            }}
                            €
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="column" style="max-width: 100%">
                    <div>
                      Wir hoffen, Ihren Vorstellungen mit diesem Angebot zu
                      entsprechen und sichern Ihnen eine zuverlässige und
                      termingerechte Arbeit zu.
                    </div>
                    <div>
                      Für Rückfragen erreichen Sie mich unter folgender Nummer:
                      {{ model.AgentPhone }}.
                    </div>
                    <div>Mit freundlichen Grüßen,</div>
                    <div>
                      {{ model.AgentName }}
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <q-separator />
    <br />
    <div class="print-hide">
      <q-btn icon="mdi-file-pdf-box" :label="$t('export')" @click="doExport" />
    </div>
  </q-page>
</template>

<script setup>
import { getAction } from "src/api/manage";
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductImage from "src/components/ProductImage.vue";
import { germanDate } from "src/api/utils";

// Some aliases of the previous method for "width" and "height" which
// returns Numbers instead of Strings:
const $route = useRoute();
const $router = useRouter();
const model = ref({});
const loading = ref(false);
const productItems = computed(() =>
  model.value.Items?.filter((f) => f.Product.Category !== "Service")
);
const serviceItems = computed(() =>
  model.value.Items?.filter((f) => f.Product.Category === "Service")
);
const loadInvoice = async (id) => {
  loading.value = false;
  try {
    model.value = await getAction(`api/v1/invoices/${id}`);
  } finally {
    loading.value = false;
  }
};
const doExport = () => {
  // HtmlToPaper('printMe', options)
  window.focus();
  window.print();
};
watch(
  () => $route.params.id,
  async (id) => await loadInvoice(id),
  { immediate: true }
);
</script>

<style scoped>
@page {
  size: A4;
}

@media print {
  .printme {
    display: block !important;
  }
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>
