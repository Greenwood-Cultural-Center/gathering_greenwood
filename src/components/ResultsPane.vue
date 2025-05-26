<script setup>
  import { ref, computed, watch } from 'vue';
  import ResultsCount from './ResultsCount.vue';
  import SearchResult from './SearchResult.vue';
  import LastSearch from './LastSearch.vue';
  import { ResultsJson, ResultsGeoJson, Status, DetailedResponse, Count } from '../utils/ResponseHandler.js';

  const props = defineProps({
    year: {
      type: String,
      required: true
    },
    years: {
      type: Array,
      required: true
    }
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
    return categoryOrder.map((key) => {
        const group = results.value ? results.value[key] : null;
        if (group && Array.isArray(group) && group.length > 0 && key !== 'count') {
          return key;
        }
        return null;
      }).filter((key) => key !== null);
  });

  function formatCategory(key) {
    //var key = Object.keys(results.value)[index];
    return key === 'narratives' ? 'Stories' : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
  }

  const emit = defineEmits(['update:geojson', 'update:results']);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;

  const searchTerm = ref('');

  const results = ref(ResultsJson.createEmpty());
  const count = ref(new Count());
  const geojson = ref(ResultsGeoJson.createEmpty());

  const resultsData = ref({});
  const geoData = ref([]);

  const JsonResponse = ref(new DetailedResponse(ResultsJson.createEmpty(), null, Status.Success, null, false));
  const geoJsonResponse = ref(new DetailedResponse(ResultsGeoJson.createEmpty(), null, Status.Success, null, false));
  const filteredJson = ref(ResultsJson.createEmpty());

  function resetState() {
    results.value = ResultsJson.createEmpty();
    count.value = new Count();
    lastSearch.value = '';
  }

  defineExpose({
    resetState,
    search,
    yearChanged
  });

  function formatRawGeoJson(rawGeoJson) {
    return {
      type: 'geojson',
      data: rawGeoJson
    }
  }

  function yearChanged(newYear) {
    if (!results.value.isEmpty()) {
      if (newYear !== '') {
        filteredJson.value = (JsonResponse.value.results).filterByYear(newYear);
        results.value = filteredJson.value;
        count.value = filteredJson.value.count.filter((count)=> count.year === newYear)[0];
      } else {
        results.value = JsonResponse.value.results;
        count.value = JsonResponse.value.results.TotalCount();
      }
    }
  }

  async function search(searchValue) {
    loading.value = true;

    if (!searchValue) {
      console.error('No search value provided');
      return;
    }

    searchTerm.value = searchValue.search;
    lastSearch.value = searchValue.lastSearch;

    try {
      const [resultsRes, geoJsonRes] = await Promise.all([
        fetch(`${backendHost}/api/json?search=${searchTerm.value}`),
        fetch(`${backendHost}/api/search?search=${searchTerm.value}`)
      ]);

      resultsData.value = await resultsRes.json();
      geoData.value = await geoJsonRes.json();

      ResultsJson.fromJson((response) => {
        if (response.status === Status.Success) {
          JsonResponse.value = response;
        } else {
          console.error("Error:", response.error || response.message);
        }
      },resultsData.value)

      ResultsGeoJson.fromJson((response) => {
        if (response.status === Status.Success) {
          geoJsonResponse.value = response;
        } else {
          console.error("Error:", response.error || response.message);
        }
      },geoData.value);

      if (JsonResponse.value.status !== Status.Success ||
          geoJsonResponse.value.status !== Status.Success ||
          JsonResponse.value.isError ||
          geoJsonResponse.value.isError ||
          JsonResponse.value.results === null ||
          geoJsonResponse.value.results === null) {
            console.error('Error fetching results:', JsonResponse.value.error);
            return;
          }

      if (props.year !== '') {
        filteredJson.value = (JsonResponse.value.results).filterByYear(props.year);
        results.value = filteredJson.value;
        count.value = filteredJson.value.count.filter((count)=> count.year === year)[0];
      } else {
        results.value = JsonResponse.value.results;
        count.value = JsonResponse.value.results.TotalCount();
      }

      geojson.value = formatRawGeoJson(geoJsonResponse.value.results);
      lastSearch.value = searchTerm.value;

      emit('update:geojson', geojson.value);
      emit('update:results', results.value);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="results-pane">
    <LastSearch v-if="!loading && results" :lastSearch="lastSearch" />
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    <ResultsCount v-if="count" :count="count" :loading="loading" />

    <div class="results-list">

      <!-- Iterate through the properties of the object -->
      <template v-if="!loading && results" v-for="(category) in orderedResults" :key="category">
        <!-- Output the property name -->
        <div class="result-category">
          <h4 class="category-title">
            {{ formatCategory(category) }}
          </h4>
        </div>
        <SearchResult
          v-for="item in results[category || '']"
          :key="item?.id || item?.name || item?.description || item?.story?.name"
          :item="item"
          :category="category"/>
      </template>

    </div>
  </div>
</template>

<style scoped>
  .results-pane {
    width: 38vw;
    height: 95vh;
    background: var(--gcc-white);
    padding: 1rem;
    color: #333;
    overflow-y: none;
    border-left: var(--gcc-dk-green) .2rem solid;
  }

  .results-list {
    margin-top: 1rem;
    padding: 0.5rem;
    height: 76%;
    overflow-y: scroll;
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
  div.results-list::-webkit-scrollbar {
    width: 6rem;
  }

  /* Track */
  div.results-list::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  div.results-list::-webkit-scrollbar-button {
    height: 7rem;
    width: 5rem;
    /* Set the font and weight for this icon style */
    font: var(--fa-font-solid);
    /* Make sure icons render pixel-perfect */
    -webkit-font-smoothing: antialiased;
    border-radius:10px;
    background-color: #bcbcbc;
  }

  div.results-list::-webkit-scrollbar-button:vertical {
  }

  div.results-list::-webkit-scrollbar-button:vertical:decrement {
    background-position: center;
    background-repeat: no-repeat;
    background-clip: content-box;
    border-bottom: 1rem solid transparent;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="%23EEEEEE" d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
  }

  div.results-list::-webkit-scrollbar-button:vertical:increment {
    background-position: center;
    background-repeat: no-repeat;
    background-clip: content-box;
    border-top: 1rem solid transparent;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="%23EEEEEE" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>');
  }

  div.results-list::-webkit-scrollbar-button:hover {
    background: #233e27;
  }

  /* Handle */
  div.results-list::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 10px;
  }

  /* Handle on hover */
  div.results-list::-webkit-scrollbar-thumb:hover {
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