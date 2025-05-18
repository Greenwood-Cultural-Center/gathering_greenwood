<script setup>
  import { ref, computed, watch, defineExpose } from 'vue';
  import ResultsCount from './ResultsCount.vue';
  import SearchResult from './SearchResult.vue';
  import LastSearch from './LastSearch.vue'
  //import { findObjectByKey } from '../utils/utils.js';
  import { ResultsJson, ResultsGeoJson, Status, DetailedResponse, Count } from '../utils/ResponseHandler.ts';

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

  const emit = defineEmits(['update:geojson', 'update:results']);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  console.log('Backend Host:', backendHost);
  console.log('Backend Host:', import.meta.env.VITE_BACKEND_HOST);
  console.log('Year:', props.year);

  const searchTerm = ref('');
  const results = ref([]);
  const count = ref({});
  const geojson = ref({});

  const resultsData = ref({});
  const geoData = ref([]);

  function resetState() {
    results.value = [];
    count.value = {};
    lastSearch.value = '';
  }

  defineExpose({
    resetState,
    search,
  });

  async function search(searchValue) {
    loading.value = true;

    if (!searchValue) {
      console.error('No search value provided');
      return;
    }

    searchTerm.value = searchValue.search;
    lastSearch.value = searchValue.lastSearch;

    try {
      const backendHost = import.meta.env.VITE_BACKEND_HOST;
      const [resultsRes, geoJsonRes] = await Promise.all([
        fetch(`${backendHost}/api/json?search=${searchTerm}`),
        fetch(`${backendHost}/api/search?search=${searchTerm}`)
      ]);

      resultsData.value = await resultsRes.json();
      geoData.value = await geoJsonRes.json();

      JsonResponse = ResultsJson.fromJson(resultsData.value);
      geoJsonResponse = ResultsGeoJson.fromJson(geoData.value);

      if (JsonResponse.status !== Status.Success ||
          geoJsonResponse.status !== Status.Success ||
          JsonResponse.isError ||
          geoJsonResponse.isError) {
        console.error('Error fetching results:', JsonResponse.errorMessage);
        return;
      }

      if (props.year !== '') {
        filteredJson = JsonResponse.results.filterByYear(props.year);
        filteredGeoJson = geoJsonResponse.results.filterByYear(props.year);
        results.value = filteredJson;
        count.value = filteredJson.count
        geojson.value = filteredGeoJson;
      } else {
        results.value = JsonResponse.results;
        count.value = JsonResponse.TotalCount();
        geojson.value = geojsonResponse.results;
      }

      // if (props.year !== '') {
      //   filterResultsByYear(props.year);
      // }
      // else {
      //   results.value = mergeSearchResults(resultsData.value.results);
      //   count.value = getTotals(resultsData.value.count);
      //   geojson.value = mergeSearchResults(geoData.value)
      // }
      lastSearch.value = searchTerm;

      emit('update:geojson', geojson.value);
      emit('update:results', results.value);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      loading.value = false;
    }
  }



  // function filterResultsByYear(year) {
  //   results.value = filterResultArrayByYear(resultsData.value.results, props.year);
  //   count.value = filterResultArrayByYear(resultsData.value.count, props.year);
  //   geojson.value = filterResultArrayByYear(geoData.value, props.year);
  // }

  // function mergeSearchResults(results) {
  //   const merged = [];
  //   const buildings = [];
  //   const people = [];
  //   const censusRecords = [];
  //   const documents = [];
  //   const media = [];
  //   const stories = [];

  //   results.forEach((yearResult) => {
  //     getCategory(yearResult, 'buildings').forEach((building) => {
  //       buildings.push(building);
  //     });
  //     getCategory(yearResult, 'people').forEach((person) => {
  //       people.push(person);
  //     });
  //     getCategory(yearResult, 'census_records').forEach((censusRecord) => {
  //       censusRecords.push(censusRecord);
  //     });
  //     getCategory(yearResult, 'documents').forEach((document) => {
  //       documents.push(document);
  //     });
  //     getCategory(yearResult, 'media').forEach((mediaItem) => {
  //       media.push(mediaItem);
  //     });
  //     getCategory(yearResult, 'stories').forEach((story) => {
  //       stories.push(story);
  //     });
  //   });

  //   results.value = merged;
  // }

  // function getCategory(result, key) {
  //   return findObjectByKey(result, key);
  // }

  // function filterResultArrayByYear(results, year) {
  //   return findObjectByKey(results, year)
  // }

  // function getTotals(count) {
  //   return findObjectByKey(count, "Total")
  // }

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
    background: var(--gcc-white);
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