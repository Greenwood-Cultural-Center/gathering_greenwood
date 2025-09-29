<script setup>
import { computed } from 'vue';
import utils from '@utils/utils.js';
import CensusRecordFields from '@FormsPartials/CensusRecordFields.vue';
import InfoWindow from '@Utility/InfoWindow.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({ item: {type: Object, required: true} });

const formatLocation = (item) => {
  let location = item.location || item.geometry.coordinates;
  return location && location.every((coord) => coord) ? location.join(",") : 'Unknown';
};

const person_array = props.item.properties?.people || props.item.people;

const people = person_array?.sort((a,b) => {
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
  let census_records = props.item.properties?.census_records || props.item.census_records;
  if (census_records && Array.isArray(census_records) && census_records.length !== 0) {
    let people_census_ids = people.flatMap(person => census_records?.flatMap(record => record.id));
    return census_records?.filter(record => !people_census_ids?.includes(record.id))?.sort((a,b) => {
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
  }
  else {
    return [];
  };
};

const regex = /(?:<pre>)?(?:&lt;|<)i data-poi(?:=?(?:&quot;&quot;|""|\\\\"\\\\")?)?(?:&gt;|>)(?:&lt;\/|<\/)i(?:&gt;|>)(?:<\/pre>)?/gi;

function getRace(raceCode) {
  const races = [
    'White',
    'Black',
    'Native American',
    'Asian',
    'Hispanic',
    'Mulatto',
    'Other'
  ]
  const raceMap = {
    'W': 'White',
    'B': 'Black',
    'I': 'Native American',
    'A': 'Asian',
    'H': 'Hispanic',
    'M': 'Mulatto',
    'O': 'Other'
  };

  if (races.includes(raceCode)) {
    return raceCode;
  }

  return raceMap[raceCode] || 'Unknown';
};

function getGender(person) {
  const genderCode = person?.gender || person?.sex;
  const genders = [
    'Male',
    'Female',
    'Other'
  ];
  const genderMap = {
    'M': 'Male',
    'F': 'Female',
    'O': 'Other'
  };

  if (genders.includes(genderCode)) {
    return genderCode;
  }

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

function getAddress(item) {
  if (item && item?.address) {
    if (Array.isArray(item?.address))
    {
      return item?.address[0];
    }
    else {
      return item?.address;
    }
  }
  else if (item && item?.addresses && item?.addresses.length) {
    return getPrimaryAddress(item?.addresses).searchable_text;
  }
  else {
    return 'Unknown';
  }};

function getPrimaryAddress(addresses){
  return addresses.find((address) => address.is_primary)
}

function getReadablePersonId(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? match[1] : null;
}

function getPersonID(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? `P-${match[1]}` : null;
}

function age(person) {
  let normalizedAge = person?.Age || person?.age;
  if (person) {
    if (!person) {
      return 'N/A';
    }
    if (!person?.age) {
      return props.item.year - person.birth_year;
    }
    if (normalizedAge > 0) {
      return `${ normalizedAge } years`;
    }
    if (person?.age_months == null) {
      return 'N/A';
    }
    if (normalizedAge === 0 && person?.age_months === 0) {
      return 'Newborn';
    }
    if (normalizedAge < 0 || person?.age_months < 0) {
      return 'N/A';
    }
    if (normalizedAge === 0 && person?.age_months > 0) {
      return `${ person?.age_months } months`;
    }
    if (normalizedAge > 0 && (person?.age_months === 0 || person?.age_months === '')) {
      return `${ normalizedAge } years`;
    }
    if (normalizedAge > 0 && person?.age_months > 0) {
      return `${ normalizedAge } years, ${ person?.age_months } months`;
    }
    if (normalizedAge > 0 && person?.age_months < 0) {
      return `${ normalizedAge } years`;
    }
    if (normalizedAge < 0 && person?.age_months > 0) {
      return `${ person?.age_months } months`;
    }
    return `N/A`;
  }
  return 'N/A';
};

const rich_description = computed(() => {
  if (!props.item || !props.item?.rich_description?.body || props.item?.rich_description?.body === '' || !props.item?.properties?.rich_description?.body) {
    return 'N/A';
  }
  return props.item?.rich_description?.body?.replace(regex, "") || props.item?.properties?.rich_description?.body?.replace(regex, "") ||'N/A';
});

</script>

<template>
  <div v-if="item.buildings && item.location_id">
    <h3>Building Details</h3>
    <InfoWindow v-if="item.confidence_score" :item="item"></InfoWindow>
    <img v-if="item.photo" :src="item.photo" :alt="item.name || item.title || getAddress(item)" style="max-width: 100%; height: auto; margin-bottom: 1rem;" />
    <p><strong>Name:</strong> {{ item.name || item.title || item.POI || getAddress(item).replaceAll("  "," ") }}</p>
    <p><strong>{{utils?.titleCase(item?.rich_description?.name || item?.properties?.rich_description?.name)}}:</strong><span v-html="rich_description"></span></p>
    <p><strong>Address:</strong> {{ getAddress(item)?.replaceAll("  "," ") }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item) }}</p>
    <div class="people_container" v-if="people.length">
      <h3>Associated People</h3>
      <div v-for="(person,index) in people" :id="getPersonID(person?.notes)" :name="`person`" class="person_accordian" :key="getPersonID(person?.notes) || person?.id">
        <details>
          <summary><h4>{{ searchableName(person) + '( Age: ' + (age(person) || '') + ')' }} </h4></summary>
          <p><strong>Name:</strong> {{ searchableName(person) }}</p>
          <p><strong>Description:</strong> {{ person?.description }}</p>
          <p><strong>Race:</strong> {{ getRace(person?.race) }}</p>
          <p><strong>Gender:</strong> {{ getGender(person) }}</p>
          <p><strong>Age:</strong> {{ age(person) }}</p>
          <p><strong>Place of Birth:</strong> {{ person?.place_of_birth || person?.pob }}</p>
          <p><strong>Birth Year:</strong> {{ person?.birth_year }}</p>
          <p><strong>Census Year:</strong> {{ item?.year }}</p>
          <p><strong>Notes:</strong> {{ person?.notes }}</p>
          <div v-if="person?.properties?.census_records && person?.properties?.census_records?.length">
            <h4>Census Records:</h4>
            <details v-for="(record,index) in person?.properties?.census_records?.filter((cr => cr.person_id === person.id))" name="people_census" :key="record.id">
              <summary><h6>{{ searchableName(record) + '(' + (age(record) || '') + ')'}}</h6></summary>
              <CensusRecordFields :record="record"></CensusRecordFields>
            </details>
          </div>
        </details>
      </div>
    </div>
    <hr/>
    <div v-if="census_records.length">
      <h3>Census Records Without Associated People</h3>
      <details v-for="(record,index) in census_records" name="census" :key="getPersonID">
        <summary><h4>{{ searchableName(record) + '(' + (age(record) || '') + ')'}}</h4></summary>
        <CensusRecordFields :record="record" :year="item.year"></CensusRecordFields>
      </details>
    </div>
  </div>
  <div v-else>
    <p><strong>Name:</strong> {{ item.name || item.title || item.POI || getAddress(item).replaceAll("  "," ") }}</p>
    <p><strong>Address:</strong> {{ getAddress(item)?.replaceAll("  "," ") }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item) }}</p>
    <p>No building information available.</p>
  </div>
</template>

<style scoped>

  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  div.person_accordian {
    padding: 1rem;
  }

  div.people_container div:nth-child(odd) {
    background-color: #dbd3c6;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }

  summary h4 {
    color: var(--gcc-black);
  }
</style>