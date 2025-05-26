<script setup>
  import { onMounted, onBeforeMount, ref, computed, watch } from 'vue';
  import BuildingForm from './forms/BuildingForm.vue';
  import PersonForm from './forms/PersonForm.vue';
  import DocumentForm from './forms/DocumentForm.vue';
  import CensusRecordForm from './forms/CensusRecordForm.vue';
  import StoryForm from './forms/StoryForm.vue';
  import AudioMediaForm from './forms/AudioMediaForm.vue';
  import VideoMediaForm from './forms/VideoMediaForm.vue';
  import PhotoMediaForm from './forms/PhotoMediaForm.vue';
  import { HtmlDialog } from 'vue-html-dialog';
  import Dialog from './Dialog.vue';
  import 'vue-html-dialog/vue-html-dialog.css';

  const props = defineProps({
    item: {
      type: Object,
      required: true,
  },
    category: {
      type: String,
      required: true
  }
  });

  defineExpose({
    openDialog: () => dialogRef.value?.openDialog(),
    closeDialog: () => dialogRef.value?.closeDialog()
  })

  const dialogRef = ref(HtmlDialog);

  // Dynamically resolve the correct form component
  const getComponent = computed(() => {
    const mediaTypes = {
      photo: PhotoMediaForm,
      video: VideoMediaForm,
      audio: AudioMediaForm
    }

    const formMap = {
      buildings: BuildingForm,
      people: PersonForm,
      documents: DocumentForm,
      census_records: CensusRecordForm,
      stories: StoryForm,
      media: mediaTypes[props.item?.type]
    }

    return formMap[props.category] || null
  })


</script>

<template>
  <Dialog ref="dialogRef">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Details</h5>
      </div>
      <div class="modal-body">
        <component :is="getComponent" :item="item" v-if="getComponent" />
        <p v-else>Unknown category: {{ category }}</p>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
  .modal-content {
    background: white;
    padding: 1rem;
    color: #333;
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
</style>