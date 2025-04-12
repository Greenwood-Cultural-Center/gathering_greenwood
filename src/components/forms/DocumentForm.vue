<script setup>
import {
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const props = defineProps({ item: Object });

const fixedURL = `http://localhost:3001${props.item.URL}`;
</script>

<template>
  <div>
    <h2>Document Details</h2>
    <p><strong>Title: </strong><a :href="fixedURL" target="_blank"> {{ item.name }}</a><FontAwesomeIcon :icon="faLink" style="color:#646cff; margin-left:5px;"></FontAwesomeIcon></p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <img :src="fixedURL" :alt="item.description" style="max-width: 100%" />
  </div>
</template>