<script setup>
  import { ref, computed, getCurrentInstance } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  const props = defineProps({
    icon: {
      type: String,
      required: true
    },
    iconTitle: {
      type: String,
      default: ''
    }
  });

  const instance = getCurrentInstance();

  const hasClickListener = computed(() => {
    if (!instance) return false;
    return !!instance.attrs?.onClick; // Check for onClick attribute
  });

</script>

<template>
  <li>
    <div v-if="hasClickListener" role="button" tabindex="0" @click="$emit('click')" @keyup.enter="$emit('click')" class="list-item clickable">
      <span class="fa-li"><FontAwesomeIcon :icon="icon" :title="iconTitle" /></span><slot></slot>
    </div>
    <template v-else>
      <span class="fa-li"><FontAwesomeIcon :icon="icon" :title="iconTitle" /></span><slot></slot>
    </template>
  </li>
</template>