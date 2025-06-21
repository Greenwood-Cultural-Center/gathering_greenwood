<script setup>
import { onMounted, computed, useTemplateRef} from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CustomControl from '@CustomControls/CustomControl.vue';
import utils from '@utils/utils.js'

const control = useTemplateRef('control');

const mapboxLayerTypes = ['background', 'circle', 'fill', 'fill-extrusion', 'heatmap', 'hillshade', 'line', 'model', 'raster', 'raster-particle', 'symbol', 'sky'];

const visibleMarkerPaintOptions = computed(() => {
  return Object.fromEntries(
    Object.entries(props.markerPaintOptions)
      .filter(([key, value]) => value.visibility !== false)
  );
});

const props = defineProps({
  markerPaintOptions: {
    type: Object,
    required: true
  },
  position: {
    type: String,
    default: 'bottom-right'
  },
});

onMounted(() => {

});

const controlType = 'legend';

// Expose the onAdd and onRemove methods for Mapbox GL JS
defineExpose({
  onAdd () {
    return control.value.onAdd(map);
  },
  onRemove () {
    return control.value.onRemove(map);
  }
});

// Generate CSS variables for each circle
function circleStyles(config) {
  const strokeColor = config['circle-stroke-color'] || '#ffffff';
  const strokeOpacity = config['circle-stroke-opacity'] || 1;

  return {
    '--circle-radius': config['circle-radius'] || 8,
    '--circle-opacity': config['circle-opacity'] || 1,
    '--circle-color': colorToRgba(config['circle-color'] || '#000000', config['circle-opacity'] || 1),
    '--circle-stroke-color-rgba': colorToRgba(strokeColor, strokeOpacity),
    '--circle-stroke-width': `${config['circle-stroke-width'] || 3}px`,
    '--circle-blur': Math.abs(config['circle-blur'] || 0),
    type: 'circle',
  };
};

const Styles = computed(() => {
  const stylesObj = {};
  Object.entries(visibleMarkerPaintOptions.value).forEach(([key, config]) => {
    stylesObj[key] = buildStyleFromConfig(config);
  });
  return stylesObj;
});

function buildStyleFromConfig(config) {
  switch(getLayerType(config)) {
      case 'circle': return circleStyles(config);
      default: return {};
  }
}

function getLayerType(obj){
  for (const key of Object.keys(obj)) {
    const match = mapboxLayerTypes.find(type => key.includes(type));
    if (match) return match;
  };
  return null;
}

function colorToRgba(color, opacity = 1) {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const a = parseInt(hex.substr(6, 2), 16) / 255 || opacity; // Handle 8-digit hex with alpha
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Handle rgb() colors
  if (color.startsWith('rgb')) {
    const values = utils.extractValuesFromRGB(color);
    return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
  }

  if (isValidNamedColor(color)) {
    var div = $('<div></div>').appendTo("body").css('background-color', color);
    var computedStyle = window.getComputedStyle(div[0]);
    var computedColor = computedStyle.backgroundColor;
    div.remove();
    const values = computedColor.match(/\d+/g);
    return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`
  }

  // Fallback to original color
  return color;
}

function getBlurClass(blur) {
  if (blur > 0) return 'blur-positive';
  if (blur < 0) return 'blur-negative';
  return 'blur-none';
}

</script>

<template>
  <CustomControl
    ref="control"
    :position="position"
    :prepend="false"
    :prependParentId="null"
    :group="false"
    :customControlType="controlType">
    <div class='mapboxgl-ctrl-legend'>
      <div class='legend-header'>Legend</div>
      <div
        v-for="(item, name, index) in visibleMarkerPaintOptions"
        :key="index"
        class='legend-item'
      >
        <div
          :class="[ `map-${getLayerType(item)}`, 'item-glyph' , getBlurClass(item[`${getLayerType(item)}-blur`])]"
          :style="Styles[name]"
        ></div>
        <span class="item-label">{{ name }}</span>
      </div>
    </div>
  </CustomControl>
</template>

<style scoped>

.mapboxgl-ctrl-legend:deep(.mapboxgl-ctrl-custom) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mapboxgl-ctrl-legend {
  position: relative;
  padding: 1rem;
  border-radius: var(--gcc-border-radius);
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background-color: rgb(173, 173, 173);
  min-width: 9.375rem;
  font-size: 2.5rem;
  width: auto;
  height: auto;
  overflow: visible;
  align-items: center;
  border: 0.125rem solid var(--gcc-black);
}

.legend-header {
  font-size: 1.17rem;
  font-weight: bold;
  color: var(--gcc-black);
  margin: 0 0 1em 0;
  display: block;
  text-align: center;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.6875rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.legend-item:last-child {
  margin-bottom: 0; /* Remove margin from last item */
}

.item-glyph {
  background-color: var(--circle-color);
  opacity: var(--circle-opacity);
  border: var(--circle-stroke-width) solid var(--circle-stroke-color-rgba);
  flex-shrink: 0;
}

.map-circle {
  width: calc(var(--circle-radius) * 2px);
  height: calc(var(--circle-radius) * 2px);
  border-radius: 50%;
}

.item-label {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--gcc-black);
  white-space: nowrap;
  padding: 2px 6px;
}

.blur-none {
  filter: none;
}

.blur-positive {
  filter: blur(calc(var(--circle-blur) * 5px));
  background: radial-gradient(circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, calc(1 - var(--circle-blur))) 100%
  );
}

.blur-negative {
  background: radial-gradient(circle,
    rgba(255, 255, 255, calc(1 + var(--circle-blur))) 0%,
    rgba(255, 255, 255, 1) 100%
  );
}
</style>