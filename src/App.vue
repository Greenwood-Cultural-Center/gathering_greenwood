<script setup>
  import { ref, computed, useTemplateRef, onMounted, inject, onUpdated, nextTick } from 'vue';
  import MglMap from './components/MglMap.vue';
  import FABMain from './components/FABMain.vue';
  import FABButton from './components/FABButton.vue';
  import ResultsPane from './components/ResultsPane.vue';
  import YearSearchBar from './components/YearSearchBar.vue';
  import DynamicGeoJsonLayer from './components/DynamicGeoJsonLayer.vue';
  import LandingPage from './components/LandingPage.vue';
  import { formatRawGeoJson } from './utils/utils.js';

  const emptyGeoJson = {type:'geojson',data:{id: 'search-source', type: 'FeatureCollection', features: []}};

  const map = ref(null);
  const mbMap = ref({});

  // State
  const appYear = ref('');
  const geoJson = ref(emptyGeoJson);
  const searchTerm = ref('');
  const landingPageRef = useTemplateRef('landingPageRef');
  // const showResults = ref(false);

  const showLanding = ref(true);

  const contrastMode = ref(false);

  // define available years
  const years = [
    { year: '1910', date: '1910-04-15' },
    { year: '1920', date: '1920-01-02' }
  ];

  const fabButtonCustomProps = [
    {
      title: 'Home',
      icon: 'house',
      ariaLabel: 'reset',
      ariaDescription: 'reset map and clear search results',
      clickHandler: () => resetApp(),
    },
    {
      title: 'Help',
      icon: 'question',
      ariaLabel: 'help',
      ariaDescription: 'show help video',
      clickHandler: () => showHelpVideo(),
    },
    {
      title:'Contrast',
      icon:'',
      ariaLabel: 'contrast mode',
      state: contrastMode.value,
      ariaDescription: 'enable high contrast mode',
      innerText: `Contrast ${contrastMode.value ? 'ON' : 'OFF'}`,
      clickHandler: () => toggleContrastMode(),
    }
  ];

  const geoJsonFeaturePaint = {
    'circle-radius': 8,
    'circle-color': '#f37021',     // orange inner circle
    'circle-stroke-color': '#ffffff', // white border
    'circle-stroke-width': 3
  }

  const census1920GeoJsonFeaturePaint = {
    'circle-radius': 8,
    'circle-color': '#405D47',     // orange inner circle
    'circle-stroke-color': '#ffffff', // white border
    'circle-stroke-width': 3
  }

  // Create an array of FAB button properties
  //  based on the custom properties defined above
  // This is a computed property that will be reactive to changes in the custom properties
  //  and will return an array of objects with the properties needed for each FAB button
  // The properties include title, icon, delay, ariaLabel, ariaDescription,
  //  shadowX, shadowY, shadowBlurTop, shadowBlurBottom, shadowWidth, shadowColor
  // The delay is calculated based on the index of the button in the array
  // The shadow properties are set to default values
  // The icon is set to the value of the icon property in the custom properties
  // The ariaLabel and ariaDescription are set to the values of the ariaLabel
  //  and ariaDescription properties in the custom properties
  // The state is set to the value of the state property in the custom properties
  const createFabButtonProps = computed(() => {
    return fabButtonCustomProps.map((button, index) => ({
      ...button,
      delay: 0.3 - (index * 0.05),
      shadowX: 3,
      shadowY: 3,
      shadowBlurTop: 0,
      shadowBlurBottom: 1,
      shadowWidth: 0.5,
      shadowColor: 'var(--gcc-white)',
      innerText: button.title === 'Contrast' ? `Contrast ${contrastMode.value ? 'ON' : 'OFF'}` : button.innerText, // Dynamically update innerText
    }));
  });

  // Map and ResultsPane ref
  const mglMapRef = useTemplateRef('mglMapRef');
  const resultsPaneRef = useTemplateRef('resultsPaneRef');
  const yearSearchBarRef = useTemplateRef('yearSearchBarRef');
  const census1920LayerRef = useTemplateRef('census1920LayerRef');
  const videoModalRef = useTemplateRef('videoModalRef');
  const census1920GeoJson = ref(emptyGeoJson);
  const helpVideoUrl = `${import.meta.env.BASE_URL}GCC-Kiosk-April-2025.webm`;
  const census1920Url = `${import.meta.env.BASE_URL}Grouped_1920_Census.min.geojson`;
  async function fetchGeoJson (url) {
    await fetch(`${url}`);
  }

  // Reset Functions

  // Reset handler for app state and map
  function resetApp() {
    // Reset app year to default
    updateYear('');

    // Reset search results
    clearResults();

    // Reset map zoom and center to default values
    resetMap();
  }

  const dynamicLayers = [
    "search-layer",
    "1920-census-layer"
  ]

  const dynamicSources = [
    "search-source",
    "1920-census-source"
  ];

  function clearResults() {
    searchTerm.value = '';
    // showResults.value = false;
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.resetState();
    }
    if (yearSearchBarRef && yearSearchBarRef.value) {
      yearSearchBarRef.value.clearSearch();
    }

    if (map.value?.getLayer('search-layer')) {
      map.value.setLayoutProperty('search-layer', 'visibility', 'none')
    }
  }

  function resetMap() {
    if (mglMapRef && mglMapRef.value) {
      mglMapRef.value.resetMap();
      geoJson.value = emptyGeoJson; // Reset geoJson to empty
    }
  }

  // FAB Button Handlers
  // Functions to handle FAB button actions

  function showHelpVideo() {
    // Logic to show help video
    if (videoModalRef.value) {
      videoModalRef.value.openDialog();
    }
  }

  function toggleContrastMode() {
    contrastMode.value = !contrastMode.value;
    // Logic to toggle high contrast mode
    console.log('Toggle high contrast mode');
  }

  // Event Handlers
  // Functions to handle events from child components

  function handleGeojson(newGeojson) {
    if (mglMapRef.value) {
      geoJson.value = newGeojson;
      //mglMapRef.value.loadDynamicLayer(newGeojson);
    }
  }

  async function handleSearch(searchValue) {
    // showResults.value = true;
    await nextTick(async() => {
      setTimeout(() => {
        if (mglMapRef.value && mbMap.value) {
          mbMap.value.resize();
          resetMap();
        }
      }, 300);
      //clearResults();
      //resetMap();
      if (mbMap.value?.getLayer('search-layer')) {
        mbMap.value.setLayoutProperty('search-layer', 'visibility', 'none')
      }
      searchTerm.value = searchValue.search;
      if (resultsPaneRef && resultsPaneRef.value) {
        await resultsPaneRef.value.search(searchValue);
      }
    });
    if (map.value?.getLayer('search-layer')) {
      if (geoJson.value && geoJson.value.data && geoJson.value.data.features && geoJson.value.data.features.length > 0) {
        mbMap.value.setLayoutProperty('search-layer', 'visibility', 'visible')
      }
    }
  }

  function updateYear(newYear) {
    appYear.value = newYear;
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.yearChanged(newYear);
    }
  }

  const handleMapCreated = async (mapbMap) => {
    mbMap.value = mapbMap;

    // census1920GeoJson.value = await fetchGeoJson(census1920Url)
    //   .then(response =>
    //     formatRawGeoJson(response.json(), '1920-census-source'));
    // const response = await fetch(census1920Url);
    // const data = await response.json();
    // Format the GeoJSON data for the 1920 census
    // var json = formatRawGeoJson(data, '1920-census-source', '1920');
    // json.data.features.forEach(feature => feature.properties.searchable_text = buildSearchableText(feature.properties));
    // census1920GeoJson.value = json;
  };

  function formatFeature(feature) {
    return {
      id: feature.id,
      source: feature.source,
      layer: feature.layer,
      type: feature.type,
      geometry: feature.geometry,
      properties: formatProperties(feature.properties, feature.source),
    }
  }

  function formatProperties(properties, source) {
    for (const key in properties) {
      if (properties[key] === null || properties[key] === undefined) {
        properties[key] = 'N/A';
      }
      else {
        try {
          properties[key] = JSON.parse(properties[key]);
        } catch (e) {
          // If parsing fails, keep the original value
          properties[key] = properties[key];
        }
      }
    }
    return properties;
  }

  function buildSearchableText(properties) {
    const families = properties.families || [];
    const allPeople = families.flatMap(fam => fam.people || []);
    const searchableText = [
      properties.StreetAddress || '',
      properties.City || '',
      properties.County || '',
      properties.Place || '',
      properties.Locality || '',
      ...families.map(f => f.Last_Name || ''),
      ...allPeople.map(p => p.First_Name || ''),
      ...allPeople.map(p => p.Middle_Name || ''),
      ...allPeople.map(p => p.Last_Name || ''),
      ...allPeople.map(p => p.Occupation || ''),
      ...allPeople.map(p => p.Industry || ''),
      ...allPeople.map(p => p.Institution || '')
    ].filter(Boolean); // Remove null/undefined/empty strings

    return searchableText.join('|').toLowerCase();
  }

  // Component Lifecycle Hooks
  onMounted(() => {
    const searchBar = yearSearchBarRef.value;
    if (searchBar) {
      document.getElementById('search-input').focus();
    }
    if (mglMapRef.value) {
      map.value = mglMapRef.value.map;
    }
  });

  onUpdated(() => {
    const searchBar = yearSearchBarRef.value;
    if (searchBar) {
      document.getElementById('search-input').focus();
    }
  });

  function closeLandingPage() {
    showLanding.value = false;
  }

  function openLandingPage() {
    clearResults();
    showLanding.value = true;
  }

