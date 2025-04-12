<template>
  <MapboxLayer
    v-if="geojsonData"
    :id="layerId"
    :source-id="`geojson-source-${props.Name}`"
    :source="{
      type: 'geojson',
      data: geojsonData
    }"
  />
  </template>

  <script setup>
    import { ref, onMounted, defineProps } from 'vue';
    import shp from 'shpjs'; // Import shpjs to parse Shapefiles
    import { MapboxLayer } from '@studiometa/vue-mapbox-gl'; // Import MapboxLayer component

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

    // Generate layerId from Name prop
    const layerId = `${props.Name}-layer`;

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

  <style scoped>
    /* You can add custom styles for the shapefile layer component if needed */
  </style>