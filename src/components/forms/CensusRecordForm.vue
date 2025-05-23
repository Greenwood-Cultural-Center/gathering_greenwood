<script setup>

const props = defineProps({ item: {type: Object, required: true} });
</script>

<template>
  <div>
    <h2>Census Record</h2>
    <img :src="item.URL" :alt="item.description" style="max-width: 100%" />
    <p><strong>Name:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
  </div>
</template>