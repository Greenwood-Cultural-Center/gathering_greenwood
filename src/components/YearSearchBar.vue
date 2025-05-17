<script setup>
  import SearchBar from './SearchBar.vue';
  import YearSelector from './YearSelector.vue';

  // Props
  const props = defineProps({
    onYearChange: {
      type: Function,
      required: true
    },
    years: {
      type: Array,
      required: true
    },
    onSearch: {
      type: Function,
      required: true
    },
  });

  function updateYear(year) {
    props.onYearChange(year);
  }

  function passSearch(searchValue) {
    props.onSearch(searchValue);
  }

</script>


<template>
  <div class="year-search-bar">
    <YearSelector :onYearChange="props.onYearChange" :yearArray="props.years"/>
    <SearchBar :onSearch="props.onSearch"/>
  </div>
</template>

<style scoped>
.year-search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position:fixed;
  right:0;
  padding: 1rem;
  bottom: 0;
  border-top-left-radius: 10px;
  background-color: var(--gcc-dk-green);
  z-index: 1000;
}
</style>