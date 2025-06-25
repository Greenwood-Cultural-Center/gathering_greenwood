<script setup>
import { computed } from 'vue';
import utils from '@utils/utils.js';

const props = defineProps({ item: {type: Object, required: true} });

const formatLocation = (location) => {return location && location.every((coord) => coord) ? location.join(",") : 'Unknown'};


const people = props.item.properties?.people?.sort((a,b) => {
    const nameA = a?.sortable_name?.toUpperCase();
    const nameB = b?.sortable_name?.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}) || [];

const census_records = () => {
  let people_census_ids = people.flatMap(person => person.properties?.census_records?.flatMap(record => record.id));
  return props.item.properties?.census_records?.filter(record => !people_census_ids?.includes(record.id))?.sort((a,b) => {
    const nameA = a?.sortable_name?.toUpperCase();
    const nameB = b?.sortable_name?.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}) || [];
};

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
  return genderMap[genderCode] || 'Unknown';
};

const searchableName = (person) => {
  if (person && person?.name) {
    return person?.name;
  }
  else if (person)
  {
    return `${ (person?.first_name || person?.First_Name) || '' } ${ (person?.middle_name || person?.Middle_Name) || '' } ${ (person?.last_name || person?.Last_Name) || '' } `;
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
  if (!props.item || !props.item?.description) {
    return 'N/A';
  }
  return props.item?.description?.body?.replace(regex, "") || 'N/A';
});
</script>

