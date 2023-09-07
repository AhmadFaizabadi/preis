import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";

const POST_DEBOUNCE_MINUTES = 1;
let sync_timeout;
function deepScan(nodes,id){
  for (node of nodes)
    if (node.fullName === id) return node
    if ('children' in node){
      const child = deepScan(node.children, id)
      if (child) return child
    }
}
const getMembers = (members) => {
  let children = [];

  return members.map(mem => {
    const m = {...mem};
    if (m.children && m.children.length) {
      children = [...children, ...m.children];
    }
    delete m.children; // this will not affect the original array object
    return m;
  }).concat(children.length ? getMembers(children) : children);
};

export const useInvoiceStore = defineStore("invoice", {
  state: () => ({
    baseVersion: LocalStorage.getItem("baseVersion") || 0,
    invoiceVersion: LocalStorage.getItem("invoiceVersion") || 0,
    customerVersion: LocalStorage.getItem("customerVersion") || 0,
    supplies: LocalStorage.getItem("supplies") || [
      { fullName: "unitec", label: "UNITEC", children: [] },
    ],
    customers: LocalStorage.getItem("customers") || [],
    invoices: LocalStorage.getItem("invoices") || [],
    user: LocalStorage.getItem("user") || {},
  }),

  getters: {
    flatSupplies:(state)=>getMembers(state.supplies[0].children).filter(f=>f.unitValue)
  },

  actions: {
    async get(dataType) {
      let responseBase, responseInvoice;
      if (dataType === "*" || dataType === "base") {
        responseBase = await api.get(`invoice/base-data/${this.baseVersion}`);
        if (responseBase && responseBase.status === 200) {
          const data = responseBase.data;
          if (data.version > this.baseVersion) {
            this.baseVersion = data.version;
            this.supplies = JSON.parse(data.supplies);
            this.saveData("base", false);
          }
        }
      }
      if (dataType === "*" || dataType === "invoice") {
        responseInvoice = await api.get(
          `invoice/invoice-data/${this.invoiceVersion}`
        );
        if (responseInvoice && responseInvoice.status === 200) {
          const data = responseInvoice.data;
          if (data.version > this.invoiceVersion) {
            this.invoiceVersion = data.version;
            this.supplies = JSON.parse(data.supplies);
            this.saveData("invoice", false);
          }
        }
      }
    },
    async post(dataType) {
      let responseBase, responseInvoice;
      if (dataType === "*" || dataType === "base") {
        responseBase = await api.post("invoice/save-base-data", {
          version: this.baseVersion,
          supplies: JSON.stringify(this.supplies),
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
      }
      if (dataType === "*" || dataType === "invoice") {
        this.invoiceVersion = LocalStorage.getItem("invoiceVersion") || 0;
        this.invoices = LocalStorage.getItem("invoices") || [];
      }
      if (dataType === "*" || dataType === "customer") {
        this.invoiceVersion = LocalStorage.getItem("customerVersion") || 0;
        this.customers = LocalStorage.getItem("customers") || [];
      }
    },
    saveData(dataType, postIt=false) {
      if (dataType === "*" || dataType === "base") {
        LocalStorage.set("baseVersion", this.baseVersion);
        LocalStorage.set("supplies", this.supplies);
      }
      if (dataType === "*" || dataType === "invoice") {
        LocalStorage.set("invoiceVersion", this.invoiceVersion);
        LocalStorage.set("invoices", this.invoices);
      }
      if (dataType === "*" || dataType === "customer") {
        LocalStorage.set("customerVersion", this.customerVersion);
        LocalStorage.set("customers", this.customers);
      }
      if (postIt){
        if (sync_timeout) clearTimeout(sync_timeout); else this.baseVersion+=1
        sync_timeout = setTimeout(
          async () => {await this.post('base')
                  sync_timeout=undefined;
        },60 * 1000 * POST_DEBOUNCE_MINUTES
        );
      }
    },
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
          const r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
    },
    newInvoice(invoice){
      this.invoices.push(invoice);
      this.saveData('invoice')
    },
    async newUser(user){
      try {
        const response=await api.post('user', user)
      } catch (error) {

      }
    }
  },
});
