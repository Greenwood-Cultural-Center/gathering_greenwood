<script setup>
  import { onMounted, onBeforeMount, ref, computed, watch } from 'vue';
  import BuildingForm from '@Forms/BuildingForm.vue';
  import PersonForm from '@Forms/PersonForm.vue';
  import DocumentForm from '@Forms/DocumentForm.vue';
  import CensusRecordForm from '@Forms/CensusRecordForm.vue';
  import StoryForm from '@Forms/StoryForm.vue';
  import AudioMediaForm from '@Forms/AudioMediaForm.vue';
  import VideoMediaForm from '@Forms/VideoMediaForm.vue';
  import PhotoMediaForm from '@Forms/PhotoMediaForm.vue';
  import PDFForm from '@Forms/PDFForm.vue';
  import { HtmlDialog } from 'vue-html-dialog';
  import ScrollbarCss from '@/styles/scrollbar.module.css';
  //import Dialog from './Dialog.vue';
  import 'vue-html-dialog/vue-html-dialog.css';

  const props = defineProps({
    item: {
      type: Object,
      required: true,
  },
    category: {
      type: String,
      required: true
  },
    dialogId: {
      type: String,
      default: 'result-modal'
    }
  });

  defineExpose({
    openDialog: () => dialogRef.value?.openDialog(),
    closeDialog: () => dialogRef.value?.closeDialog()
  })

  const emit = defineEmits(['open', 'close']);

  const dialogRef = ref(HtmlDialog);

  // Dynamically resolve the correct form component
  const getComponent = computed(() => {
    const mediaTypes = {
      photo: PhotoMediaForm,
      video: VideoMediaForm,
      audio: AudioMediaForm
    }

    const documentTypes = {
      "application/pdf": PDFForm,
      "image/png": PhotoMediaForm,
      "image/jpeg": PhotoMediaForm,
      "image/gif": PhotoMediaForm,
    }

    const formMap = {
      buildings: BuildingForm,
      people: PersonForm,
      documents: documentTypes[props.item?.content_type] || DocumentForm,
      census_records: CensusRecordForm,
      stories: StoryForm,
      media: mediaTypes[props.item?.type]
    }

    return formMap[props.category] || null
  })


</script>

<template>
  <HtmlDialog ref="dialogRef" :dialogId="dialogId" class="result-modal" titleId="modal-title-id" @close="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="modal-title-id" class="modal-title">Details</h5>
      </div>
      <div :class="['modal-body', ScrollbarCss.scrollbar]">
        <component :is="getComponent" :item="item" v-if="getComponent" />
        <p v-else>Unknown category: {{ category }}</p>
      </div>
    </div>
  </HtmlDialog>
</template>

<style scoped>
  .modal-content {
    background: white;
    padding: 1rem;
    height: 100%;
    width: 100%;
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

  .modal-body {
    overflow-y: scroll;
    height: 95%;
    width: 100%;
  }

  .result-modal:deep(.dialog) {
    transform: translateY(-4rem);
    height: 70rem;
    width: 75rem;
    max-height: 70rem;
  }

  .result-modal:deep(.dialog>div) {
    width: 100%;
    height: 100%;
  }

  .result-modal:deep(.dialog > div button.close-button) {
    font-size: 3.5rem;
    z-index: 1001;
    height: 4rem;
    width: 4rem;
    padding-block: 0;
    padding-inline: 0;
    top: -13px;
    right: 9px;
    position: absolute;
    background: transparent;
    border: none;
    cursor: pointer;
    user-select: none;
    padding: 0;
    color: var(--gcc-lt-green);
    border-radius: 8px;
    font-weight: 500;
    font-family: inherit;
    transition: border-color 0.25s;
  }

  @media (max-width: 2500px) and (max-height: 1400px) {
    .result-modal:deep(.dialog) {
      transform: translateY(-4rem);
      height: 70rem;
      max-height: 70rem;
    }
  }

  @media (max-width: 2500px) and (max-height: 1300px) {
    .result-modal:deep(.dialog) {
      transform: translateY(-4rem);
      height: 60rem;
      max-height: 60rem;
    }
  }

  @media (max-width: 1600px) and (max-height:900px) {
    .result-modal:deep(.dialog) {
      transform: translateY(-4rem);
      height: 38rem;
    }

    .modal-body {
      height: 80%;
    }

    .modal-body {
      overflow-y: scroll;
      width: 100%;
    }
  }

  @media (max-width: 1600px) and (max-height:700px) {
    .result-modal:deep(.dialog) {
      transform: translateY(-4rem);
      width: 43.75rem;
      max-height: 29.25rem;
    }

    .modal-body {
      height: 93%;
    }
  }

  @media (max-width: 1400px) and (max-height: 1300px) {
    .result-modal:deep(.dialog) {
        transform: translateY(-4rem);
        max-height: 58rem;
        height: 58rem;
    }
  }

  @media (max-width: 1400px) and (max-height: 1100px) {
  .result-modal:deep(.dialog) {
        transform: translateY(-4rem);
        max-height: 51rem;
        height: 51rem;
    }
  }
</style>