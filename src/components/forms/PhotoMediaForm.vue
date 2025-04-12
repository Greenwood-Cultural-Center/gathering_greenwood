<script setup>
const props = defineProps({ item: Object });


const photo = props.item;
const thumbnail = photo?.properties?.[0]?.thumbnail;
</script>

<template>
  <div>
    <h2>Photo</h2>
    <img :src="thumbnail" :alt="photo.description" style="max-width: 100%" />
    <p><strong>Description:</strong> {{ photo.description }} </p>
    <p><strong>Caption:</strong> {{ photo.caption }} </p>
  </div>
</template>