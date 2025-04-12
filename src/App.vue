<script setup>
  import { ref } from 'vue'
  import { MapboxMap } from '@studiometa/vue-mapbox-gl';
  import MBMap from './components/MBMap.vue'
  import MglMap from './components/MglMap.vue';
  import GeoJsonLayer from './components/GeoJsonLayer.vue';
  import Layer from './components/Layer.vue';
  import HomeButton from './components/HomeButton.vue';
  import ResultsPane from './components/ResultsPane.vue';
  import YearSelector from './components/YearSelector.vue';

  // State
  const appYear = ref('Both');
  const geoJson = ref(null);
  const searchResults = ref([]);
  const resultsCount = ref({});
  const lastSearch = ref('');
  const mapType = ref('MGL'); // or 'MB' for Mapbox GL JS

  // Map and ResultsPane ref
  const mglMapRef = ref(null);
  const resultsPaneRef = ref(null);

  function updateYear(newYear) {
    appYear.value = newYear;
    console.log(`Selected App year: ${newYear}`);
  }
  // Reset handler for app state and map
  function resetApp() {
    // Reset app year to default
    updateYear('Both');
    if (resultsPaneRef) {
      resultsPaneRef.value.resetState();
    }
    // Reset map zoom and center to default values
    if (mglMapRef) {
      mglMapRef.value.resetMap();
      geoJson.value = null;
    }
  }

function handleGeojson(newGeojson) {
  // console.log('Received new geojson:', newGeojson);
  // if (mglMapRef.value) {
  //   geoJson.value = newGeojson;
  //   mglMapRef.value.loadDynamicLayer(newGeojson);
  // }
}

function resetMap() {
  if (mglMapRef.value) {
    mglMapRef.value.resetMap();
  }
}

</script>

<template>
  <HomeButton @reset="resetApp"/>
  <!-- YearSelector Component to change year -->
  <YearSelector :onYearChange="updateYear" />

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
    :year="appYear"
    @update:geojson="handleGeojson"
    @update:resetMap="resetMap"
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
</style>