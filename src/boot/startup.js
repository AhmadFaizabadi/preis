import { boot } from 'quasar/wrappers'
import { useInvoiceStore } from 'src/stores/invoice'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ store}) => {
  const {get, loadData}= useInvoiceStore(store)
  loadData("base");
  try {
    // await get("base");
  } catch {}

})
