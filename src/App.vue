<script setup>
  import { ref, computed, onBeforeMount } from 'vue'
  import { MapboxMap } from '@studiometa/vue-mapbox-gl';
  import MBMap from './components/MBMap.vue'
  import MglMap from './components/MglMap.vue';
  import GeoJsonLayer from './components/GeoJsonLayer.vue';
  import Layer from './components/Layer.vue';
  import FABMain from './components/FABMain.vue';
  import FABButton from './components/FABButton.vue';
  import ResultsPane from './components/ResultsPane.vue';
  import YearSearchBar from './components/YearSearchBar.vue';

  // State
  const appYear = ref('');
  const geoJson = ref(null);
  const mapType = ref('MGL'); // or 'MB' for Mapbox GL JS

  // define available years
  const years = [
    { year: '1910', date: '1910-04-15' },
    { year: '1920', date: '1920-01-02' }
  ];

  const fabButtons = [
    { title: 'Home', icon: ['fas', 'house'], ariaLabel: 'reset', ariaDescription: 'reset map and clear search results' },
    { title: 'Help', icon: ['fas', 'question'], ariaLabel: 'help', ariaDescription: 'show help video' },
    { title: 'Contrast', icon: ['fas', 'contrast'], ariaLabel: 'contrast mode', ariaDescription: 'enable high contrast mode' }
  ];

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

  function handleGeojson(newGeojson) {
    // if (mglMapRef.value) {
    //   geoJson.value = newGeojson;
    //   mglMapRef.value.loadDynamicLayer(newGeojson);
    // }
  }

  function clearResults() {
    if (resultsPaneRef) {
      resultsPaneRef.value.resetState();
    }
  }

  function resetMap() {
    if (mglMapRef) {
      mglMapRef.value.resetMap();
      geoJson.value = null;
    }
  }

  function handleSearch(searchValue) {
    clearResults();
    resetMap();
    if (resultsPaneRef) {
      resultsPaneRef.value.search(searchValue);
    }
  }

</script>

<template>
  <FABMain>
    <FABButton
      v-for="(button, index) in fabButtons"
      :title=button.title
      :delay="0.3 - (index * 0.05)"
      :icon=button.icon
      :ariaLabel=button.ariaLabel
      :ariaDescription=button.ariaDescription
      :shadowX=3
      :shadowY=3
      :shadowBlurTop=0
      :shadowBlurBottom=1
      :shadowWidth=0.5
      :shadowColor="'#eee'"/>
  </FABMain>
  <!-- YearSelector Component to change year -->
  <YearSearchBar
    :onSearch="handleSearch"
    :onYearChange="updateYear"
    :years="years"></YearSearchBar>

  <template v-if="mapType === 'MGL'">
    <MglMap :year="appYear" ref="mglMapRef">
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
    v-model:geoJson="geoJson"
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