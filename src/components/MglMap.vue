<script setup>
  import { ref, onMounted, watch, nextTick, defineExpose } from 'vue'
  import Mapbox from "mapbox-gl";
  import { MglMap, MglNavigationControl, MglFullscreenControl, MglAttributionControl, MglGeojsonLayer } from "vue-mapbox3";
  import { filterByDate } from '@openhistoricalmap/maplibre-gl-dates'


  const props = defineProps({
    year: String
  });

  const geoJson = ref(null);
  const resultsExist = ref(false);

  // Date selection logic
  const DateOption = {
    options: [
      { year: '1910', date: '1910-04-15' },
      { year: '1920', date: '1920-01-02' },
      { year: '', date: '2025-01-01' }
    ],
    selected: ref({ year: '', date: '2025-01-01' })
  };

  function changeYear (map, newYear) {
      const match = DateOption.options.find(o => o.year === newYear);
      if (match) {
          console.log(`Selected Map year: ${match.year}`);
          DateOption.selected.value = match;
          filterByDate(map, match.date);
      }
  };

  function loadDynamicLayer(newGeoJson) {
    geoJson.value = newGeoJson;
    console.log('Loading dynamic layer with new GeoJSON:', geoJson);
    if (geoJson) {
      resultsExist.value = true;
      console.log('GeoJSON data exists:', geoJson);
    }
  }

  function resetMap () {
    const map = mapRef.value;
    console.log('Resetting map');
    resultsExist.value = false;
    map.flyTo({
      center: [-95.9872222, 36.1619444], // Reset to the default center (or your preferred location)
      zoom: 14,         // Reset zoom level to default
      essential: true, // Ensure the animation is not skipped
    });
    map.removeLayer('search-results');
    console.log(`resultsexist.value: ${resultsExist.value}`);
  };

  defineExpose({
    resetMap,
    loadDynamicLayer,
  });

  // Map style ref
  const style = ref('https://www.openhistoricalmap.org/map-styles/main/main.json');
  const center = ref([-95.9872222, 36.1619444]); // starting position [lng, lat]
  const zoom = ref(14); // starting zoom level`
  const accessToken = ref('pk.eyJ1IjoidHVsc2FtYXBwaW5nIiwiYSI6ImNtNm4yeGk2dDBybmcyc3B5Y2kwZmZ1YXoifQ.2rjdphm0vkZ_4FBht5c7AA');

  // GeoJSON data refs
  const parcels = ref(null);
  const streets = ref(null);
  const blocks = ref(null);

  const layers = [
    {
      id: 'parcels',
      url: '/data/parcels/Demo_Parcels.geojson',
      paint: {
        'fill-color': '#ff8888',
        'fill-opacity': 0.5
      }
    },
    {
      id: 'streets',
      url: '/data/streets/Demo_Street_Labels.geojson',
      paint: {
        'line-color': '#8888ff',
        'line-width': 2
      }
    },
    // {
    //   id: 'blocks',
    //   url: '/data/blocks/Demo_Blocks.geojson',
    //   paint: {
    //     'fill-color': '#88ff88',
    //     'fill-opacity': 0.5
    //   }
    // }
  ];

  // Store reference to map instance (if needed for advanced interactions)
  const mapRef = ref(null);

  // Reactive references for GeoJSON data
  const geoJsonData = ref({});

  async function loadGeoJson(url, id) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      geoJsonData.value[id] = data;
    } catch (err) {
      console.error(`Error loading ${url}:`, err);
    }
  }

  // Update selected date when `year` prop changes
  watch(
    () => props.year,
    (newYear) => {
        const map = mapRef.value;
        if (map) {
            changeYear(map, newYear);
        }
    },
    { immediate: true }
  );

  onMounted(() => {
    layers.forEach(layer => {
      loadGeoJson(layer.url, layer.id);
    });
  });

  function onMapLoaded(event) {
    const map = mapRef.value = event.map; // Store the map instance
    if (map) {
      console.log('Map loaded');
      console.log('Map instance created:', map);
      changeYear(map, props.year);
      map.once('styledata', () => {
        map.attributionControl = {
            customAttribution: '<a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>',
        };
      });
    };
  };

</script>

<template>
  <MglMap

    :accessToken="accessToken"
    :mapStyle="style"
    :center="center"
    :zoom="zoom"
    @load="onMapLoaded"
  >
    <!-- Controls -->
    <MglNavigationControl position="top-right" />
    <MglFullscreenControl position="top-right" />
    <MglAttributionControl
      position="bottom-right"
      :custom-attribution="'<a href=&quot;https://www.openhistoricalmap.org/&quot; target=&quot;_blank&quot;>OpenHistoricalMap</a>'"
    />

    <!-- Dynamic Layer Rendering -->
    <template v-for="layer in layers" :key="layer.id">
      <MglGeojsonLayer
        v-if="geoJsonData[layer.id]"
        :source-id="layer.id"
        :layer-id="`${layer.id}-layer`"
        :source="{
          type: 'geojson',
          data: geoJsonData[layer.id]
        }"
        :layer="{
          type: layer.id === 'streets' ? 'line' : 'fill',
          paint: layer.paint
        }"
      />
    </template>

    <!-- Conditionally render GeoJSON layer if data exists -->
    <MglGeojsonLayer
      v-if="resultsExist"
      :source-id="'search-results'"
      :layer-id="'search-layer'"
      :source="{
        type: 'geojson',
        data: geoJson
      }"
      :type="'circle'"
      :paint="{
        'circle-radius': 6,
        'circle-color': '#ff8800',
        'circle-opacity': 0.7
      }"
      :layer="{
        type: 'circle',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ff8800',
          'circle-opacity': 0.7
        }
      }"
    />
    <slot></slot>
  </MglMap>
</template>