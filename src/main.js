import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

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

config.familyDefault = 'classic';
config.styleDefault = 'solid';

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');