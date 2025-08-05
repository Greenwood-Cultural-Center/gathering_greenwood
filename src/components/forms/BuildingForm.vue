<script setup>
import { computed } from 'vue';
import utils from '@utils/utils.js';
import CensusRecordFields from '@forms/Partials/CensusRecordFields';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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

// Example using JavaScript for dynamic positioning and showing/hiding
const tooltip = document.querySelector('.tooltip');
const tooltipText = document.querySelector('.tooltipText');

tooltip.addEventListener('mouseover', () => {
  tooltipText.style.visibility = 'visible';
  tooltipText.style.opacity = '1';
  // Calculate and set tooltip position dynamically based on tooltip and container positions
});

tooltip.addEventListener('mouseout', () => {
  tooltipText.style.visibility = 'hidden';
  tooltipText.style.opacity = '0';
});

document.addEventListener('click', function(event) {
  const tooltipTrigger = document.querySelector('.tooltip'); // The element that shows the tooltip
  const tooltipContent = document.querySelector('.tooltipText'); // The tooltip itself

  // Check if the click is outside both the trigger and the tooltip
  if (!tooltipTrigger.contains(event.target) && !tooltipContent.contains(event.target)) {
    // Hide the tooltip
    tooltipContent.style.visibility = 'hidden';
    tooltipContent.style.opacity = '0';
  } else if (tooltipTrigger.contains(event.target)) {
    // If the click is on the trigger, toggle the tooltip's visibility
    if (tooltipContent.style.visibility === 'visible') {
      tooltipContent.style.visibility = 'hidden';
      tooltipContent.style.opacity = '0';
    } else {
      tooltipContent.style.visibility = 'visible';
      tooltipContent.style.opacity = '1';
    }
  }
});

</script>

<template>
  <div>
    <h2>Building Details</h2>
    <FontAwesomeIcon :icon="['far', 'circle-info']" class="tooltip">
      <span class="tooltipText">
        <table>
          <caption>This result has a confidence score of {{ item.confidence_score }}. The above show the fields that matched the search query</caption>
          <thead>
            <tr>
              <th>Record Type</th>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <template v-for="detail in item.match_details" :key="detail.field+detail.value">
                <td>detail.type</td>
                <td>detail.field</td>
                <td>detail.value</td>
              </template>
            </tr>
          </tbody>
        </table>
      </span>
    </FontAwesomeIcon>
    <p><strong>Name:</strong> {{ item.name || item.address.replaceAll("  "," ") }}</p>
    <p><strong>{{utils.titleCase(item.description.name)}}:</strong><span v-html="rich_description"></span></p>
    <p><strong>Address:</strong> {{ item.address.replaceAll("  "," ") }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item.location) }}</p>
    <div v-if="people.length">
      <h3>Associated People</h3>
      <div v-for="(person,index) in people" name="person" :key="getPersonID(person?.notes) || person?.id">
        <details>
          <summary><h4>{{ searchableName(person) + '(' + (person?.age || '') + ')' }} </h4></summary>
          <p><strong>Name:</strong> {{ person?.name }}</p>
          <p><strong>Description:</strong> {{ person?.description }}</p>
          <p><strong>Race:</strong> {{ getRace(person?.race) }}</p>
          <p><strong>Gender:</strong> {{ getGender(person?.gender) }}</p>
          <p><strong>Age:</strong> {{ person?.age }}</p>
          <p><strong>Place of Birth:</strong> {{ person?.place_of_birth }}</p>
          <p><strong>Birth Year:</strong> {{ person?.birth_year }}</p>
          <p><strong>Census Year:</strong> {{ person?.year }}</p>
          <p><strong>Notes:</strong> {{ person?.notes }}</p>
          <div v-if="person.properties.census_records && person.properties.census_records.length">
            <h4>Census Records:</h4>
            <details v-for="(record,index) in person.properties.census_records.filter((cr => cr.person_id === person.id))" name="people_census" :key="record.id">
              <summary><h6>{{ searchableName(record) + '(' + (record?.age || '') + ')'}}</h6></summary>
              <CensusRecordFields :record="record"></CensusRecordFields>
            </details>
          </div>
        </details>
        <hr class="section"/>
      </div>
    </div>
    <hr/>
    <div v-if="census_records.length">
      <h3>Census Records Without Associated People</h3>
      <details v-for="(record,index) in census_records" name="census" :key="getPersonID">
        <summary><h4>{{ searchableName(record) + '(' + (record?.age || '') + ')'}}</h4></summary>
        <CensusRecordFields :record="record"></CensusRecordFields>
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

  summary h3, h4, h5, h6 {
    display: inline;
  }

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

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
</style>