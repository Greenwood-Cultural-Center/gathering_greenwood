<script setup>
  import { ref, computed, useTemplateRef, onMounted, inject, onUpdated, nextTick } from 'vue';
  import MglMap from '@/components/Map/MglMap.vue';
  import { MglSymbolLayer } from 'vue-mapbox3';
  import FABMain from '@FAB/FABMain.vue';
  import FABButton from '@FAB/FABButton.vue';
  import ResultsPane from '@Results/ResultsPane.vue';
  import YearSearchBar from '@Search/YearSearchBar.vue';
  import DynamicGeoJsonLayer from '@/components/Map/DynamicGeoJsonLayer.vue';
  import LandingPage from '@Landing/LandingPage.vue';
  import utils from '@utils/utils.js';
  import { useFaMapService } from '@Composables/useFaMapservice.js';
  import DetailDrawer from './components/Utility/DetailDrawer.vue';
  import DetailDrawerExample from './components/Utility/DetailDrawerExample.vue';

  const { fontAwesomeCharacterCode } = useFaMapService();
  const emptyGeoJson = {type:'geojson',data:{id: 'search-source', type: 'FeatureCollection', features: []}};
  const mbMap = ref({});

  // State
  const appYear = ref('');
  const geoJson = ref(emptyGeoJson);
  const searchTerm = ref('');
  const landingPageRef = useTemplateRef('landingPageRef');
  const showResults = ref(false);

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

  const markerPaintOptions = {
    'Search Results' : {
      'circle-color': '#D36327',
      'circle-opacity': 1,
      'circle-radius': 8,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 1,
      'circle-stroke-width': 3,
      'circle-blur': 0
    },
    census1920GeoJsonFeaturePaint : {
      'circle-radius': 8,
      'circle-color': '#405D47',
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 3,
      'visibility': false,
      'label': 'Census Records'
    },
    'Points of Interest' : {
      'circle-radius': 16,
      'circle-color': '#FFCC00',
      'circle-opacity': 1,
      'circle-stroke-color': '#405D47',
      'circle-stroke-width': 5,
      'circle-stroke-opacity': 1,
      'circle-blur': 0,
    },
    nytBuildingPaint : {
      'fill-color': ['case',
        ['boolean', ['feature-state', 'search-item'], false ],'#D36327',
        ['case',
          ['==', ['get', 'POI'], null],
          '#666666',
          '#13331C'
        ]
      ],
      'fill-opacity': 1
    },
    nytAllBuildingPaint : {
      'fill-color': '#666666',
      'fill-opacity': 1
    },
    burnedAreaPaint : {
      'fill-color': '#FF0000',
      'fill-opacity': 0.2
    },
    street1920Paint : {
      'line-color': '#000000',
      'line-width': 2
    }

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
  const poiLayerRef = useTemplateRef('POILayerRef');
  const building1920LayerRef = useTemplateRef('building1920LayerRef');
  const allBuilding1920LayerRef = useTemplateRef('allBuilding1920LayerRef');
  const burnedAreaLayerRef = useTemplateRef('burnedAreaLayerRef');
  const street1920LayerRef = useTemplateRef('street1920LayerRef');
  const names1920LayerRef = useTemplateRef('names1920LayerRef');
  const videoModalRef = useTemplateRef('videoModalRef');
  const census1920GeoJson = ref(emptyGeoJson);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const poiGeoJSON = ref(emptyGeoJson);
  const building1920GeoJSON = ref(emptyGeoJson);
  const building1920GeoJSONAll = ref(emptyGeoJson);
  const street1920GeoJSON = ref(emptyGeoJson);
  const burnedAreaGeoJSON = ref(emptyGeoJson);

  async function fetchGeoJson (url) {
    return await fetch(`${url}`,{method: 'GET', mode: 'cors'});
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
    "1920-street-layer",
    "1920-burned-area-layer",
    "1920-all-building-layer",
    "1920-building-layer",
    "address-Layer",
    // "poi-layer",
    // "1920-census-layer"
  ]

  const dynamicSources = [
    "search-source",
    "1920-street-source",
    "1920-burned-area-source",
    "1920-all-building-source",
    "1920-building-source",
    // "poi-source",
    // "1920-census-source"
  ];

  async function clearResults() {
    searchTerm.value = '';
    showResults.value = false;
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.resetState();
    }
    if (yearSearchBarRef && yearSearchBarRef.value) {
      yearSearchBarRef.value.clearSearch();
    }

    if (mbMap.value?.getLayer('search-layer')) {
      mbMap.value.setLayoutProperty('search-layer', 'visibility', 'none');
    }
    await nextTick(async() => {
      setTimeout(() => {
        if (mglMapRef.value && mbMap.value) {
          mbMap.value.resize();
        }
      }, 300);
    });
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
    showResults.value = true;
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
    if (mbMap.value?.getLayer('search-layer')) {
      if (geoJson.value && geoJson.value.data && geoJson.value.data.features && geoJson.value.data.features.length > 0) {
        if (mbMap.value?.getSource('search-source')) {
          mbMap.value.getSource('search-source').setData(geoJson.value.data);
        } else {
          mbMap.value.addSource('search-source', geoJson.value);
        }

        mbMap.value.setLayoutProperty('search-layer', 'visibility', 'visible')
      }
    }

    if (searchValue && geoJson?.data?.features) {
      updateBuildingLayerPaint(geoJson.data.features);
    }

    fitMapToSearch();
  }


  function fitMapToSearch() {
    let map = mbMap.value;

    const bounds = [
      [-95.9920116989025, 36.158007967977824], // Southwest coordinates
      [-95.9832913934226, 36.1651567575813]  // Northeast coordinates
    ];

    // Fit the map to the calculated bounds
    map.fitBounds(bounds, {
      padding: 100
    });
  }

  function updateBuildingLayerPaint(searchFeatures) {
    // Extract IDs from the search GeoJSON features
    const searchIds = [];
    searchFeatures.forEach(feature => {
      if (feature.properties && feature.properties.location_id) {
        searchIds.push(String(feature.properties.location_id)); // Ensure string comparison
      }
    });

    if (searchIds.length === 0) {
      // Reset building layer paint when no search results
      resetBuildingLayerPaint();
      return;
    }

    // Check if the building layer exists
    const buildingLayerId = '1920-building-layer';
    if (!props.map.getLayer(buildingLayerId)) {
      console.warn('Building layer not found, cannot update paint');
      return;
    }

    // Get the building layer source ID (should be from building1920GeoJSON)
    const buildingLayer = props.map.getLayer(buildingLayerId);
    const buildingSourceId = buildingLayer.source;

    // Get all features from the building source
    let buildingFeatures = props.map.querySourceFeatures(buildingSourceId);
    const uniqueFeatures = [];
    const uniqueIds = new Set();

    for (const feature of buildingFeatures) {
        if (feature.properties && feature.properties.OBJECTID && !uniqueIds.has(feature.properties.OBJECTID)) {
            uniqueFeatures.push(feature);
            uniqueIds.add(feature.properties.OBJECTID);
        }
    }

    normalizeFeatureQuery(uniqueFeatures);

    // Check which building features have matching IDs in their buildings array
    const matchingBuildingIds = [];
    uniqueFeatures.forEach(buildingFeature => {
      if (buildingFeature.properties && buildingFeature.properties.buildings && Array.isArray(buildingFeature.properties.buildings)) {
        const hasMatch = buildingFeature.properties.buildings.some(buildingId =>
          searchIds.includes(String(buildingId))
        );
        if (hasMatch && buildingFeature.properties.OBJECTID) {
          matchingBuildingIds.push(buildingFeature.properties.OBJECTID);
        }
      }
    });

    searchFeatures = uniqueFeatures.filter(feature => feature.properties && feature.properties.OBJECTID && searchIds.includes(String(feature.properties.OBJECTID)));

    if (matchingBuildingIds.length > 0) {
      for (const feature of searchFeatures) {
        props.map.setFeatureState(
          { source: buildingSourceId, id: feature.properties.OBJECTID },
          { 'search-item': true }
        );
    };


      console.log(`Highlighted ${matchingBuildingIds.length} buildings with matching IDs:`, matchingBuildingIds);
    } else {
      // Reset to default paint when no matches
      resetBuildingLayerPaint();
    }
  }

  function normalizeFeatureQuery(featureArray) {

    const propertyDefinitions = {
      "address": "Array",
      "PRIMARY": "String",
      "buildings": "Array",
      "OBJECTID": "Number",
      "STREET": "String"
    }

    featureArray.map(feature => {
      Object.keys(feature.properties).map (prop => {
        feature.properties[prop] = parseStringifiedValue(feature.properties[prop], propertyDefinitions[prop] || "String");
      });
    });
  }

  function parseStringifiedValue(str, type) {
    switch (type) {
      case "Array":
        try {
          // Handle case where it might already be an array
          if (Array.isArray(str)) return str;

          // Handle null/undefined
          if (!str) return [];

          // Parse the encoded JSON string
          return JSON.parse(str);
        } catch (error) {
          console.warn('Failed to parse stringified array:', str, error);
          return [];
        }
      case "Number":
        try {
          // Handle case where it might already be an number
          if (typeof(str) === 'number') return str;

          // Handle null/undefined
          if (!str) return null;

          // Parse the encoded JSON string
          return JSON.parse(str);
        } catch (error) {
          console.warn('Failed to parse stringified number:', str, error);
          return null;
        }
      case "String":
      default:
        return String(str);
    }
  }

  function resetBuildingLayerPaint() {
     const selectedFeatures = map.queryRenderedFeatures({
        layers: ['1920-buildings-layer'], // Specify the layer(s) to query
        filter: ['==', ['feature-state', 'search-item'], true]
    });
  }

  function updateYear(newYear) {
    appYear.value = newYear;
    if (resultsPaneRef && resultsPaneRef.value) {
      resultsPaneRef.value.yearChanged(newYear);
    }
  }

  const handleMapCreated = async (mapbMap) => {
    mbMap.value = mapbMap;
    await getPOIs();
    await getStreets();
    await getBurnedArea();
    await getBuildings();
    await getGreenwoodBuildings();
    //poiLayerRef.value.fitMapToMarkers();
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
      id: feature?.id || feature.properties?.id || feature.properties?.location_id || feature.properties?.OBJECTID,
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
      mbMap.value = mglMapRef.value.map;
    }
  });

  onUpdated(() => {
    const searchBar = yearSearchBarRef.value;
    if (searchBar) {
      document.getElementById('search-input').focus();
    }
  });

  async function getPOIs() {
    let poiGeoJSONTemplate = {
      type: 'geojson',
      data: {
        id: 'poi-source',
        type: 'FeatureCollection',
        features: []
      },
      promoteId: 'location_id'
    };

    fetchGeoJson(`${backendHost}/api/v2/search?search=data-poi&strict=false`)
    .then(response => response.json())
    .then(data => {
      let features = utils.dedupeByCustomKey(data.features, feature => feature.properties.location_id);
      poiGeoJSONTemplate.data.features = features;
      poiGeoJSON.value = poiGeoJSONTemplate;
    })
    .then(() => {
      utils.delayedAction(
          mglMapRef.value.fitMapToMarkers,
          1000);
    })
  };

  async function getBuildings() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}tulsa-building-footprints.geojson`);
      const data = await response.json();
      building1920GeoJSONAll.value = {
        type: 'geojson',
        data: data
      };
      building1920GeoJSONAll.value.data.id = '1920-all-building-source';
    } catch (error) {
      console.error('Error loading buildings data:', error);
    }
  };

  async function getGreenwoodBuildings() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}Greenwood_Buildings_updated.geojson`);
      const data = await response.json();
      building1920GeoJSON.value = {
        type: 'geojson',
        data: data,
        promoteId: 'OBJECTID'
      };
      building1920GeoJSON.value.data.id = '1920-building-source';
    } catch (error) {
      console.error('Error loading buildings data:', error);
    }
  };

  async function getStreets() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}tulsa-roads.geojson`);
      const data = await response.json();
      street1920GeoJSON.value = {
        type: 'geojson',
        data: data
      };
      street1920GeoJSON.value.data.id = '1920-street-source';
    } catch (error) {
      console.error('Error loading streets data:', error);
    }
  };

  async function getBurnedArea() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}tulsa-burned-area.geojson`);
      const data = await response.json();
      burnedAreaGeoJSON.value = {
        type: 'geojson',
        data: data
      };
      burnedAreaGeoJSON.value.data.id = '1920-burned-area-source';
    } catch (error) {
      console.error('Error loading burned area data:', error);
    }
  };

  function closeLandingPage() {
    showLanding.value = false;
  }

  function openLandingPage() {
    clearResults();
    showLanding.value = true;
  }

  function nameLayerDefinition(layerId, type, paint, layout, ...addlOptions) {
    const hasYear = appYear.value && utils.isYear(appYear.value);
    const YearExemptLayers = ['1920-burned-area-layer', 'poi-layer', '1920-street-layer', '1920-building-layer', '1920-all-building-layer', '1920-names-layer'];

    const filterParts = ['all'];

    if (hasYear && !YearExemptLayers.includes(layerId)) {
      filterParts.push(['==', ['get', 'year'], appYear.value === "" ? "" : Number.parseInt(appYear.value).toString()]);
    }

    if (layerId === '1920-names-layer') {
      filterParts.push(['>=', ['zoom'], 16]);
    }

    const filter = filterParts;

    return {
      id: layerId,
      type: type,
      paint: paint,
      layout: layout,
      filter: filter,
      ...addlOptions
    }
  }

