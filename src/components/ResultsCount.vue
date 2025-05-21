<script setup>
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    count: {
      type: Object,
      required: true,
    },
    loading : {
      type: Boolean,
      default: false,
    },
  });

  function formatKey(key, val) {
    if (key === 'media') return 'media';
    if (key === 'people') return val === 1 ? 'person' : 'people';
    if (key === 'stories') return val === 1 ? 'story' : 'stories';
    if (key === 'census_records') return val === 1 ? 'census record' : 'census records';
    if (val === 1 && key.endsWith('s')) return key.slice(0, -1);
    return key;
  }

  const displayItems = computed(() => {
    return Object.entries(props.count)
      .filter(([key, val]) => val > 0 && key !== 'year' && key !== 'totalFlag')
      .map(([key, val]) => `${val} ${formatKey(key, val)}`);
  });
</script>

<template>
  <div v-if="!loading" class="results-count">
    <span v-if="displayItems.length">{{ displayItems.join(', ') }}</span>
    <span v-else>No results</span>
  </div>
</template>

<style scoped>
  .results-count {
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: bold;
    color: var(--gcc-dk-green);
    font-style: italic;
  }

  @media screen and (max-width: 1600px) {
    .results-count {
      font-size: 1.5rem;
    }
  }
</style>