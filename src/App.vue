<script setup>
  import { ref, computed, useTemplateRef } from 'vue';
  import MglMap from './components/MglMap.vue';
  import FABMain from './components/FABMain.vue';
  import FABButton from './components/FABButton.vue';
  import ResultsPane from './components/ResultsPane.vue';
  import YearSearchBar from './components/YearSearchBar.vue';
  import DynamicGeoJsonLayer from './components/DynamicGeoJsonLayer.vue';
  import VideoModal from './components/VideoModal.vue';
  import { formatRawGeoJson } from './utils/utils.js';

  const emptyGeoJson = {type:'geojson',data:{id: 'search-source', type: 'FeatureCollection', features: []}};

  // State
  const appYear = ref('');
  const geoJson = ref(emptyGeoJson);
  const searchTerm = ref('');

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
      shadowColor: '#eee',
      innerText: button.title === 'Contrast' ? `Contrast ${contrastMode.value ? 'ON' : 'OFF'}` : button.innerText, // Dynamically update innerText
    }));
  });

  // Map and ResultsPane ref
  const mglMapRef = useTemplateRef('mglMapRef');
  const resultsPaneRef = useTemplateRef('resultsPaneRef');
  const yearSearchBarRef = useTemplateRef('yearSearchBarRef');
  const census1920LayerRef = useTemplateRef('census1920LayerRef');
  const map = ref(null);
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
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.resetState();
    }
    if (yearSearchBarRef && yearSearchBarRef.value) {
      yearSearchBarRef.value.clearSearch();
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
    //clearResults();
    //resetMap();
    if (map.value.getLayer('search-layer')) {
      map.value.setLayoutProperty('search-layer', 'visibility', 'none')
    }
    searchTerm.value = searchValue.search;
    if (resultsPaneRef && resultsPaneRef.value) {
      await resultsPaneRef.value.search(searchValue);
    }
    if (map.value.getLayer('search-layer')) {
      if (geoJson && geoJson.data && geoJson.data.features && geoJson.data.features.length > 0) {
        map.value.setLayoutProperty('search-layer', 'visibility', 'visible')
      }
    }
  }

  function updateYear(newYear) {
    appYear.value = newYear;
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.yearChanged(newYear);
    }
  }

  const handleMapCreated = async (mbMap) => {
    map.value = mbMap;
    // census1920GeoJson.value = await fetchGeoJson(census1920Url)
    //   .then(response =>
    //     formatRawGeoJson(response.json(), '1920-census-source'));
    const response = await fetch(census1920Url);
    const data = await response.json();
    // Format the GeoJSON data for the 1920 census
    var json = formatRawGeoJson(data, '1920-census-source', '1920');
    json.data.features.forEach(feature => feature.properties.searchable_text = buildSearchableText(feature.properties));
    census1920GeoJson.value = json;
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
    if (source === 'search-source') {
      properties.people = properties[1910].concat(properties[1920])
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
</script>

<template>

  <!-- FAB Component to create menu with dynamic buttons-->
  <FABMain>
    <FABButton
      v-for="(item, index) in createFabButtonProps"
      :key="index"
      v-bind="item"
      :state="item.state"
      :innerText="typeof item.innerText === 'function' ? item.innerText() : item.innerText"
      :clickHandler="item.clickHandler"
    ></FABButton>
  </FABMain>

  <!-- Video Modal Component to show help video -->
  <VideoModal ref="videoModalRef" :url="helpVideoUrl" :autoplay="true" class="fab fa-autoprefixer"></VideoModal>

  <!-- YearSelector Component to change year and perform searches -->
  <YearSearchBar ref="yearSearchBarRef" :onSearch="handleSearch" :onYearChange="updateYear" :years="years"></YearSearchBar>

  <!-- Map Component with layer containing dynamic GeoJSON search results-->
  <MglMap :year="appYear" ref="mglMapRef" @created="handleMapCreated" :dynamicGeoJsonIds="{'dynamicLayers': dynamicLayers, 'dynamicSources': dynamicSources}">
    <DynamicGeoJsonLayer
      v-if="geoJson && geoJson.data && geoJson.data.features && geoJson.data.features.length > 0"
      :geojson="geoJson"
      :type="'circle'"
      :paint="geoJsonFeaturePaint"
      :layout="{ 'visibility': 'visible' }"
      layerId="search-layer"
      :filterYear="appYear"
      :map="map"
      :featureFormatter="formatFeature"
    />
    <DynamicGeoJsonLayer
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
    />
  </MglMap>

  <!-- Results Pane Component containing search results-->
  <ResultsPane
    ref="resultsPaneRef"
    :years="years"
    :year="appYear"
    @update:geojson="handleGeojson"
    :featureFormatter="formatFeature"
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