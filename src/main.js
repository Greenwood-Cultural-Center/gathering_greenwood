import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Toast from "vue-toastification"; 
import "vue-toastification/dist/index.css";

/* import the fontawesome core */
import { library, config } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faSearch,
  faBuilding,
  faUser,
  faFileAlt,
  faDatabase,
  faBook,
  faImage,
  faVideo,
  faVolumeHigh,
  faHouse,
  faQuestion,
  faLink,
  faTimes } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faSearch,
  faBuilding,
  faUser,
  faFileAlt,
  faDatabase,
  faBook,
  faImage,
  faVideo,
  faVolumeHigh,
  faHouse,
  faQuestion,
  faLink,
  faTimes);

const toastOptions = {
  position: "top-right",
  timeout: 30000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
};

config.familyDefault = 'classic';
config.styleDefault = 'solid';

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(Toast, toastOptions)
  .mount('#app');