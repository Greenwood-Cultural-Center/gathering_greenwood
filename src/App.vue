<script setup>
  import { ref, computed, onBeforeMount} from 'vue';
  import { MapboxMap } from '@studiometa/vue-mapbox-gl';
  import MBMap from './components/MBMap.vue'
  import MglMap from './components/MglMap.vue';
  import GeoJsonLayer from './components/GeoJsonLayer.vue';
  import Layer from './components/Layer.vue';
  import FABMain from './components/FABMain.vue';
  import FABButton from './components/FABButton.vue';
  import ResultsPane from './components/ResultsPane.vue';
  import YearSearchBar from './components/YearSearchBar.vue';
  import DynamicGeoJsonLayer from './components/DynamicGeoJsonLayer.vue';

  const emptyGeoJson = {type:'geojson',data:{id: 'search-source', type: 'FeatureCollection', features: []}};

  // State
  const appYear = ref('');
  const geoJson = ref(emptyGeoJson);
  const mapType = ref('MGL'); // or 'MB' for Mapbox GL JS

  const contrastMode = ref(false);

  // define available years
  const years = [
    { year: '1910', date: '1910-04-15' },
    { year: '1920', date: '1920-01-02' }
  ];

  const fabButtonCustomProps = [
    {
      title: 'Home',
      icon: ['fas', 'house'],
      ariaLabel: 'reset',
      ariaDescription: 'reset map and clear search results',
      clickHandler: () => resetApp(),
    },
    {
      title: 'Help',
      icon: ['fas', 'question'],
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

  // Map and ResultsPane ref
  const mglMapRef = ref(null);
  const resultsPaneRef = ref(null);

  function updateYear(newYear) {
    appYear.value = newYear;
  }

  // Reset handler for app state and map
  function resetApp() {
    // Reset app year to default
    updateYear('');

    // Reset search results
    clearResults();

    // Reset map zoom and center to default values
    resetMap();
  }

  function showHelpVideo() {
    // Logic to show help video
    console.log('Show help video');
  }

  function toggleContrastMode() {
    contrastMode.value = !contrastMode.value;
    // Logic to toggle high contrast mode
    console.log('Toggle high contrast mode');
  }

  function handleGeojson(newGeojson) {
    if (mglMapRef.value) {
      geoJson.value = newGeojson;
      //mglMapRef.value.loadDynamicLayer(newGeojson);
    }
  }

  function clearResults() {
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.resetState();
    }
  }

  function resetMap() {
    if (mglMapRef && mglMapRef.value) {
      mglMapRef.value.resetMap();
      geoJson.value = emptyGeoJson; // Reset geoJson to empty
    }
  }

  function handleSearch(searchValue) {
    clearResults();
    resetMap();
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.search(searchValue);
    }
  }

  function handleFeatureClick(feature) {

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
      shadowColor: '#eee',
      innerText: button.title === 'Contrast' ? `Contrast ${contrastMode.value ? 'ON' : 'OFF'}` : button.innerText, // Dynamically update innerText
    }));
  });
</script>

<template>
  <FABMain>
    <FABButton
      v-for="(item, index) in createFabButtonProps"
      v-bind="item"
      :key="index"
      :state="item.state"
      :innerText="typeof item.innerText === 'function' ? item.innerText() : item.innerText"
      :clickHandler="item.clickHandler"
    ></FABButton>
  </FABMain>
  <!-- YearSelector Component to change year -->
  <YearSearchBar
    :onSearch="handleSearch"
    :onYearChange="updateYear"
    :years="years"></YearSearchBar>

  <template v-if="mapType === 'MGL'">
    <MglMap :year="appYear" ref="mglMapRef">
      <DynamicGeoJsonLayer
        :geojson="geoJson"
        :type="'circle'"
        :paint=geoJsonFeaturePaint
        :layout="{ 'visibility': 'visible' }"
        layerId="search-layer"
        @feature-click="handleFeatureClick"
        :filterYear="appYear"
      />
    </MglMap>
  </template>
  <template v-else-if ="mapType === 'MB'">
    <MBMap :year="appYear" :geoJson="geoJson">
      <Layer
        geojsonUrl="src\data\parcels\Demo_Parcels.geojson"
        Name="Parcels">
      </Layer>
      <Layer
        geojsonUrl="src\data\streets\Demo_Street_Labels.geojson"
        Name="Streets">
      </Layer>
      <Layer
        geojsonUrl="src\data\blocks\Demo_Blocks.geojson"
        Name="Blocks">
      </Layer>
    </MBMap>
  </template>
  <!--
    @update:results="handleResults"-->
  <ResultsPane
    ref="resultsPaneRef"
    :years="years"
    :year="appYear"
    @update:geojson="handleGeojson"
    v-model:geojson="geoJson"
    />
</template>

<style>
  .historical-map-container {
    height: 100vh;
    width: 60vw;
  }
  .mgl-map-wrapper {
    height: 97.05vh;
    width: 60vw;
  }
  .dialog {
    border: none;
    border-radius: 8px;
    width: 90vw;
    max-width: 800px;
    padding: 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    color: #333
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