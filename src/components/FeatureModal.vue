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

  const searchableName = (person) => {
    return `${ person.First_Name } ${person.Middle_Name} ${ person.Last_Name }`;
  };

  const age = (person) => {
    if (!person || !person.Age || person.age_months == null) {
      return 'N/A';
    }
    if (person.Age === 0 && person.age_months === 0) {
      return 'Newborn';
    }
    if (person.Age < 0 || person.age_months < 0) {
      return 'N/A';
    }
    if (person.Age === 0 && person.age_months > 0) {
      return `${ person.age_months } months`;
    }
    if (person.Age > 0 && (person.age_months === 0 || person.age_months === '')) {
      return `${ person.Age } years`;
    }
    if (person.Age > 0 && person.age_months > 0) {
      return `${ person.Age } years, ${ person.age_months } months`;
    }
    if (person.Age > 0 && person.age_months < 0) {
      return `${ person.Age } years`;
    }
    if (person.Age < 0 && person.age_months > 0) {
      return `${ person.age_months } months`;
    }
    return `N/A`;
  };

  const rich_description = computed(() => {
    if (!props.feature || !props.feature.properties || !props.feature.properties.rich_description) {
      return 'N/A';
    }
    return props.feature.properties.rich_description.body || 'N/A';
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

<!-- TODO: Make this more generic -->

<template>
  <HtmlDialog ref="dialogRef" class="feature-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Building Details</h5>
      </div>
      <div :class="['modal-body', ScrollbarCss.scrollbar]">
        <div v-if="feature.properties && feature.source === 'search-source'">
          <p><strong>Name:</strong> {{ feature.properties.title || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ feature.properties.addresses[0].searchable_text || 'N/A' }}</p>
          <!-- <p><strong>Year Built:</strong> {{ feature.properties.year_built || 'N/A' }}</p> -->
          <p><strong>Description:</strong> {{ feature.properties.description || 'N/A' }}</p>
          <p><strong>Rich Description:</strong> <span class="rich-description" v-html="rich_description"></span></p>
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
        <div v-else-if="feature.properties && feature.source === '1920-census-source'">
          <h3 class="category-title">Building Information</h3>
          <hr class="section"/>
          <p><strong>Census Sheet:</strong> {{ feature.properties.Census_Scope || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ feature.properties.Street_Address || 'N/A' }}</p>
          <p><strong>Dwelling Number</strong> {{ feature.properties.Dwelling_No_ || 'N/A' }}</p>
          <h3 class="category-title">Occupants</h3>
          <hr class="section"/>
          <details v-for="(family,index) in feature.properties.families" :key="family.Family_No_">
            <summary><h4>{{ family.Last_Name }} Family</h4></summary>
            <hr class="sub-section"/>
            <!-- <p><strong>Family No:</strong> {{ family.Family_No_ || 'N/A' }}</p>
            <p><strong>Last Name:</strong> {{ family.Last_Name || 'N/A' }}</p>
            <p><strong>Census Sheet:</strong> {{ family.Census_Scope || 'N/A' }}</p> -->
            <details v-for="(person,index) in family.people" :key="person.ID">
              <summary><h5>{{ searchableName(person) + '(' + person.Age + ')'}}</h5></summary>
              <!-- <p><strong>Name:</strong> {{ searchableName(person) || 'N/A' }}</p> -->
              <p><strong>Age:</strong> {{ age(person) }}</p>
              <p><strong>Gender:</strong> {{ person.Sex || 'N/A' }}</p>
              <p><strong>Race:</strong> {{ person.Race || 'N/A' }}</p>
              <p><strong>Primary Language Spoken:</strong> {{ person.Mother_Tongue || 'N/A' }}</p>
              <p><strong>Marital Status:</strong> {{ person.marital_status || 'N/A' }}</p>
              <p><strong>Foreign Born:</strong> {{ person.foreign_born || 'N/A' }}</p>
              <p><strong>Naturalized:</strong> {{ person.naturalized_alien || 'N/A' }}</p>
              <p><strong>Year Immigrated:</strong> {{ person.Year_Immigrated || 'N/A' }}</p>
              <p><strong>Birthplace:</strong> {{ person.Place_of_Birth || 'N/A' }}</p>
              <p><strong>Education:</strong> {{ person.Education || 'N/A' }}</p>
              <p><strong>Attended School:</strong> {{ person.attended_school || 'N/A' }}</p>
              <p><strong>Can Read:</strong> {{ person.Can_Read || 'N/A' }}</p>
              <p><strong>Can Write:</strong> {{ person.Can_Write || 'N/A' }}</p>
              <p><strong>Can Speak English:</strong> {{ person.Can_Speak_English || 'N/A' }}</p>
              <p><strong>Employment:</strong> {{ person.Employment || 'N/A' }}</p>
              <p><strong>Occupation:</strong> {{ person.Occupation || 'N/A' }}</p>
              <p><strong>Industry:</strong> {{ person.Industry || 'N/A' }}</p>
              <p><strong>Institution:</strong> {{ person.Institution || 'N/A' }}</p>
              <p><strong>Relationship To Head of Household:</strong> {{ person.Relation_to_Head || 'N/A' }}</p>
              <p><strong>Home Owned or Rented:</strong> {{ person.Home_Owned_Rented || 'N/A' }}</p>
              <p><strong>Farm Schedule No.:</strong> {{ person.Farm_Schedule_No_ || 'N/A' }}</p>
              <p><strong>Mortgage:</strong> {{ person.Mortgage || 'N/A' }}</p>
              <p><strong>Father's Birthplace:</strong> {{ person.Place_of_Birth___Father || 'N/A' }}</p>
              <p><strong>Father's Language:</strong> {{ person.Mother_Tongue___Father || 'N/A' }}</p>
              <p><strong>Mother's Birthplace:</strong> {{ person.Place_of_Birth___Mother || 'N/A' }}</p>
              <p><strong>Mother's Language:</strong> {{ person.Mother_Tongue___Mother || 'N/A' }}</p>
              <p><strong>Census Line:</strong> {{ person.Census_Scope || 'N/A' }}</p>
              <hr v-if="index < family.people.length - 1" class="item"/>
            </details>
            <hr v-if="index < feature.properties.families.length - 1" class="sub-section-item"/>
          </details>
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

  h4, h5 {
    display: inline;
  }

  hr.section{
    border: none;
    border-top: 3px groove #333;
    color: #333;
    overflow: visible;
    text-align: center;
    height: 5px;
  }

  hr.sub-section{
    border: none;
    border-top: 1px groove #333;
    color: #333;
    overflow: visible;
    text-align: center;
    height: 5px;
  }

  hr.sub-section-item{
    border: none;
    border-top: 3px double #333;
    color: #333;
    overflow: visible;
    text-align: center;
    height: 5px;
  }

  hr.item{
    border: none;
    border-top: 1px double #333;
    color: #333;
    overflow: visible;
    text-align: center;
    height: 5px;
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