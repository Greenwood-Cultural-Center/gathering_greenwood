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
  import PDFForm from './forms/PDFForm.vue';
  import { HtmlDialog } from 'vue-html-dialog';
  import ScrollbarCss from '../styles/scrollbar.module.css';
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

  @media screen and (max-width: 1600px) {
    .modal-body {
      height: 80%;
    }
  }

  @media screen and (max-height: 900px) {
    .modal-body {
      overflow-y: scroll;
      height: 95%;
      width: 100%;
    }
  }
</style>

<style>
  .result-modal .dialog {
    width: 53.75rem;
    max-height: 56.25rem;
    cursor: initial;
  }

  .result-modal .dialog>div {
    width: 100%;
    height: 100%;
  }

  .result-modal .dialog > div button.close-button {
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

  @media screen and (max-height: 700px) {
    .result-modal .dialog {
      transform: translateY(-4rem);
      width: 43.75rem;
      max-height: 31.25rem;
    }
  }

  @media screen and (max-height: 900px) {
    .result-modal .dialog {
      transform: translateY(-4rem);
      height: 40rem;
    }
  }
</style>