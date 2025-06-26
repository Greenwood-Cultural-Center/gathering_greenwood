<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { HtmlDialog } from 'vue-html-dialog';
  import ListItem from '@Utility/ListItem.vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import utils from '@utils/utils.js';
  import ScrollbarCss from '@/styles/scrollbar.module.css';
  import 'vue-html-dialog/vue-html-dialog.css';

  defineExpose({
    openDialog: () => dialogRef.value?.openDialog(),
    closeDialog: () => dialogRef.value?.closeDialog()
  })

  const dialogRef = ref(HtmlDialog);

  const regex = /(?:<pre>)?(?:&lt;|<)i data-poi(?:=?(?:&quot;&quot;|""|\\\\"\\\\")?)?(?:&gt;|>)(?:&lt;\/|<\/)i(?:&gt;|>)(?:<\/pre>)?/gi;

  const buildingSources = ['search-source', 'poi-source']

  const props = defineProps({
    feature: {
      type: Object,
      required: true,
      validator: val => val && typeof val === 'object' && 'properties' in val
    }
  });

  const searchableName = (person) => {
    if (person && person.name) {
      return person.name;
    }
    else if (person)
    {
      return `${ person?.first_name || person?.First_Name } ${person?.middle_name || person?.Middle_Name} ${ person?.last_name || person?.Last_Name } `;
    }
    else {
      return 'Unknown';
  }};

  const age = (person) => {
    if (person) {
      if ((!person.age) && person.birth_year) {
        return props.feature.properties.year - person.birth_year;
      }
      if (!person.Age && !person.age_months) {
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
      if ((!person.age) && person.birth_year) {
        return props.feature.properties.year - person.birth_year;
      }
      return `N/A`;
    };
    return '';
  };

  function sort(arr) {
    return arr.sort((a,b) => {
      const nameA = a?.sortable_name?.toUpperCase();
      const nameB = b?.sortable_name?.toUpperCase();
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
      return 0;
    })
  }

  const rich_description = computed(() => {
    if (!props.feature || !props.feature.properties || !props.feature.properties.rich_description) {
      return 'N/A';
    }
    if (!props.feature.properties.rich_description.body) {
      return 'N/A';
    }
    return props.feature.properties.rich_description.body.replace(regex, "") || 'N/A';
  });

  const description = computed(() => {
    if (!props.feature || !props.feature.properties || !props.feature.properties.description) {
      return 'N/A';
    }
    return props.feature.properties.description.replace(regex, "") || 'N/A';
  });

  const categories = computed(() => {
    return [
      { title: 'people', list: props.feature.properties.people, icon: 'user' },
      // { title: 'documents', list: props.feature.properties.documents, icon: 'file-alt' },
      { title: 'photos', list: props.feature.properties.photos, icon: 'image' },
      { title: 'videos', list: props.feature.properties.videos, icon: 'video' },
      { title: 'audios', list: props.feature.properties.audios, icon: 'volume-high' },
      { title: 'stories', list: props.feature.properties.stories, icon: 'book' }
    ];
  });

  onMounted(() => {
    console.log(props.feature);
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
        <div v-if="feature.properties && buildingSources.includes(feature.source)">
          <p><strong>Name:</strong> {{ feature.properties.title.replaceAll("  "," ") || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ feature.properties.addresses[0].searchable_text.replaceAll("  "," ") || 'N/A' }}</p>
          <!-- <p><strong>Year Built:</strong> {{ feature.properties.year_built || 'N/A' }}</p> -->
          <p><strong>Description:</strong> {{ description || 'N/A' }}</p>
          <p><strong>Full Description:</strong> <span class="rich-description" v-html="rich_description"></span></p>
          <template v-for="category in categories">
            <h3 v-if="category.list && category.list.length" class="category-title">{{ utils.titleCase(category.title) }}</h3>
              <template v-if="category.title === 'people'">
                <details v-for="(item, index) in sort(category.list)" name="person" :key="index">
                  <summary><FontAwesomeIcon :icon="['far', category.icon]" /> {{ item.searchable_name }}: {{ age(item) }}</summary>
                      <p><strong>Name:</strong> {{ item?.searchable_name || 'N/A' }}</p>
                      <p><strong>Description:</strong> {{ item?.description || 'N/A' }}</p>
                      <p><strong>Race:</strong> {{ item?.race || 'N/A' }}</p>
                      <p><strong>Gender:</strong> {{ item?.sex || 'N/A' }}</p>
                      <p><strong>Age:</strong> {{ age(item) }}</p>
                      <p><strong>Place of Birth:</strong> {{ item?.pob || 'N/A' }}</p>
                      <p><strong>Birth Year:</strong> {{ item?.birth_year || 'N/A' }}</p>
                      <p><strong>Census Year:</strong> {{ feature?.year || 'N/A' }}</p>
                      <p><strong>Notes:</strong> {{ item?.notes || 'N/A' }}</p>
                </details>
              </template>
              <template v-else-if="category.title === 'stories'">
                <details v-for="item in category.list" :key="item.story.id" name="story"  :icon="category.icon">
                  <summary><FontAwesomeIcon :icon="['far', category.icon]" /> {{ item.story.name }}</summary>
                  <span v-html="item.story.body"></span>
                  <p><strong>Source:</strong><span v-html="item.sources.body"></span></p>
                </details>
              </template>
              <template v-else-if="category.title === 'photos'">
                <div class="photo-grid">
                  <div v-for="item in category.list" :key="item.id" class="photo-item">
                    <img :src="item.data_uri" :alt="item.caption || item.description"/>
                  </div>
                </div>
              </template>
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
    color: var(--gcc-black);
    height: 100%;
    width: 100%;
  }

  details > summary {
    list-style: none;
  }

  .link {
    color: #646cff;
    margin-left: 0.3125rem;
  }

  summary h3, h4, h5, h6 {
    display: inline;
  }

  hr.section{
    border: none;
    border-top: 0.1875rem groove var(--gcc-black);
    color: var(--gcc-black);
    overflow: visible;
    text-align: center;
    height: 0.3125rem;
  }

  hr.sub-section{
    border: none;
    border-top: 1px groove var(--gcc-black);
    color: var(--gcc-black);
    overflow: visible;
    text-align: center;
    height: 0.3125rem;
  }

  hr.sub-section-item{
    border: none;
    border-top: 0.1875rem double var(--gcc-black);
    color: var(--gcc-black);
    overflow: visible;
    text-align: center;
    height: 0.3125rem;
  }

  hr.item{
    border: none;
    border-top: 1px double var(--gcc-black);
    color: var(--gcc-black);
    overflow: visible;
    text-align: center;
    height: 0.3125rem;
  }

  .modal-body {
    max-height: 70vh;
    overflow-y: scroll;
    overflow-x: visible;
    height: 95%;
    width: 100%;
    padding-right: 1rem;
  }

  .modal-body > div > p,
  .modal-body > details > summary,
  .modal-body > details > p {
    word-wrap: break-word;
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

  .feature-dialog:deep(.dialog){
    anchor-name: --dialog;
    background: var(--gcc-white);
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 12px #0000004d;
    color: var(--gcc-black);
    height: 70rem;
    margin: 1.5rem;
    max-height: 70rem;
    max-width: 90%;
    opacity: 1;
    overflow-y: hidden;
    padding: 1.5rem;
    position: static;
    transform: translateY(-2rem);
    transition: transform 300ms ease,opacity 300ms ease;
    width: 61rem;
  }

  .feature-dialog:deep(.dialog>div) {
    width: 100%;
    height: 100%;
  }

  .feature-dialog:deep(.dialog>div button.close-button) {
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
    .feature-dialog:deep(.dialog) {
      transform: translateY(-4rem);
      max-height: 60rem;
    }
  }

  @media (max-width: 2500px) and (max-height: 1300px) {
    .feature-dialog:deep(.dialog) {
      transform: translateY(-4rem);
    }
  }

  @media screen and (max-width: 1930px) and (max-height: 1090px) {
    .feature-dialog:deep(.dialog) {
      transform: translateY(-5rem);
      max-height: 50rem;
      height: 50rem;
    }
  }

  .photo-grid {
    display: flex;
    flex-wrap: wrap;
    /* Optional: Add spacing between items */
    gap: 10px;
    /* Optional: Center items if needed */
    justify-content: center;
    align-items: center;
  }

  .photo-item {
    /* Optional: Control individual item size */
    flex: 1 1 200px; /* Allow items to grow, shrink, and have a base size */
    max-width: 300px; /*Limit the maximum width of each item */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }

  .photo-item img {
    width: 100%;
    height: auto;
    display: block; /* Remove extra space below inline images */
  }

/*
  @media (max-width: 1600px) and (max-height:900px) {
    .feature-dialog:deep(.dialog) {
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
    .feature-dialog:deep(.dialog) {
      transform: translateY(-4rem);
      width: 43.75rem;
      max-height: 29.25rem;
    }

    .modal-body {
      height: 93%;
    }
  }

  @media (max-width: 1400px) and (max-height: 1300px) {
    .feature-dialog:deep(.dialog) {
        transform: translateY(-4rem);
        max-height: 58rem;
        height: 58rem;
    }
  }

  @media (max-width: 1400px) and (max-height: 1100px) {
    .feature-dialog:deep(.dialog) {
        transform: translateY(-4rem);
        max-height: 51rem;
        height: 51rem;
    }

    .feature-dialog:deep(.dialog>div) {
      position-anchor: --dialog;
      height: anchor-size(--dialog height);
      box-sizing: border-box;
      width: 100%;
      align-items: center;
    }
  } */

</style>