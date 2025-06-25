<script setup>

const props = defineProps({ item: {type: Object, required: true} });

const census_records = () => {
  return props.item.properties?.census_records?.sort((a,b) => {
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

function getreadablePersonId(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
  return match ? match[1] : null;
}

function getPersonID(notes) {
  const match = notes?.match(/ID: P-(\d+)/);
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
    return `${ person?.first_name || person?.First_Name } ${person?.middle_name || person?.Middle_Name} ${ person?.last_name || person?.Last_Name } `;
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

</script>

<template>
  <div>
    <h2>Person Details</h2>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <p><strong>Race:</strong> {{ getRace(item.race) }}</p>
    <p><strong>Gender:</strong> {{ getGender(item.gender) }}</p>
    <p><strong>Age:</strong> {{ item.age }}</p>
    <p><strong>Place of Birth:</strong> {{ item.place_of_birth }}</p>
    <p><strong>Birth Year:</strong> {{ item.birth_year }}</p>
    <p><strong>Census Year:</strong> {{ item.year }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Notes:</strong> {{ item.notes }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <div v-if="census_records && census_records.length">
      <hr/>
      <details>
        <summary><h3>Census Records</h3></summary>
        <details v-for="(record,index) in census_records" :key="getrecordID">
          <summary><h4>{{ searchableName(record) + '(' + record?.age + ')'}}</h4></summary>
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
          <!-- <p><strong>Census Line:</strong> {{ person?.Census_Scope || 'N/A' }}</p> -->
        </details>
      </details>
    </div>
  </div>
</template>

<style scoped>
  summary h3, h4, h5 {
    display: inline;
  }
</style>