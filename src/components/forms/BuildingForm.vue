<script setup>

const props = defineProps({ item: {type: Object, required: true} });

function formatLocation(location) {
  return location ? location.join(",") : 'Unknown';
}

</script>

<template>
  <div>
    <h2>Building Details</h2>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong><span v-html="item.description.body"></span></p>
    <p><strong>Address:</strong> {{ item.address }} </p>
    <p><strong>Location:</strong> {{ formatLocation(item.location) }}</p>
  </div>
</template>
