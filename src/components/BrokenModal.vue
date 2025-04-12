<script setup>
  import { onMounted, ref, computed } from 'vue';
  import BuildingForm from './forms/BuildingForm.vue';
  import PersonForm from './forms/PersonForm.vue';
  import DocumentForm from './forms/DocumentForm.vue';
  import CensusRecordForm from './forms/CensusRecordForm.vue';
  import StoryForm from './forms/StoryForm.vue';
  import AudioMediaForm from './forms/AudioMediaForm.vue';
  import VideoMediaForm from './forms/VideoMediaForm.vue';
  import PhotoMediaForm from './forms/PhotoMediaForm.vue';
  import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  const props = defineProps({
    item: Object,
    category: String
  });
  const emit = defineEmits(['update:showModal']);

  const dialogRef = ref(null);

  onMounted(() => {
    if (dialogRef.value) {
      dialogRef.value.showModal();
    }
  });

  const getComponent = computed(() => {
    switch (props.category) {
      case 'buildings': return BuildingForm;
      case 'people': return PersonForm;
      case 'documents': return DocumentForm;
      case 'census_records': return CensusRecordForm;
      case 'stories': return StoryForm;
      case 'media':
        switch (props.item?.type) {
          case 'photo': return PhotoMediaForm;
          case 'video': return VideoMediaForm;
          case 'audio': return AudioMediaForm;
        }
    }
    return null;
  });

  const closeFunc = () => {
    emit('update:showModal', false); // Notify the parent component
  };
</script>

<template>
  <dialog ref="dialogRef" class="modal-dialog" @click.self="closeFunc()" @close="closeFunc()">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Details</h5>
        <button type="button" class="close-button" @click="closeFunc()"><FontAwesomeIcon :icon="faWindowClose"></FontAwesomeIcon></button>
      </div>
      <div class="modal-body">
        <component :is="getComponent" :item="item" v-if="getComponent" />
        <p v-else>Unknown category: {{ category }}</p>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
  dialog.modal-dialog {
    border: none;
    border-radius: 8px;
    width: 90vw;
    max-width: 800px;
    padding: 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    color: #333
  }
  .modal-content {
    background: white;
    padding: 1rem;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }
  .modal-title {
    margin: 0;
  }
  .close-button {
    font-size: 2.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: var(--gcc-lt-green);
  }
</style>