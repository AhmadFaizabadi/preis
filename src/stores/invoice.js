import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";

const POST_DEBOUNCE_MINUTES = 1;
let sync_timeout;
export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    baseVersion: LocalStorage.getItem("baseVersion") || 0,
    invoiceVersion: LocalStorage.getItem("invoiceVersion") || 0,
    supplies: LocalStorage.getItem("supplies") || [
      { fullName: "unitec", label: "UNITEC", children: [] },
    ],
    prices: LocalStorage.getItem("prices") || [],
    customers: LocalStorage.getItem("customers") || [],
    invoices: LocalStorage.getItem("invoices") || [],
    user: LocalStorage.getItem("user") || {},
  }),

  getters: {},

  actions: {
    async get(dataType) {
      let responseBase, responseInvoice;
      if (dataType === "*" || dataType === "base") {
        responseBase = await api.get(`invoice/base-data/${this.baseVersion}`);
        if (responseBase && responseBase.statuscode === 200) {
          const data = responseBase.data;
          if (data.version > this.baseVersion) {
            this.baseVersion = data.version;
            this.supplies = JSON.parse(data.supplies);
            this.prices = JSON.parse(data.prices);
            this.saveData("base", data.version);
          }
        }
      }
      if (dataType === "*" || dataType === "invoice") {
        responseInvoice = await api.get(
          `invoice/invoice-data/${this.invoiceVersion}`
        );
        if (responseInvoice && responseInvoice.statuscode === 200) {
          const data = responseInvoice.data;
          if (data.version > this.invoiceVersion) {
            this.invoiceVersion = data.version;
            this.supplies = JSON.parse(data.supplies);
            this.prices = JSON.parse(data.prices);
            this.saveData("invoice", data.version);
          }
        }
      }
    },
    async post(dataType) {
      let responseBase, responseInvoice;
      debugger
      if (dataType === "*" || dataType === "base") {
        responseBase = await api.post("invoice/save-base-data", {
          version: this.baseVersion,
          supplies: JSON.stringify(this.supplies),
          prices: JSON.stringify( this.prices),
        });
      }
      if (dataType === "*" || dataType === "invoice") {
        responseInvoice = await api.post("invoice/save-invoice-data", {
          version: this.invoiceVersion,
          invoices: JSON.stringify(this.invoices),
          customers: JSON.stringify(this.customers),
        });
      }
    },

    loadData(dataType) {
      if (dataType === "*" || dataType === "base") {
        this.baseVersion = LocalStorage.getItem("baseVersion") || 0;
        this.supplies = LocalStorage.getItem("supplies") || [
          { fullName: "unitec", label: "UNITEC", children: [] },
        ];
        this.prices = LocalStorage.getItem("prices") || [];
      }
      if (dataType === "*" || dataType === "invoice") {
        this.invoiceVersion = LocalStorage.getItem("invoiceVersion") || 0;
        this.invoices = LocalStorage.getItem("invoices") || [];
        this.customers = LocalStorage.getItem("customers") || [];
      }
    },
    saveData(dataType) {
      if (dataType === "*" || dataType === "base") {
        LocalStorage.set("baseVersion", this.baseVersion);
        LocalStorage.set("supplies", this.supplies);
        LocalStorage.set("prices", this.prices);
      }
      if (dataType === "*" || dataType === "invoice") {
        LocalStorage.set("invoiceVersion", this.invoiceVersion);
        LocalStorage.set("invoices", this.invoices);
        LocalStorage.set("customers", this.customers);
      }
    },
    addSupply(parent, node) {
      if (!("children" in parent)) parent.children = [];
      parent.children.push({
        ...node,
        fullName: parent.fullName + "-" + node.label.toLowerCase(),
      });
      this.saveData("base");
      if (sync_timeout) clearTimeout(sync_timeout); else this.baseVersion+=1
      sync_timeout = setTimeout(
        async () => {await this.post('base'),
        60 * 1000 * POST_DEBOUNCE_MINUTES;
        sync_timeout=undefined;
      }
      );
    },
  },
});
