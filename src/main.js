import { createApp, reactive, ref } from 'vue'
import './style.css'
import App from './App.vue'
// import { buildYearRecord } from './models/YearRecord';

// async function loadConfig() {
//   const response = await fetch('/config.json');
//   if (!response.ok) {
//     throw new Error('Failed to load config.json');
//   }
//   return await response.json();
// }

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {fas, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { build } from 'vite';

/* add icons to the library */
library.add(fas, faMagnifyingGlass)

//loadConfig().then(config => {

  // if (!config.dateConfig) {
  //   throw new Error('dateConfig is missing in config.json');
  // }

  // if (!config.defaultDate) {
  //   throw new Error('defaultDate is missing in config.json');
  // }

  // const dates = buildYearRecord(config.dateConfig, config.defaultDate);
  // config.dates = dates;
  // config.yearEntries = Object.entries(YearRecord);

  // config = Object.freeze(config.backendHost);

  // config.manager = ref(config.manager);
  // config.manager.value = new YearRecordManager(appConfig.dates, config.defaultDate);

  // config.featureFlags = reactive(config.featureFlags);

  createApp(App)
      .component('font-awesome-icon', FontAwesomeIcon)
      //.provide('appConfig', config)
      .mount('#app')
//});