<template>
  <div>
    <h2>Building Details</h2>
    <p><strong>Name:</strong> {{ item.name || item.address.replaceAll("  "," ") }}</p>
    <p><strong>{{utils.titleCase(item.description.name)}}:</strong><span v-html="rich_description"></span></p>
    <p><strong>Address:</strong> {{ item.address.replaceAll("  "," ") }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item.location) }}</p>
    <div v-if="people.length">
      <h3>Associated People</h3>
      <details v-for="(person,index) in people" :key="getPersonID(person?.notes) || person?.id">
        <summary><h4>{{ searchableName(person) + '(' + (person?.age || '') + ')'}}</h4></summary>
        <p><strong>Name:</strong> {{ person?.name }}</p>
        <p><strong>Description:</strong> {{ person?.description }}</p>
        <p><strong>Race:</strong> {{ getRace(person?.race) }}</p>
        <p><strong>Gender:</strong> {{ getGender(person?.gender) }}</p>
        <p><strong>Age:</strong> {{ person?.age }}</p>
        <p><strong>Place of Birth:</strong> {{ person?.place_of_birth }}</p>
        <p><strong>Birth Year:</strong> {{ person?.birth_year }}</p>
        <p><strong>Census Year:</strong> {{ person?.year }}</p>
        <p><strong>Notes:</strong> {{ person?.notes }}</p>
        <div v-if="person.census_records && person.census_records.length">
        <hr/>
          <details>
            <summary><h5>Census Records</h5></summary>
            <details v-for="(record,index) in census_records" :key="getPersonID">
              <summary><h6>{{ searchableName(record) + '(' + (record?.age || '') + ')'}}</h6></summary>
              <p><strong>Age:</strong> {{ age(record) }}</p>
              <p><strong>Gender:</strong> {{ getGender(record?.sex) }}</p>
              <p><strong>Race:</strong> {{ getRace(record?.race) }}</p>
              <p><strong>Primary Language Spoken:</strong> {{ record?.mother_tongue || 'N/A' }}</p>
              <p><strong>Marital Status:</strong> {{ record?.marital_status || 'N/A' }}</p>
              <p><strong>Foreign Born:</strong> {{ record?.foreign_born || 'N/A' }}</p>
              <p><strong>Naturalized:</strong> {{ record?.naturalized_alien || 'N/A' }}</p>
              <p><strong>Year Immigrated:</strong> {{ record?.year_immigrated || 'N/A' }}</p>
              <p><strong>Birthplace:</strong> {{ record?.pob || 'N/A' }}</p>
              <p><strong>Education:</strong> {{ record?.education || 'N/A' }}</p>
              <p><strong>Attended School:</strong> {{ record?.attended_school || 'N/A' }}</p>
              <p><strong>Can Read:</strong> {{ record?.can_read || 'N/A' }}</p>
              <p><strong>Can Write:</strong> {{ record?.can_write || 'N/A' }}</p>
              <p><strong>Can Speak English:</strong> {{ record?.can_speak_english || 'N/A' }}</p>
              <p><strong>Employment:</strong> {{ record?.employment || 'N/A' }}</p>
              <p><strong>Occupation:</strong> {{ record?.occupation || 'N/A' }}</p>
              <p><strong>Industry:</strong> {{ record?.industry || 'N/A' }}</p>
              <p><strong>Institution:</strong> {{ record?.institution || 'N/A' }}</p>
              <p><strong>Relationship To Head of Household:</strong> {{ record?.relation_to_Head || 'N/A' }}</p>
              <p><strong>Home Owned or Rented:</strong> {{ record?.home_owned_rented || 'N/A' }}</p>
              <p><strong>Farm Schedule No.:</strong> {{ record?.farm_schedule_no_ || 'N/A' }}</p>
              <p><strong>Mortgage:</strong> {{ record?.mortgage || 'N/A' }}</p>
              <p><strong>Father's Birthplace:</strong> {{ record?.pob_Father || 'N/A' }}</p>
              <p><strong>Father's Language:</strong> {{ record?.mother_tongue_father || 'N/A' }}</p>
              <p><strong>Mother's Birthplace:</strong> {{ record?.pob_mother || 'N/A' }}</p>
              <p><strong>Mother's Language:</strong> {{ record?.mother_tongue_mother || 'N/A' }}</p>
              <p><strong>Page #:</strong> {{ record?.page_number || 'N/A' }}</p>
              <p><strong>Side:</strong> {{ record?.page_side || 'N/A' }}</p>
              <p><strong>Line #:</strong> {{ record?.line_number || 'N/A' }}</p>
            </details>
          </details>
        </div>
      </details>
    </div>
    <div v-if="census_records.length">
      <hr/>
      <h3>Census Records Without Associated People</h3>
      <details v-for="(record,index) in census_records" :key="getPersonID">
        <summary><h4>{{ searchableName(record) + '(' + (record?.age || '') + ')'}}</h4></summary>
        <p><strong>Age:</strong> {{ age(record) }}</p>
        <p><strong>Gender:</strong> {{ record?.sex || 'N/A' }}</p>
        <p><strong>Race:</strong> {{ record?.race || 'N/A' }}</p>
        <p><strong>Primary Language Spoken:</strong> {{ record?.mother_tongue || 'N/A' }}</p>
        <p><strong>Marital Status:</strong> {{ record?.marital_status || 'N/A' }}</p>
        <p><strong>Foreign Born:</strong> {{ record?.foreign_born || 'N/A' }}</p>
        <p><strong>Naturalized:</strong> {{ record?.naturalized_alien || 'N/A' }}</p>
        <p><strong>Year Immigrated:</strong> {{ record?.year_immigrated || 'N/A' }}</p>
        <p><strong>Birthplace:</strong> {{ record?.pob || 'N/A' }}</p>
        <p><strong>Education:</strong> {{ record?.education || 'N/A' }}</p>
        <p><strong>Attended School:</strong> {{ record?.attended_school || 'N/A' }}</p>
        <p><strong>Can Read:</strong> {{ record?.can_read || 'N/A' }}</p>
        <p><strong>Can Write:</strong> {{ record?.can_write || 'N/A' }}</p>
        <p><strong>Can Speak English:</strong> {{ record?.can_speak_english || 'N/A' }}</p>
        <p><strong>Employment:</strong> {{ record?.employment || 'N/A' }}</p>
        <p><strong>Occupation:</strong> {{ record?.occupation || 'N/A' }}</p>
        <p><strong>Industry:</strong> {{ record?.industry || 'N/A' }}</p>
        <p><strong>Institution:</strong> {{ record?.institution || 'N/A' }}</p>
        <p><strong>Relationship To Head of Household:</strong> {{ record?.relation_to_Head || 'N/A' }}</p>
        <p><strong>Home Owned or Rented:</strong> {{ record?.home_owned_rented || 'N/A' }}</p>
        <p><strong>Farm Schedule No.:</strong> {{ record?.farm_schedule_no_ || 'N/A' }}</p>
        <p><strong>Mortgage:</strong> {{ record?.mortgage || 'N/A' }}</p>
        <p><strong>Father's Birthplace:</strong> {{ record?.pob_Father || 'N/A' }}</p>
        <p><strong>Father's Language:</strong> {{ record?.mother_tongue_father || 'N/A' }}</p>
        <p><strong>Mother's Birthplace:</strong> {{ record?.pob_mother || 'N/A' }}</p>
        <p><strong>Mother's Language:</strong> {{ record?.mother_tongue_mother || 'N/A' }}</p>
        <p><strong>Page #:</strong> {{ record?.page_number || 'N/A' }}</p>
        <p><strong>Side:</strong> {{ record?.page_side || 'N/A' }}</p>
        <p><strong>Line #:</strong> {{ record?.line_number || 'N/A' }}</p>
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

  summary h3, h4, h5 {
    display: inline;
  }
</style>