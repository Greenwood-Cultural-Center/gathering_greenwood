<script setup>
  import { ref, computed, watch, defineExpose } from 'vue';
  import SearchBar from './SearchBar.vue';
  import ResultsCount from './ResultsCount.vue';
  import SearchResult from './SearchResult.vue';
  import LastSearch from './LastSearch.vue'

  const props = defineProps({
    year: String
  });

  const loading = ref(false);
  const lastSearch = ref('');

  const categoryOrder = [
    'buildings',
    'people',
    'census_records',
    'documents',
    'media',
    'stories'
  ];

  const orderedResults = computed(() => {
    return categoryOrder
      .map((key) => {
        const group = results.value.find((group) => group[key]);
        if (group && Array.isArray(group[key]) && group[key].length > 0) {
          return group;
        }
        return null;
      })
      .filter(Boolean);
  });

  function formatCategory(key) {
    return key === 'narratives' ? 'Stories' : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
  }

  const emit = defineEmits(['update:geojson', 'update:results', 'update:resetMap']);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  console.log('Backend Host:', backendHost);
  console.log('Backend Host:', import.meta.env.VITE_BACKEND_HOST);
  console.log('Year:', props.year);

  const searchTerm = ref('');
  const results = ref([]);
  const count = ref({});
  const geojson = ref(null);

  function resetState() {
    results.value = [];
    count.value = {};
    lastSearch.value = '';
  }

  defineExpose({
    resetState,
  });

  async function search(searchTerm) {
    loading.value = true;

    emit('update:resetMap', true);
    // Reset state BEFORE fetching
    resetState();

    try {
      const backendHost = import.meta.env.VITE_BACKEND_HOST;
      const [resultsRes, geoJsonRes] = await Promise.all([
        fetch(`${backendHost}/api/json?search=${searchTerm}&year=${props.year}`),
        fetch(`${backendHost}/api/search?search=${searchTerm}&year=${props.year}`)
      ]);

      const resultsData = await resultsRes.json();
      const geoData = await geoJsonRes.json();

      results.value = resultsData.results;
      count.value = resultsData.count;
      lastSearch.value = searchTerm;

      emit('update:geojson', geoData);
      emit('update:results', resultsData);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="results-pane">
    <LastSearch
      :lastSearch="lastSearch"
    />
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    <ResultsCount :count="count" />

    <div class="results-list">
      <template v-for="categoryGroup in orderedResults" :key="Object.keys(categoryGroup)[0]">
        <div class="result-category">
          <h4 class="category-title">
            {{ formatCategory(Object.keys(categoryGroup)[0]) }}
          </h4>
          <SearchResult
            v-for="item in categoryGroup[Object.keys(categoryGroup)[0]]"
            :key="item?.id || item?.name || item?.description || item?.story?.name"
            :item="item"
            :category="Object.keys(categoryGroup)[0]"
          />
        </div>
      </template>
    </div>
    <!-- <SearchBar v-model="searchTerm" @search="search" /> -->
  </div>
</template>

<style scoped>
  .results-pane {
    width: 38vw;
    height: 95vh;
    background: #fdfdfd;
    padding: 1rem;
    color: #333;
    overflow-y: auto;
    border-left: var(--gcc-dk-green) .2rem solid;
  }

  .results-list {
    margin-top: 1rem;
    padding: 0.5rem;
    overflow-y: scroll;
    scrollbar-color: var(--gcc-dk-green) var(--gcc-lt-green);
    border-radius: 0.5rem;
  }

  .category-title {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    font-size: 2.5rem;
    text-align: start;
    padding-bottom: 0.25rem;
    color: var(--gcc-orange);
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }

  .spinner {
    border: 4px solid #eee;
    border-top: 4px solid var(--gcc-orange);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 0.8s linear infinite;
  }

    /* width */
  ::-webkit-scrollbar {
    width: 20rem;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-button {
    background: #e0e0e0;
    height: 25px;
    width: 20rem;
  }

  ::-webkit-scrollbar-button:hover {
    background: #233e27;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #333;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media screen and (max-width: 1600px) {
    .category-title {
      font-size: 1.7rem;
      margin-bottom: 0.1rem;
    }
  }
</style>