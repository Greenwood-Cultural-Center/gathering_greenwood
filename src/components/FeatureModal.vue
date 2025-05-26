<script setup>
  import { ref, computed } from 'vue';
  import { HtmlDialog } from 'vue-html-dialog';
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

</script>

<template>

  <HtmlDialog ref="dialogRef" class="feature-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Building Details</h5>
      </div>
      <div class="modal-body">
        <div v-if="feature.properties">
          <p><strong>Name:</strong> {{ feature.properties.title || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ feature.properties.addresses[0].searchable_text || 'N/A' }}</p>
          <!-- <p><strong>Year Built:</strong> {{ feature.properties.year_built || 'N/A' }}</p> -->
          <p><strong>Description:</strong> {{ feature.properties.description || 'N/A' }}</p>
          <p><strong>Rich Description:</strong> <span v-html="feature.properties.rich_description.body"></span></p>
          <h3>People</h3>
          <ul>
            <li v-for="person in feature.properties.people" :key="person.id">
              {{ person.searchable_name }}: {{ person.age }}
            </li>
          </ul>
          <!-- <h3>Documents</h3>
          <ul>
            <li v-for="doc in feature.properties.documents" :key="doc.id">
              <a :href="doc.url" target="_blank">{{ doc.title }}</a>
            </li>
          </ul> -->
          <h3>Photos</h3>
          <ul>
            <li v-for="media in feature.properties.media" :key="media.id">
              <a :href="media.url" target="_blank">{{ media.title }}</a>
            </li>
          </ul>
          <h3>Stories</h3>
          <ul>
            <li v-for="story in feature.properties.narratives" :key="story.id">
              <a :href="story.url" target="_blank">{{ story.title }}</a>
            </li>
          </ul>
          <h3>Audios</h3>
          <ul>
            <li v-for="audio in feature.properties.audio" :key="audio.id">
              <a :href="audio.url" target="_blank">{{ audio.title }}</a>
            </li>
          </ul>
          <h3>Videos</h3>
          <ul>
            <li v-for="video in feature.properties.video" :key="video.id">
              <a :href="video.url" target="_blank">{{ video.title }}</a>
            </li>
          </ul>
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
    background: white;
    padding: 1rem;
    color: #333;
  }

  .modal-body {
    max-height: 70vh;
    overflow-y: auto;
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

<style>
  .feature-dialog .dialog{
    width: 56.25rem;
  }
</style>