<script setup>
const props = defineProps({ item: Object });
</script>

<template>
  <div>
    <h2>Story</h2>
    <p><strong>Story:</strong> <span v-html="item.story.body"></span> </p>
    <p><strong>Sources:</strong> <span v-html="item.sources.body"></span></p>
  </div>
</template>