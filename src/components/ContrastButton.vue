<script setup>
import { onMounted, useTemplateRef} from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CustomControl from './CustomControl.vue';

const control = useTemplateRef('control');

function onClick() {
  // Your control logic here
  alert('Custom control clicked!');
}

onMounted(() => {

});

const controlType = 'contrast';

// Expose the onAdd and onRemove methods for Mapbox GL JS
defineExpose({
  onAdd () {
    return control.value.onAdd(map);
  },
  onRemove () {
    return control.value.onRemove(map);
  }
});
</script>

<template>
  <CustomControl
    ref="control"
    :position="'bottom-right'"
    :prepend="false"
    :prependParentId="null"
    :group="false"
    :customControlType="controlType">
    <button @click="onClick" :class="['custom-mapbox-contrast', $attrs.class]">
      <FontAwesomeIcon icon="circle-half-stroke"></FontAwesomeIcon>
    </button>
  </CustomControl>
</template>

<style scoped>
/* .custom-mapbox3-control {
  position: absolute;
  right: 0.625rem;
  bottom: 26.8875rem;
  z-index: 2;
  border-radius: var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius);
} */

button.custom-mapbox-contrast:hover {
  Background-color: var(--gcc-beige);
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.2);
}

button.custom-mapbox-contrast {
  background: var(--gcc-dk-green);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
  border-radius: var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius) var(--gcc-border-radius);
  font-size: 2.5rem;
  width: 4rem;
  height: 6rem;
  padding: 0;
}
</style>
