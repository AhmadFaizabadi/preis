<template>
  <q-page padding>
    <q-inner-loading v-model="loading" />
    <div id="printme" class="printme overflow-hidden">
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
                    <q-img src="images/logo.jpg" width="200px" />
                  </div>
                </div>
                <p>
                  {{ model.Customer?.Title }} {{ model.Customer?.FirstName }}
                  {{ model.Customer?.LastName }}
                </p>
                <p>{{ model.Customer?.StreetAndNumber }}</p>
                <p>
                  {{ model.Customer?.PostalCode }}
                  {{ model.Customer?.City }}
                </p>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="column">
                <div>
                  <div class="empty-space"></div>
                  <div class="empty-space"></div>
                  <p class="text-right">Hürth, {{ germanDate(model.Date) }}</p>
                  <p class="text-h6 text-bold q-mb-xs">ANGEBOT</p>
                  <p class="text-subtitle-2 q-mt-xs">
                    <strong> Angebotnummer: {{ model.ProjectNumber }}</strong> ·
                    {{ model.ProjectName }}
                  </p>

                  <p>
                    Sehr geehrter {{ model.Customer?.Title }}
                    {{ model.Customer?.FirstName }}
                    {{ model.Customer?.LastName }},<br />vielen Dank für Ihre
                    Anfrage. Gerne unterbreiten wir Ihnen das gewünschte
                    freibleibende Angebot:
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
                        <td
                          style="
                            max-width: 100px;
                            max-width: 75px;
                            text-align: center;
                          "
                        >
                          <product-image :id="item.Product?.Id" :width="100" />
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
                          >
                            <strong
                              >{{ item.Product?.Name }} -
                              {{ item.Product?.Category }}</strong
                            >
                            <br />
                            <div v-html="item.Product?.Description"></div>
                          </div>
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
                          <th>Bild der Dienste</th>
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
                          <td
                            style="
                              max-width: 125px;
                              max-width: 100px;
                              text-align: center;
                            "
                          >
                            <product-image
                              :id="item.Product?.Id"
                              :width="100"
                            />
                          </td>
                          <td>
                            <div
                              class="text-left text-smaller"
                              style="
                                max-width: 50rem;
                                text-wrap: wrap;
                                max-height: 15rem;
                                overflow: hidden;
                              "
                            >
                              <strong
                                >{{ item.Product?.Name }} -
                                {{ item.Product?.Category }}</strong
                              >
                              <br />
                              <div v-html="item.Product?.Description"></div>
                            </div>
                          </td>
                          <td class="text-center">{{ item.Entity }}</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                  <div class="empty-space"></div>
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
                  <div class="empty-space"></div>
                  <hr class="thick-divider" />
                  <div class="column" style="max-width: 100%">
                    <div>
                      Wir hoffen, Ihren Vorstellungen mit diesem Angebot zu
                      entsprechen und sichern Ihnen eine zuverlässige und
                      termingerechte Arbeit zu.
                    </div>
                    <div>
                      Für Rückfragen erreichen Sie mich unter folgender Nummer:
                      {{ model.AgentPhone }}
                    </div>
                    <div class="empty-space"></div>
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
  //html2pdf(document.getElementById('printme'););
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
table tr td,
table tr th {
  page-break-inside: avoid;
}
.empty-space {
  height: 1.5cm;
}
.thick-divider {
  border: 1px solid #1c1c1c; /* Adjust the thickness and color as needed */
  margin: 1rem 0; /* Adjust the margin to control the spacing around the divider */
}
.products-table th,
.services-table th {
  border-left: none; /* Remove left border */
  border-right: none; /* Remove right border */
  background-color: #333 !important;
  color: white !important;
  border-top: none !important;
  border-bottom: 1px solid #1c1c1c !important;
}

.products-table td,
.services-table td {
  border-left: none; /* Remove left border */
  border-right: none; /* Remove right border */
  border-bottom: 1px solid #1c1c1c !important;
}
</style>
