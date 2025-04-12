<script setup>
const props = defineProps({ item: Object });
</script>

<template>
  <div>
    <h2>Person Details</h2>
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
  </div>
</template>