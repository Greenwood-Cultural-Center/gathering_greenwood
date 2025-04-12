<script setup>
  import { faHome } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  const emit = defineEmits(['reset']);
</script>

<template>
  <button class="home-button" @click="emit('reset')">
    <FontAwesomeIcon :icon="faHome" class="icon" />
  </button>
</template>

<style scoped>
  .home-button {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    margin-bottom: 10px;
    margin-left: 10px;
    background-color: var(--gcc-dk-green);
    color: var(--gcc-orange);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: bold;
    font-size: 2rem;
    z-index: 999;
  }

  .home-button:hover {
    background-color: var(--gcc-lt-green);
    color: #fff;
  }
</style>