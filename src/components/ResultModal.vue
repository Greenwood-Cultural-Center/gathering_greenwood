<script setup>
  import { VNativeDialog } from "vue-native-dialog";
  import { onMounted, ref, computed, watch } from 'vue';
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

  const open = ref(false);

  const props = defineProps({
    item: Object,
    category: String
  });

  defineExpose ({
    openModal: () => {
      open.value = true;
    },
    closeModal: () => {
      open.value = false;
    }
  });

  onMounted(() => {
    if (open.value) {
      open.value = true;
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
</script>

<template>
  <VNativeDialog :open="open">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Details</h5>
        <button class="close-button" @click="open=false"><FontAwesomeIcon :icon="faWindowClose"></FontAwesomeIcon></button>
      </div>
      <div class="modal-body">
        <component :is="getComponent" :item="item" v-if="getComponent" />
        <p v-else>Unknown category: {{ category }}</p>
      </div>
    </div>
  </VNativeDialog>

</template>