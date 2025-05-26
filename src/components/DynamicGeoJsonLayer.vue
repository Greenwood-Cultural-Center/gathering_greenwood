<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { MglGeojsonLayer } from 'vue-mapbox3';
  import FeatureModal from './FeatureModal.vue';
  import utils from '../utils/utils.js';

  const emit = defineEmits(['feature-click'])

  const props = defineProps({
    geojson: {
      type: Object,
      required: true,
      validator: (val) =>
        val && typeof val === 'object' &&
        val.type === 'geojson' &&
        val.data && typeof val.data === 'object' &&
        val.data.type === 'FeatureCollection' &&
        Array.isArray(val.data.features) &&
        val.data.features.length >= 0,
    },
    type: {
      type: String,
      required: true,
      validator: val => ['fill', 'line', 'circle', 'symbol'].includes(val)
    },
    paint: {
      type: Object,
      default: () => ({}),
      validator: val => typeof val === 'object' &&
        Object.keys(val).length > 0 &&
        Object.values(val).every(value => typeof value === 'string' || typeof value === 'number')
    },
    layout: {
      type: Object,
      default: () => ({}),
      validator: val => typeof val === 'object' &&
        Object.keys(val).length > 0 &&
        Object.values(val).every(value => typeof value === 'string' || typeof value === 'boolean')
    },
    layerId: {
      type: String,
      default: () => `layer-${Math.random().toString(36).slice(2)}`
    },
    filterYear: {
      type: String,
      default: ''
    },
    map: {
      type: Object,
      required: true,
      validator: val => val && typeof val === 'object' && 'on' in val && 'off' in val
    }
  })

  const clickedfeature = ref({});

  const dialogRef = ref(null);

  // Conditionally apply filter based on string year
  const layerDefinition = computed(() => {
    const filter = props.filterYear && utils.isYear(props.filterYear)
      ? ['==', ['get', 'year'], props.filterYear]
      : ['has', 'year']

    return {
      id: props.layerId,
      type: props.type,
      paint: props.paint,
      layout: props.layout,
      filter: filter,
    }
  })

  onMounted(() => {
    props.map.on('click', props.layerId, handleClick); // Attach click listener to the layer
  })

  onUnmounted(() => {
    props.map.off('click', props.layerId, handleClick); // Clean up click listener
  })

  // function handleClick(e) {
  //   const features = e.features;
  //   if (features.length > 0) {
  //     const clickedFeature = features[0];
  //     console.log('Clicked feature:', clickedFeature);
  //     new mapboxgl.Popup()
  //       .setLngLat(e.lngLat)
  //       .setHTML(`<h3>${clickedFeature.properties.name}</h3><p>${clickedFeature.properties.description}</p>`)
  //       .addTo(this.$refs.map.map);
  //   }
  // }

  function handleClick(e) {
    console.log('Feature clicked:', e.features);
    clickedfeature.value = formatFeature(e.features[0]);
    dialogRef.value?.openDialog();
  }

  function formatFeature(feature) {
    return {
      type: feature.type,
      geometry: feature.geometry,
      properties: formatProperties(feature.properties)
    }
  }

  function formatProperties(properties) {
    for (const key in properties) {
      if (properties[key] === null || properties[key] === undefined) {
        properties[key] = 'N/A';
      }
      else {
        try {
          properties[key] = JSON.parse(properties[key]);
        } catch (e) {
          // If parsing fails, keep the original value
        }
      }
    }
    properties.people = properties[1910].concat(properties[1920])
    return properties;
  }
</script>

<template>
  <MglGeojsonLayer
    :layerId="layerId"
    :source-id="geojson.data.id"
    :source="geojson"
    :reactive="true"
    :layer="layerDefinition"
  />
  <FeatureModal
    v-if="clickedfeature"
    :feature="clickedfeature"
    ref="dialogRef"/>

</template>