// map.value = inject('map');
</script>

<template>
  <transition name="slide" mode="out-in">
    <LandingPage
      ref="landingPageRef"
      v-if="showLanding"
      @close="closeLandingPage">
    </LandingPage>
  </transition>
  <template v-if="!showLanding">
    <!-- FAB Component to create menu with dynamic buttons-->
    <FABMain nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" @click="openLandingPage">
      <!-- <FABButton
        v-for="(item, index) in createFabButtonProps"
        :key="index"
        v-bind="item"
        :state="item.state"
        :innerText="typeof item.innerText === 'function' ? item.innerText() : item.innerText"
        :clickHandler="item.clickHandler"
      ></FABButton> -->
    </FABMain>

    <!-- YearSelector Component to change year and perform searches -->
    <YearSearchBar ref="yearSearchBarRef" @clear="clearResults" :onSearch="handleSearch" :onYearChange="updateYear" :years="years"></YearSearchBar>

    <!-- Map Component with layer containing dynamic GeoJSON search results-->
    <!-- <MglMap nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" :class="['map-area', { 'map-area-shrunk' : showResults }]" :year="appYear" ref="mglMapRef" @created="handleMapCreated" :dynamicGeoJsonIds="{'dynamicLayers': dynamicLayers, 'dynamicSources': dynamicSources}"> -->
    <MglMap nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" class='map-area' :year="appYear" ref="mglMapRef" @created="handleMapCreated" :dynamicGeoJsonIds="{'dynamicLayers': dynamicLayers, 'dynamicSources': dynamicSources}">
      <DynamicGeoJsonLayer
        v-if="geoJson && geoJson.data && geoJson.data.features && geoJson.data.features.length > 0"
        :geojson="geoJson"
        :type="'circle'"
        :paint="geoJsonFeaturePaint"
        :layout="{ 'visibility': 'visible' }"
        layerId="search-layer"
        :filterYear="appYear"
        :map="mbMap"
        :featureFormatter="formatFeature">
      </DynamicGeoJsonLayer>
      <!-- <DynamicGeoJsonLayer
        v-if="census1920GeoJson && census1920GeoJson.data && census1920GeoJson.data.features && census1920GeoJson.data.features.length > 0"
        ref="census1920LayerRef"
        :geojson="census1920GeoJson"
        :type="'circle'"
        :paint="census1920GeoJsonFeaturePaint"
        :layout="{ 'visibility': 'visible' }"
        layerId="1920-census-layer"
        :filterYear="appYear"
        :map="map"
        :featureFormatter="formatFeature"
        :searchTerm="searchTerm"
      /> -->
    </MglMap>
    <!-- Results Pane Component containing search results-->
    <!-- <transition name="slide-results" mode="out-in"> -->
      <!-- <ResultsPane v-if="showResults" -->
      <ResultsPane
        ref="resultsPaneRef"
        class="results-pane"
        :years="years"
        :year="appYear"
        @update:geojson="handleGeojson">
      </ResultsPane>
    <!-- </transition> -->
  </template>
</template>

<style scoped>
  .map-area {
    /* width: 100vw; */
    width: var(--map-width);
    height: var(--map-height);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  /* .map-area-shrunk {
    width: var(--map-width);
  } */
</style>

<style>
  .slide-enter-active, .slide-leave-active {
    transition: all 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  .slide-enter-from, .slide-leave-to {
    transform: translateY(-100%);
  }

  .slide-results-enter-active, .slide-results-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-results-enter-from, .slide-results-leave-to {
    transform: translateX(100%);
  }

  .mgl-map-wrapper {
    height: var(--map-height);
    width: var(--map-width);
  }

  .dialog {
    border: none;
    border-radius: 0.5rem;
    width: 90vw;
    max-width: 56.25;
    padding: 0;
    box-shadow: 0 0.3125rem 1rem rgba(0, 0, 0, 0.3);
    color: var(--gcc-black)
  }

  .close-button {
    font-size: 2.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--gcc-lt-green);
  }

  .fabInnerButton[title="Contrast"] {
    background-image: linear-gradient(to right, var(--gcc-dk-green) 50%, var(--gcc-white) 50%);
  }
</style>