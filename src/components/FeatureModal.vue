<script setup>
  import { ref, computed } from 'vue';
  import { HtmlDialog } from 'vue-html-dialog';
  import ListItem from './ListItem.vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import utils from '../utils/utils.js';
  import ScrollbarCss from '../styles/scrollbar.module.css';
  import 'vue-html-dialog/vue-html-dialog.css';

  defineExpose({
    openDialog: () => dialogRef.value?.openDialog(),
    closeDialog: () => dialogRef.value?.closeDialog()
  })

  const dialogRef = ref(HtmlDialog);

  const props = defineProps({
    feature: {
      type: Object,
      required: true,
      validator: val => val && typeof val === 'object' && 'properties' in val
    }
  });

  const categories = computed(() => {
    return [
      { title: 'people', list: props.feature.properties.people, icon: 'user' },
      // { title: 'documents', list: props.feature.properties.documents, icon: 'file-alt' },
      { title: 'photos', list: props.feature.properties.photos, icon: 'image' },
      { title: 'videos', list: props.feature.properties.videos, icon: 'video' },
      { title: 'audios', list: props.feature.properties.audios, icon: 'volume-high' },
      { title: 'stories', list: props.feature.properties.narratives, icon: 'book' }
    ];
  });
</script>

<template>
  <HtmlDialog ref="dialogRef" class="feature-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Building Details</h5>
      </div>
      <div :class="['modal-body', ScrollbarCss.scrollbar]">
        <div v-if="feature.properties">
          <p><strong>Name:</strong> {{ feature.properties.title || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ feature.properties.addresses[0].searchable_text || 'N/A' }}</p>
          <!-- <p><strong>Year Built:</strong> {{ feature.properties.year_built || 'N/A' }}</p> -->
          <p><strong>Description:</strong> {{ feature.properties.description || 'N/A' }}</p>
          <p><strong>Rich Description:</strong> <span class="rich-description" v-html="feature.properties.rich_description.body"></span></p>
          <template v-for="category in categories">
            <h3 class="category-title">{{ utils.titleCase(category.title) }}</h3>
            <ul class="fa-ul" role="group">
              <template v-if="category.title === 'people'">
                <ListItem v-for="item in category.list" :key="item.id" :icon="category.icon">
                    {{ item.searchable_name }}: {{ item.age }}
                </ListItem>
              </template>
              <template v-else-if="category.title === 'stories'">
                <ListItem v-for="item in category.list" :key="item.id" :icon="category.icon">
                    {{ item.name }}
                </ListItem>
              </template>
              <template v-else>
                <ListItem v-for="item in category.list" :key="item.id" :icon="category.icon">
                  <a :href="item.url" target="_blank">{{ item.name || item.description || item.caption }}</a><FontAwesomeIcon icon="link" style="color:#646cff; margin-left:5px;"></FontAwesomeIcon>
                </ListItem>
              </template>
            </ul>
          </template>
        </div>
        <div v-else>
          <p>No details available for this building.</p>
        </div>
      </div>
      <div class="modal-footer">
      </div>
    </div>
  </HtmlDialog>
</template>

<style scoped>
  .modal-content {
    background: var(--gcc-white);
    color: #333;
  }

  .modal-body {
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 1rem;
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

  .category-title {
    font-weight: bold;
  }

  .rich-description {
    white-space: pre-wrap;
    word-break: break-word;
    display: inline;
  }

  .rich-description * {
    display: inline;
  }

</style>

<style>
  .feature-dialog .dialog{
    width: 56.25rem;
    background: var(--gcc-white);
  }
</style>