</script>

<template>
  <transition name="slide" mode="out-in">
    <LandingPage
      ref="landingPageRef"
      v-if="showLanding"
      class="landing-overlay-absolute"
      @close="closeLandingPage">
    </LandingPage>
  </transition>
  <!-- FAB Component to create menu with dynamic buttons-->
  <FABMain nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" @click="openLandingPage">
  </FABMain>

  <!-- YearSelector Component to change year and perform searches -->
  <YearSearchBar ref="yearSearchBarRef" @clear="clearResults" :onSearch="handleSearch" :onYearChange="updateYear" :years="years"></YearSearchBar>

  <!-- Map Component with layer containing dynamic GeoJSON search results-->
  <MglMap nonce="ajJERjdDc1g5MlFadlZfdGdFIWI4dVchQ3o4Q3ZRYlQ=" :class="['map-area', { 'map-area-shrunk' : showResults }]" :year="appYear" ref="mglMapRef" @created="handleMapCreated" :dynamicGeoJsonIds="{'dynamicLayers': dynamicLayers, 'dynamicSources': dynamicSources}">
  <!-- <MglMap :year="appYear" ref="mglMapRef" @created="handleMapCreated" :dynamicGeoJsonIds="{'dynamicLayers': dynamicLayers, 'dynamicSources': dynamicSources}" :paintOptions="markerPaintOptions"> -->
    <DynamicGeoJsonLayer
      v-if="geoJson && geoJson.data && geoJson.data.features && geoJson.data.features.length > 0"
      :geojson="geoJson"
      :type="'circle'"
      :paint="markerPaintOptions['Search Results']"
      :layout="{ 'visibility': 'visible' }"
      layerId="search-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature">
    </DynamicGeoJsonLayer>
    <!--<DynamicGeoJsonLayer
      v-if="poiGeoJSON && poiGeoJSON.data && poiGeoJSON.data.features && poiGeoJSON.data.features.length > 0"
      ref="POILayerRef"
      :geojson="poiGeoJSON"
      :type="'circle'"
      :paint="markerPaintOptions['Points of Interest']"
      :layout="{ 'visibility': 'visible'
      }"
      layerId="poi-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature"
      :searchTerm="searchTerm">
    </DynamicGeoJsonLayer>-->
    <DynamicGeoJsonLayer
      v-if="street1920GeoJSON && street1920GeoJSON.data && street1920GeoJSON.data.features && street1920GeoJSON.data.features.length > 0"
      ref="street1920LayerRef"
      :geojson="street1920GeoJSON"
      :type="'line'"
      :paint="markerPaintOptions['street1920Paint']"
      :layout="{ 'visibility': 'visible' }"
      layerId="1920-street-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature">
    </DynamicGeoJsonLayer>
    <DynamicGeoJsonLayer
      v-if="burnedAreaGeoJSON && burnedAreaGeoJSON.data && burnedAreaGeoJSON.data.features && burnedAreaGeoJSON.data.features.length > 0"
      ref="burnedArea1920LayerRef"
      :geojson="burnedAreaGeoJSON"
      :type="'fill'"
      :paint="markerPaintOptions['burnedAreaPaint']"
      :layout="{ 'visibility': 'visible' }"
      layerId="1920-burned-area-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature">
    </DynamicGeoJsonLayer>
    <DynamicGeoJsonLayer
      v-if="building1920GeoJSONAll && building1920GeoJSONAll.data && building1920GeoJSONAll.data.features && building1920GeoJSONAll.data.features.length > 0"
      ref="allBuilding1920LayerRef"
      :geojson="building1920GeoJSONAll"
      :type="'fill'"
      :paint="markerPaintOptions['nytAllBuildingPaint']"
      :layout="{ 'visibility': 'visible' }"
      layerId="1920-all-building-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature">
    </DynamicGeoJsonLayer>
    <DynamicGeoJsonLayer
      v-if="building1920GeoJSON && building1920GeoJSON.data && building1920GeoJSON.data.features && building1920GeoJSON.data.features.length > 0"
      ref="building1920LayerRef"
      :geojson="building1920GeoJSON"
      :type="'fill'"
      :paint="markerPaintOptions['nytBuildingPaint']"
      :layout="{ 'visibility': 'visible' }"
      layerId="1920-building-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature"
      :poiGeoJson="poiGeoJSON">
    </DynamicGeoJsonLayer>
    <MglSymbolLayer
      v-if="building1920GeoJSON && building1920GeoJSON.data && building1920GeoJSON.data.features && building1920GeoJSON.data.features.length > 0"
      ref="names1920LayerRef"
      :geojson="building1920GeoJSON"
      layerId="1920-names-layer"
      sourceId="1920-building-source"
      :layer="nameLayerDefinition('1920-names-layer', 'symbol',
      {
        'text-color': '#010101',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 3,
        'text-halo-blur': 1
      },
      {
        'text-field': [
          'format',
            [
              'case',
              ['has', 'title'],
              ['get', 'title'],
              ['get', 'POI']
            ],
            {
              'text-color': '#006636'
            },
            '\n',
            {},
            [
              'case',
              ['has', 'address'],
              [
                'case',
                ['>', ['length', ['get', 'address']], 0],
                ['at', 0, ['get', 'address']],
                ''
              ],
              ''
            ],
            { 'font-scale': 0.75}
        ],
        'text-font': ['Figtree'],
        'text-anchor': 'center',
        'text-allow-overlap': false,
        'text-ignore-placement': false,
        'text-letter-spacing': 0.1,
        'visibility': 'visible'
      })"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature"
      :searchTerm="searchTerm">
    </MglSymbolLayer>

    <!--
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
        'text-allow-overlap': false,
        'text-ignore-placement': false-->
    <!-- <DynamicGeoJsonLayer
      v-if="census1920GeoJson && census1920GeoJson.data && census1920GeoJson.data.features && census1920GeoJson.data.features.length > 0"
      ref="census1920LayerRef"
      :geojson="census1920GeoJson"
      :type="'circle'"
      :paint="census1920GeoJsonFeaturePaint"
      :layout="{ 'visibility': 'visible' }"
      layerId="1920-census-layer"
      :filterYear="appYear"
      :map="mbMap"
      :featureFormatter="formatFeature"
      :searchTerm="searchTerm"
    </DynamicGeoJsonLayer> -->
  </MglMap>
  <!-- Results Pane Component containing search results-->
  <transition name="slide-results" mode="out-in">
    <!-- <ResultsPane -->
    <ResultsPane v-if="showResults"
      ref="resultsPaneRef"
      class="results-pane"
      :years="years"
      :year="appYear"
      @update:geojson="handleGeojson">
    </ResultsPane>
  </transition>
</template>

<style scoped>
  .map-area {
    width: 100vw;
    height: var(--map-height);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .map-area-shrunk {
    width: var(--map-width);
  }
</style>

<style>

  .landing-overlay-absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10001;
  }
/*
  .mgl-map-wrapper {
    height: var(--map-height);
    width: var(--map-width);
  } */
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

  .dialog {
    border: none;
    border-radius: 0.5rem;
    width: 90vw;
    max-width: 56.25rem;
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
</style>