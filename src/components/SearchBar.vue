<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const searchValue = ref({});
const input = ref('');
const lastSearch = ref('');

const props = defineProps({
  onSearch: {
    type: Function,
    required: true
  }
});

function doSearch() {
  if (!input.value.trim()) return;
  searchValue.value = {
    search: input.value,
  };
  props.onSearch(searchValue.value);
}

defineExpose({
  clearSearch() {
    input.value = '';
    searchValue.value = {};
  },
});
</script>

<template>
  <div class="search-bar" role="search">
    <span class="input-group">
      <div class="input">
        <input
          v-model="input"
          @keyup.enter="doSearch"
          aria-description="search results will appear above"
          type="search"
          placeholder="Search..."
        />
      </div>
      <button @click="doSearch" aria-label="search">
        <FontAwesomeIcon icon="search" transform="grow-40 right-4" title="Perform Search"/>
      </button>
    </span>
  </div>
</template>

<style scoped>
    .search-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    .input-group {
      padding: 1rem 0 1rem 1rem;
      background-color: var(--gcc-dk-green);
    }

    .input {
      background: black;
      padding-top: 0.3rem;
      padding-bottom: 0.1rem;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
      display: inline-block;
      border-radius: 10px;
    }

    .input input {
      padding: 0.4rem 0.6rem;
      background-color: var(--gcc-white);
      border-radius: 10px;
      border: none;
      color: var(--gcc-dk-green);
      padding: 3px;
      font-size: 2rem;
    }

    @media screen and (max-width: 1600px) {
      input {
        width: 20rem;
      }
      .search-bar>div {
        margin-left: 1rem;}
    }

    button {
      background: none;
      border-radius: unset;
      border: none;
      cursor: pointer;
      width: 4rem;
      height: 3.2rem;
      padding: 0px;
      transform: translateY(-0.5rem);
    }
</style>