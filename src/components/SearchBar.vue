<script setup>
import { ref, watch } from 'vue';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import LastSearch from './LastSearch.vue'

const model = defineModel();
const emit = defineEmits(['search']);

const input = ref('');
const lastSearch = ref('');

watch(input, () => model.value = input.value);

function doSearch() {
  if (!input.value.trim()) return;
  lastSearch.value = input.value;
  emit('search', input.value);
}
</script>

<template>
  <div class="search-bar">
    <span class="input-group">
      <div class="input">
        <input
          v-model="input"
          @keyup.enter="doSearch"
          type="text"
          placeholder="Search..."
        />
      </div>
      <button @click="doSearch">
        <FontAwesomeIcon :icon="faMagnifyingGlass" />
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
      padding: 1rem;
      background-color: var(--gcc-dk-green);
    }

    .input {
      background: black;
      padding-top: 0.1rem;
      padding-bottom: 0.4rem;
      padding-left: 0.3rem;
      padding-right: 0.3rem;
      display: inline-block;
      border-radius: 10px;
    }

    .input input {
      padding: 0.4rem 0.6rem;
      background-color: #fdfdfd;
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
      color: var(--gcc-orange);
      font-size: 3rem;
      padding: 0 0.5rem 0 1.5rem;
    }
</style>