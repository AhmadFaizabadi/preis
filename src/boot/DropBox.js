import { Dropbox } from 'dropbox'
import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app} ) => {
  app.config.globalProperties.dropbox= new Dropbox({accessToken:import.meta.env.VITE_accessToken})
})
