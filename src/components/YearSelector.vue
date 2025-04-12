<template>
    <div class="year-selector">
      <button @click="setYear('1910', $event)">1910</button>
      <button @click="setYear('1920', $event)">1920</button>
    </div>
  </template>

  <script setup>
  import { defineProps, ref } from 'vue';

  // Props
  const props = defineProps({
    onYearChange: {
      type: Function,
      required: true
    }
  });

  const clickedElement = ref(null);

  // Function to set the year
  function setYear(year, event) {
    // Remove the class from the previously clicked element
    if (clickedElement.value) {
      clickedElement.value.classList.remove('selected');
    }

    // Store the clicked element
    clickedElement.value = event.target;

    // Add a class to the clicked element
    clickedElement.value.classList.add('selected');

    // Call the function passed from the parent to set the year
    props.onYearChange(year);
  }
  </script>

  <style scoped>
  .year-selector {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    background-color: var(--gcc-beige);
    /* background-color: rgba(255, 255, 255, 0.8); */
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 8px;
    z-index: 1000;
  }

  button {
    padding: 10px 20px;
    font-size: 2rem;
    background-color: var(--gcc-dk-green);
    color: var(--gcc-orange);
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button.selected {
    background-color: var(--gcc-lt-green);
    color: white;
  }

  button:hover {
    background-color: var(--gcc-lt-green);
    color: white;
  }
  </style>