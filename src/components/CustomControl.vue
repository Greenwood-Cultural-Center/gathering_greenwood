<script setup>
import { onMounted, ref, inject, useTemplateRef, computed, nextTick, onBeforeUnmount, onBeforeMount, h, render, useAttrs, useSlots, Fragment } from 'vue';
import { createCustomControl } from '../models/CustomControl.js'

// Inject the map instance
const map = inject('map');
const mapbox = inject('mapbox');

const slots = useSlots();
const control = ref({});
const container = ref(null);
const $attrs = useAttrs();

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-right',
  },
  prepend: {
    type: Boolean,
    default: false,
  },
  customControlType: {
    type: String,
    default: '',
  },
  prependParentId: {
    type: String,
    default: null,
  },
  containerClass: {
    type: String,
    default: null,
  },
  group: {
    type: Boolean,
    default: false,
  },
  classList: {
    type: Array,
    default: () => ['mapboxgl-ctrl-custom'],
  },
});

const options = computed(() => ({
  position: props.position,
  prepend: props.prepend,
  classList: props.classList,
  container: container.value,
  group: props.group,
  parentId: props.prepend ? props.prependParentId || `mapboxgl-ctrl-${props.position}`: null,
  label: props.customControlType,
}));

function createElementFromHTML(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild
}
onBeforeMount(() => {
  let classList = props.classList || [];
  classList.push(props.containerClass || (props.customControlType ? `custom-mapbox-${props.customControlType}-control` : `custom-mapbox3-control`));
  container.value = createElementFromHTML(`<div id="mapboxgl-ctrl-custom" class="mapboxgl-ctrl ${classList.join(' ')} ${$attrs.class}"></div>`);
  control.value = createCustomControl(options.value);
}),

onMounted(() => {
  map.value.addControl(control.value, props.position);
  // Move slot content into control container
  if (slots.default && control.value._container) {
    render(h(Fragment, slots.default()), control.value._container);
  }
});

const parentClass = computed(() => {
  const mapboxgl_ctrl_class = 'mapboxgl-ctrl';

  return `${mapboxgl-ctrl_class}-${props.position}`;
});

onBeforeUnmount(() => {
  if (map.value && control.value) {
    map.value.removeControl(control.value);
  }
  // Optionally, also remove the container from the DOM if needed
  if (control.value._container?.parentNode) {
    control.value._container.parentNode.removeChild(control.value._container);
  }
});

// Expose the onAdd and onRemove methods for Mapbox GL JS
defineExpose({
  onAdd () {
    return control.onAdd(map);
  },
  onRemove () {
    return control.onRemove(map);
  },
});
</script>

<template>
  <div v-if="!container" class="mapboxgl-ctrl mapboxgl-ctrl-group custom-mapbox3-control">
    <slot></slot>
  </div>
  <slot v-else></slot>
</template>