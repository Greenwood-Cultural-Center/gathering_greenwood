<script setup>
  import { computed, onMounted, ref } from 'vue';
  import {
    faBuilding,
    faUser,
    faFileAlt,
    faDatabase,
    faBook,
    faImage,
    faVideo,
    faVolumeHigh
  } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import ResultModal from './ResultModal.vue';

  const props = defineProps({
    item: Object,
    category: String
  });

  const dialog = ref(null)

  onMounted(() => {
    console.log(`SearchResult ${props.category}${props.category === 'media' ? `-${props.item?.type}` : ``} mounted:`, props.item);
  });

  function showDialog() {
    dialog.value?.openDialog()
  }

  const icon = computed(() => {
    switch (props.category) {
      case 'buildings': return faBuilding;
      case 'people': return faUser;
      case 'documents': return faFileAlt;
      case 'census_records': return faDatabase;
      case 'stories': return faBook;
      case 'media':
        switch (props.item?.type) {
          case 'photo': return faImage;
          case 'video': return faVideo;
          case 'audio': return faVolumeHigh;
        }
      default: return faFileAlt;
    }
  });
</script>

<template>
  <div class="search-result" @click="showDialog">
    <FontAwesomeIcon :icon="icon" class="icon" />
    <span>{{ item?.name || item?.description || item?.caption || item?.story?.name }}</span>
    <ResultModal ref="dialog" :item="item" :category="category" />
  </div>
</template>

<style scoped>
  .search-result {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    cursor: pointer;
  }
  .icon {
    margin-right: 0.5rem;
  }

  @media screen and (max-width: 1600px) {
    .search-result {
      font-size: 1.5rem;
    }
  }
</style>