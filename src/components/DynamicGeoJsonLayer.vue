<script setup>
import { computed } from 'vue'
import { MglGeojsonLayer } from 'vue-mapbox3'
import utils from '../utils/utils.js'

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
  }
})

// Conditionally apply filter based on string year
const layerDefinition = computed(() => {
  const filter = props.filterYear && utils.isYear(props.filterYear)
    ? ['==', ['get', 'year'], props.filterYear]
    : undefined

  return {
    id: props.layerId,
    type: props.type,
    paint: props.paint,
    layout: props.layout,
  }
})

function handleClick(e) {
  const feature = e?.features?.[0]
  if (feature) emit('feature-click', feature)
}
</script>

<template>
  <MglGeojsonLayer
    :layerId="layerId"
    :source-id="geojson.data.id"
    :source="geojson"
    :reactive="true"
    :layer="layerDefinition"
    @click="handleClick"
  />
</template>