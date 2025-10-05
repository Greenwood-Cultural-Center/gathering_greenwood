<script setup>
import { inject, ref, nextTick, watch } from 'vue';
import CustomControl from '@CustomControls/CustomControl.vue';


const map = inject('map');
const mapbox = inject('mapbox');
const zoom = ref(0);

const controlType = "zoomlevel"
const updateZoom = async () => {
  const mapVal = map.value;
  if (mapVal) {
    zoom.value = mapVal.getZoom().toFixed(2);
    await nextTick();
  }
};

const setupEventListeners = (mapInstance) => {
    mapInstance.on('zoomend', updateZoom);
    mapInstance.on('boxzoomend', updateZoom);
    mapInstance.on('boxzoomcancel', updateZoom);
    mapInstance.on('zoom', updateZoom);
    updateZoom();
};

let stopWatcher;

// Check for map immediately and set up watchers
if (map.value) {
  setupEventListeners(map.value);
} else {
  // Only create watcher if map is not immediately available
  stopWatcher = watch(map, (newMapVal) => {
    if (newMapVal) {
      setupEventListeners(newMapVal);
      stopWatcher();
    }
  }, { immediate: true });
}

</script>

<template>
  <CustomControl
    ref="control"
    :customControlType="controlType"
    :position="'top-right'"
    :classList="['mapboxgl-ctrl','mapboxgl-ctrl-group','zoom-level']"
  >
    <button
      class="mapboxgl-ctrl-icon"
      type="button"
      title="Zoom Level"
      aria-label="Zoom Level"
      @click.prevent
    >
      <span>{{ zoom }}</span>
    </button>
  </CustomControl>
</template>

<style scoped>
  .zoom-level {
    background: var(--gcc-dk-green);
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
    border-radius: var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius);
    font-size: 1.5rem;
    width: 4rem;
    height: 4rem;
    padding: 0;
    color: var(--gcc-orange);
  }

  span {
    color: var(--gcc-orange);
  }
</style>