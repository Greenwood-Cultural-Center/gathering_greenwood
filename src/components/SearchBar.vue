<script setup>
  import { ref, onMounted, onUpdated } from 'vue';
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
    clearSearch
  });

  function clearSearch() {
      input.value = '';
      searchValue.value = {};
  }

  function handleInputChange(event) {
    setQuery(event.target.value);
  }

  function handleClearClick() {
    clearSearch();
  }

  // Component Lifecycle Hooks
  onMounted(() => {
    document.getElementById('search-input').focus();
  });

  onUpdated(() => {
    document.getElementById('search-input').focus();
  });
</script>

<template>
  <div class="search-bar" role="search">
    <span class="input-group">
      <div class="input">
        <input
          v-model="input"
          id="search-input"
          @keyup.enter="doSearch"
          @onChange="handleInputChange"
          aria-description="search results will appear above"
          type="search"
          placeholder="Search..."
          required
          autocomplete="on"
        />
      </div>
      <button id="search-button" @click="doSearch" aria-label="search">
        <FontAwesomeIcon icon="search" transform="grow-40 right-4" title="Perform Search"/>
      </button>
      <button type="button" v-if="input" class="clear-search" @click="handleClearClick">
        <FontAwesomeIcon icon="times" transform="grow-40" title="Clear Search"/>
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
      padding-top: 0.1rem;
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

    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
    }

    .clear-search {
      position: absolute;
      transform: translateY(32%);
      right: 5.6rem;
      width: 2.2rem;
      height: 2rem;
      padding: 0px;
      background: none;
      border-radius: unset;
      border: none;
      cursor: pointer;
    }

    @media screen and (max-width: 1600px) {
      input {
        width: 20rem;
      }
      .search-bar>div {
        margin-left: 1rem;}
    }

    button#search-button {
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