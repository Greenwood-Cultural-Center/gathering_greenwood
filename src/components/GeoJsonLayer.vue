<template>
  <MglGeojsonLayer
    :sourceId="`geojson-source-${props.Name}`"
    :source="geojsonData"
    :layerId="`${props.Name}-layer`"
    :layer="{
      type: 'fill',
      paint: {
        'fill-color': '#888',
        'fill-opacity': 0.5
      }
    }"
  />
  </template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { MglGeojsonLayer } from 'vue-mapbox3'; // Import MapboxLayer component

// Props
const props = defineProps({
  geojsonUrl: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  }
});

// Reactive GeoJSON data
const geojsonData = ref(null);

// Fetch GeoJSON data when the component is mounted
onMounted(async () => {
  try {
    const response = await fetch(props.geojsonUrl);
    geojsonData.value = await response.json();
  } catch (error) {
    console.error('Error loading GeoJSON:', error);
  }
});
</script>