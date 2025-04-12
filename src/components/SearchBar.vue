<script setup>
import { ref, watch } from 'vue';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
    <div><span v-if="lastSearch" class="search-label">Results for "{{ lastSearch }}"</span></div>
    <span class="input-group">
      <input
        v-model="input"
        @keyup.enter="doSearch"
        type="text"
        placeholder="Search..."
      />
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
      margin-bottom: 1rem;
    }

    .search-label {
      margin-right: auto;
      font-size: 1.9rem;
      color: #555;
      background-color: var(--gcc-v-lt-green);
      background: radial-gradient(ellipse, rgba(114,169,127,0.6) 30%, rgba(114,169,127,0.02) 99%);
      flex-grow: 1;
      padding: 1rem;
    }

    .input-group {
      padding: 1rem;
      background-color: var(--gcc-dk-green);
    }

    input {
      padding: 0.4rem 0.6rem;
      background-color: #fdfdfd;
      border-color: var(--gcc-dk-green);
      color: var(--gcc-dk-green);
      font-size: 2rem;
    }

    @media screen and (max-width: 1600px) {
      input {
        width: 140px;
      }
      .search-label {
        font-size: 1.5rem;
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
      font-size: 2rem;
      padding: 0 0.5rem 0 1.5rem;
    }
</style>