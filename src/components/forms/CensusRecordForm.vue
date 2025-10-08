<script setup>
import CensusRecordFields from '@FormsPartials/CensusRecordFields.vue';

const props = defineProps({ item: {type: Object, required: true} });
</script>

<template>
  <div>
    <h3>Census Record</h3>
    <CensusRecordFields :record="record" :year="Number.parseInt(item.year)"></CensusRecordFields>
  </div>
</template>