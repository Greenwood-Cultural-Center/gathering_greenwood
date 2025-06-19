import { createApp, provide } from 'vue';
import './style.css';
import App from './App.vue';
import Toast from "vue-toastification";
import mapboxgl from 'mapbox-gl';
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
  faTimes,
  faChurch,
  faLocationDot,
  faIndustry,
  faStore,
  faCircleHalfStroke,
  faAdjust,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileText
} from '@fortawesome/free-solid-svg-icons';

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
  faTimes,
  faChurch,
  faLocationDot,
  faIndustry,
  faStore,
  faCircleHalfStroke,
  faAdjust,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileText);

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
  .provide('mapboxgl', mapboxgl)
  .mount('#app');