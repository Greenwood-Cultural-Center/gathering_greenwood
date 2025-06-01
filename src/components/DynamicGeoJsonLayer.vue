<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { MglGeojsonLayer } from 'vue-mapbox3';
  import FeatureModal from './FeatureModal.vue';
  import utils from '../utils/utils.js';

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
    },
    featureFormatter: {
      type: Function,
      default: (feature) => feature
    },
    searchTerm: {
      type: String,
      default: ''
    }
  })

  const clickedfeature = ref({id:0, properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } });

  const dialogRef = ref(null);

  // Conditionally apply filter based on string year
  const layerDefinition = computed(() => {
    const filter = !props.filterYear || !utils.isYear(props.filterYear)
    ? !props.searchTerm
      ? ['all'] // equivalent to "match all"
      : ['all', ['in', props.searchTerm.toLowerCase(), ['get', 'searchable_text']]]
    : !props.searchTerm
      ? ['all', ['==', ['get', 'year'], props.filterYear]]
      : ['all', ['==', ['get', 'year'], props.filterYear], ['in', props.searchTerm.toLowerCase(), ['get', 'searchable_text']]];

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

  function validateJsonData(json) {
    if (!json || !json.data || !json.data.features || !Array.isArray(json.data.features)) {
      console.warn('Invalid GeoJSON data, expected an object with a features array.');
      return { type:'geojson', data: { id: data.id, type: 'FeatureCollection', features: [] } };
    }
    if (!json.data.id || typeof json.data.id !== 'string') {
      console.error('GeoJSON data is missing a valid id');
      return;
    }
    return json;
  }

  function handleClick(e) {
    if (!e || !e.features || e.features.length === 0) return;
    if (e.features.length > 1) {
      console.warn('Multiple features clicked, only the first will be processed.');
    }
    if (!e.features[0].properties) {
      console.warn('Clicked feature has no properties, skipping.');
      return;
    }
    if (!props.featureFormatter || typeof props.featureFormatter !== 'function') {
      console.warn('featureFormatter is not a valid function, using default formatter.');
      props.featureFormatter = (feature) => feature;
    }
    clickedfeature.value = props.featureFormatter(e.features[0]);
    dialogRef.value?.openDialog();
  }
</script>

<template>
  <MglGeojsonLayer
    :layerId="layerId"
    :source-id="geojson.data.id"
    :source="validateJsonData(geojson)"
    :reactive="true"
    :layer="layerDefinition"
  />
  <!-- <slot name="modal" :feature="clickedfeature" />
  <slot /> -->
  <FeatureModal
    v-if="clickedfeature"
    :feature="clickedfeature"
    ref="dialogRef"/>

</template>