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
          DateOption.selected.value = match;
          filterByDate(map, match.date);
          map.setFilter('search-results', ['==', 'date', match.year]);
      }
  };

  function loadDynamicLayer(newGeoJson) {
    geoJson.value = newGeoJson;
    if (geoJson) {
      resultsExist.value = true;
    }
  }

  function resetMap () {
    const map = mapRef.value;
    resultsExist.value = false;
    map.flyTo({
      center: [-95.9872222, 36.1619444], // Reset to the default center (or your preferred location)
      zoom: 14,         // Reset zoom level to default
      essential: true, // Ensure the animation is not skipped
    });
    map.setFilter('search-results', null); // Reset the filter
  };

  defineExpose({
    resetMap,
    loadDynamicLayer,
  });

  // Map style ref
  const style = ref('/historic.json');
  const center = ref([-95.9872222, 36.1619444]); // starting position [lng, lat]
  const zoom = ref(14); // starting zoom level`
  const accessToken = ref('pk.eyJ1IjoidHVsc2FtYXBwaW5nIiwiYSI6ImNtNm4yeGk2dDBybmcyc3B5Y2kwZmZ1YXoifQ.2rjdphm0vkZ_4FBht5c7AA');

  // GeoJSON data refs
  const parcels = ref(null);
  const streets = ref(null);
  const blocks = ref(null);

  const layers = [
    {
      id: 'streets',
      url: '/data/streets/Demo_Street_Labels.geojson',
      paint: {
        'line-color': '#8888ff',
        'line-width': 2
      }
    },
    {
      id: 'blocks',
      url: '/data/blocks/Demo_Blocks.geojson',
      paint: {
        'fill-color': '#333',
        'fill-opacity': 0.5
      }
    },
    {
      id: 'parcels',
      url: '/data/parcels/Demo_Parcels.geojson',
      paint: {
        'fill-color': '#eee',
        'fill-opacity': 0.5
      }
    }
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
      changeYear(map, props.year);
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
    <MglNavigationControl position="bottom-right" />
    <MglFullscreenControl position="bottom-right" />
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
    <template v-if="resultsExist">
      <MglGeojsonLayer
        :source-id="'search-results'"
        :layer-id="'search-layer'"
        :source="geoJson"
        :reactive="true"
        :layer="{
          type: 'circle',
          paint: {
            'circle-radius': 6,
            'circle-color': '#ff8800',
            'circle-opacity': 0.7
          }
        }"
      />
    </template>
    <slot></slot>
  </MglMap>
</template>

<style>

  :root {
    --gcc-border-radius: 0.9rem;
  }

  div.mapboxgl-ctrl-attrib.mapboxgl-compact {
    min-height: 3.333125rem;
    padding: 0.3333125rem 4rem 0.3333125rem 0;
  }

  div.mapboxgl-ctrl-attrib.mapboxgl-compact-show {
    padding-left: 0.6875rem;
    padding-right: 4.6875rem;
    visibility: visible;
    display: flex;
    align-items: center;
  }

  .mapboxgl-ctrl-attrib.mapboxgl-compact {
    background-color: var(--gcc-dk-green);
    color: var(--gcc-white);
  }

  div.mapboxgl-ctrl-group button[class^=mapboxgl-ctrl-] {
    background-color: var(--gcc-dk-green);
    width: 4rem;
    height: 6rem;
  }

  div.mapboxgl-ctrl-group button[class^=mapboxgl-ctrl-] span.mapboxgl-ctrl-icon {
    background-color: var(--gcc-dk-green);
  }

  div.mapboxgl-ctrl-group {
    background: none;
    border-radius: var(--gcc-border-radius);
  }

  div.mapboxgl-ctrl-group button:first-child {
    border-radius: var(--gcc-border-radius) var(--gcc-border-radius) 0 0;
  }

  div.mapboxgl-ctrl-group button:last-child {
    border-radius: 0 0 var(--gcc-border-radius) var(--gcc-border-radius);
  }

  div.mapboxgl-ctrl-group button:only-child {
    border-radius: var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius);
  }

  .mapboxgl-ctrl-group button[class^=mapboxgl-ctrl-]:not(.mapboxgl-ctrl-group>button:first-child):not(.mapboxgl-ctrl-group >button:last-child) {
    border-radius: initial;
  }

  div.mapboxgl-ctrl button:not(:disabled):hover {
    background-color: initial;
  }

  .mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact.mapboxgl-compact-show:hover,
  .mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact.mapboxgl-compact-show:hover button.mapboxgl-ctrl-attrib-button {
    background-color: var(--gcc-beige);
    color: #333;
  }

  .mapboxgl-ctrl button:not(:disabled):hover .mapboxgl-ctrl-icon,
  .mapboxgl-ctrl-attrib button.mapboxgl-ctrl-attrib-button:not(:disabled):hover {
    background-color: var(--gcc-beige);
    color: #333;
  }

  .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl .mapboxgl-ctrl-logo.mapboxgl-compact {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  div.mapboxgl-ctrl button.mapboxgl-ctrl-fullscreen span.mapboxgl-ctrl-icon {
    --svg:url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29'><path fill='%23b47f31' d='M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z'/></svg>");
    background-image: var(--svg);
  }

  div.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in span.mapboxgl-ctrl-icon {
    --svg:url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29'><path fill='%23b47f31' d='M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z'/></svg>");
    background-image: var(--svg);
  }

  div.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out span.mapboxgl-ctrl-icon {
    --svg:url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29'><path fill='%23b47f31' d='M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z'/></svg>");
    background-image: var(--svg);
  }

  div.mapboxgl-ctrl button.mapboxgl-ctrl-compass span.mapboxgl-ctrl-icon {
    --svg:url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29 29'><path fill='%23b47f31' d='M10.5 14l4-8 4 8h-8z'/><path id='south' d='M10.5 16l4 8 4-8h-8z'  fill='%23b47f31'/></svg>");
    background-image: var(--svg);
  }

  div.mapboxgl-ctrl button.mapboxgl-ctrl-attrib-button span.mapboxgl-ctrl-icon {
    --svg:url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill-rule='evenodd'><path fill='%23b47f31' d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/></svg>");
    background-image: var(--svg);
    background-position: 50%;
    background-repeat: no-repeat;
  }

  div.mapboxgl-ctrl button.mapboxgl-ctrl-attrib-button {
    background-image: none;
    background-color: var(--gcc-dk-green);
    padding: 0;
    height: 4rem;
    width: 4rem;
  }

  .mapboxgl-ctrl-attrib a {
    color: var(--gcc-white);
  }

  .mapboxgl-ctrl-bottom-right {
    bottom: 8.125rem;
    right: 0;
  }
</style>