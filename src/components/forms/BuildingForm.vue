<script setup>
import { computed } from 'vue';
import utils from '@utils/utils.js';

const props = defineProps({ item: {type: Object, required: true} });

function formatLocation(location) {
  return location ? location.join(",") : 'Unknown';
}

const people = props.item.properties.census_records || [];

const personRecords = props.item.properties.people || [];

const regex = /(?:<pre>)?(?:&lt;|<)i data-poi(?:=?(?:&quot;&quot;|""|\\\\"\\\\")?)?(?:&gt;|>)(?:&lt;\/|<\/)i(?:&gt;|>)(?:<\/pre>)?/gi;

function getreadablePersonId(notes) {
  const match = notes.match(/ID: P-(\d+)/);
  return match ? match[1] : null;
}

function getPersonID(notes) {
  const match = notes.match(/ID: P-(\d+)/);
  return match ? `P-${match[1]}` : null;
}

function getRace(raceCode) {
  const raceMap = {
    'W': 'White',
    'B': 'Black',
    'I': 'Native American',
    'A': 'Asian',
    'H': 'Hispanic',
    'O': 'Other'
  };
  return raceMap[raceCode] || 'Unknown';
};

function getGender(genderCode) {
  const genderMap = {
    'M': 'Male',
    'F': 'Female',
    'O': 'Other'
  };
};

const searchableName = (person) => {
  if (person && person?.name) {
    return person?.name;
  }
  else if (person)
  {
    return `${ person?.first_name || persson?.First_Name } ${person?.middle_name || person?.Middle_Name} ${ person?.last_name || person?.Last_Name } `;
  }
  else {
    return 'Unknown';
  }};

function age(person) {
  if (person) {
    if (!person || !person?.Age || person?.age_months == null) {
      return 'N/A';
    }
    if (person?.Age === 0 && person?.age_months === 0) {
      return 'Newborn';
    }
    if (person?.Age < 0 || person?.age_months < 0) {
      return 'N/A';
    }
    if (person?.Age === 0 && person?.age_months > 0) {
      return `${ person?.age_months } months`;
    }
    if (person?.Age > 0 && (person?.age_months === 0 || person?.age_months === '')) {
      return `${ person?.Age } years`;
    }
    if (person?.Age > 0 && person?.age_months > 0) {
      return `${ person?.Age } years, ${ person?.age_months } months`;
    }
    if (person?.Age > 0 && person?.age_months < 0) {
      return `${ person?.Age } years`;
    }
    if (person?.Age < 0 && person?.age_months > 0) {
      return `${ person?.age_months } months`;
    }
    return `N/A`;
  }
  return 'N/A';
};

const rich_description = computed(() => {
  if (!item || !item.description) {
    return 'N/A';
  }
  return item.description.body.replace(regex, "") || 'N/A';
});
</script>

<template>
  <div>
    <h2>Building Details</h2>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>{{utils.titleCase(item.description.name)}}:</strong><span v-html="item.description.body"></span></p>
    <p><strong>Address:</strong> {{ item.address }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item.location) }}</p>
    <div v-if="personRecords">
      <details v-for="(person,index) in personRecords" :key="person?.id">
        <summary><h5>{{ searchableName(person) + '(' + person?.age || '' + ')'}}</h5></summary>
        <p><strong>Name:</strong> {{ person?.name }}</p>
        <p><strong>Description:</strong> {{ person?.description }}</p>
        <p><strong>Race:</strong> {{ getRace(person?.race) }}</p>
        <p><strong>Gender:</strong> {{ getGender(person?.gender) }}</p>
        <p><strong>Age:</strong> {{ person?.age }}</p>
        <p><strong>Place of Birth:</strong> {{ person?.place_of_birth }}</p>
        <p><strong>Birth Year:</strong> {{ person?.birth_year }}</p>
        <p><strong>Census Year:</strong> {{ person?.year }}</p>
        <p><strong>Description:</strong> {{ person?.description }}</p>
        <p><strong>Name:</strong> {{ person?.name }}</p>
        <p><strong>Notes:</strong> {{ person?.notes }}</p>
        <p><strong>Description:</strong> {{ person?.description }}</p>
      </details>
    </div>
    <hr/>
    <div v-if="people">
      <details v-for="(person,index) in people" :key="getPersonID">
        <summary><h5>{{ searchableName(person) + '(' + person?.age || '' + ')'}}</h5></summary>
        <p><strong>Age:</strong> {{ age(person) }}</p>
        <p><strong>Gender:</strong> {{ person?.sex || 'N/A' }}</p>
        <p><strong>Race:</strong> {{ person?.race || 'N/A' }}</p>
        <p><strong>Primary Language Spoken:</strong> {{ person?.mother_tongue || 'N/A' }}</p>
        <p><strong>Marital Status:</strong> {{ person?.marital_status || 'N/A' }}</p>
        <p><strong>Foreign Born:</strong> {{ person?.foreign_born || 'N/A' }}</p>
        <p><strong>Naturalized:</strong> {{ person?.naturalized_alien || 'N/A' }}</p>
        <p><strong>Year Immigrated:</strong> {{ person?.year_immigrated || 'N/A' }}</p>
        <p><strong>Birthplace:</strong> {{ person?.pob || 'N/A' }}</p>
        <p><strong>Education:</strong> {{ person?.education || 'N/A' }}</p>
        <p><strong>Attended School:</strong> {{ person?.attended_school || 'N/A' }}</p>
        <p><strong>Can Read:</strong> {{ person?.can_read || 'N/A' }}</p>
        <p><strong>Can Write:</strong> {{ person?.can_write || 'N/A' }}</p>
        <p><strong>Can Speak English:</strong> {{ person?.can_speak_english || 'N/A' }}</p>
        <p><strong>Employment:</strong> {{ person?.employment || 'N/A' }}</p>
        <p><strong>Occupation:</strong> {{ person?.occupation || 'N/A' }}</p>
        <p><strong>Industry:</strong> {{ person?.industry || 'N/A' }}</p>
        <p><strong>Institution:</strong> {{ person?.institution || 'N/A' }}</p>
        <p><strong>Relationship To Head of Household:</strong> {{ person?.relation_to_Head || 'N/A' }}</p>
        <p><strong>Home Owned or Rented:</strong> {{ person?.home_owned_rented || 'N/A' }}</p>
        <p><strong>Farm Schedule No.:</strong> {{ person?.farm_schedule_no_ || 'N/A' }}</p>
        <p><strong>Mortgage:</strong> {{ person?.mortgage || 'N/A' }}</p>
        <p><strong>Father's Birthplace:</strong> {{ person?.pob_Father || 'N/A' }}</p>
        <p><strong>Father's Language:</strong> {{ person?.mother_tongue_father || 'N/A' }}</p>
        <p><strong>Mother's Birthplace:</strong> {{ person?.pob_mother || 'N/A' }}</p>
        <p><strong>Mother's Language:</strong> {{ person?.mother_tongue_mother || 'N/A' }}</p>
        <p><strong>Page #:</strong> {{ person?.page_number || 'N/A' }}</p>
        <p><strong>Side:</strong> {{ person?.page_side || 'N/A' }}</p>
        <p><strong>Line #:</strong> {{ person?.line_number || 'N/A' }}</p>
      </details>
    </div>
  </div>
</template>

<style scoped>
  hr.section{
    border: none;
    border-top: 0.1875rem groove var(--gcc-black);
    color: var(--gcc-black);
    overflow: visible;
    text-align: center;
    height: 0.3125rem;
  }

  h4, h5 {
    display: inline;
  }
</style>