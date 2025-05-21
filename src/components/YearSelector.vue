<script setup>
import { defineProps, ref, onMounted, onBeforeMount, inject } from 'vue';
import utils from '../utils/utils.js';
import objectHash from 'object-hash';

// Props
const props = defineProps({
  onYearChange: {
    type: Function,
    required: true
  },
  yearArray: {
    type: Array,
    required: true
  }
});

// State
appConfig = inject('appConfig');

appConfig.manager.onSelectionChange.on((newKey) => {
  // Update the selected year in the component
  el = document.querySelector(`input[value="${newKey}"]`);
  target = getRadioForYear(newKey);
  setYear(newKey, target);
});

// Show fancy year selector
const showfancy = ref(false);

const clickedElement = ref(null);

function getRadioForYear(year) {
  var selector = `input[value="${year}"]`;
  var el = document.querySelector(selector);
  return { target:el};
}

onMounted(() => {
  // Set the default year to the configured year
  const defaultYear = AppConfig.manager.summary.year;
  var terget = getRadioForYear(defaultYear);
  setYear(defaultYear, target);
});

function removeSelection() {
  // Remove the class from the previously clicked element
  if (clickedElement.value) {
    clickedElement.value.removeAttribute('checked');
    document.querySelector(`label[for="${clickedElement.value.id}"]`).classList.remove('selected');
  }
}

function selectYear(year, event) {
  // Store the clicked element
  clickedElement.value = event.target;
  // Add a class to the clicked element
  clickedElement.value.setAttribute('checked', '');

  document.querySelector(`label[for="${clickedElement.value.id}"]`).classList.add('selected');
}

// Function to set the year
function setYear(year, event) {

  // Remove the class from the previously clicked element
  removeSelection();

  // Store the clicked element
  app.manager.selectedKey = year;
  selectYear(year, event);
}
</script>

<template>
    <div class="year-selector">
      <input v-for="[year, yearData] in appConfig.yearEntries" type="radio" name="year" :id="yearData.inputid" :value="yearData.value" :key="yearData.hash" @change="setYear($event.target.value, $event)"></input>
      <div class="content">
        <!--<div v-if="showfancy" class="maps-date">
          <div class="map-date d d-1">1</div>
          <div class="map-date d d-2">2</div>
          <div class="map-date d d-3"></div>
          <div class="map-date y y-1 y-2">0</div>
          <div class="map-date y y-3"></div>
          <div class="map-date c c-1 c-2">19</div>
          <div class="map-date c c-3"></div>
        </div> -->
        <div class="timeline">
          <label class="timeline-dot" v-for="[year, yearData] in appConfig.yearEntries" :for="yearData.inputid"><span v-if="!showfancy" :id="yearData.labelid" :key="yearData.key" >{{ yearData.year }}</span></label>
          <div class="timeline-line"></div>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .year-selector {
    position: relative;
    user-select: none;
    width: 25rem;
    height: 3rem;
    max-width: 100%;
    margin-left: 3rem;
    z-index: 1000;
  }

  .year-selector .content {
    display: flex;
  }

  .year-selector .timeline {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .year-selector .timeline-line {
    position: absolute;
    top: 50%;
    margin-top: -1px;
    width: 100%;
    height: 0.3rem;
    background: #827B68;
  }

  .year-selector .timeline-line:before {
    content: "";
    position: absolute;
    left: 0;
    width: 0%;
    height: 100%;
    background: var(--gcc-orange);
    transition: 350ms ease all;
  }

  .year-selector .timeline-dot {
    position: relative;
    z-index: 1;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    border: 2px solid #827B68;
    background: var(--gcc-orange);
    transition: 350ms ease all;
  }

  .year-selector .maps-date {
    position: absolute;
    bottom: 2rem;
    left: -2rem;
  }

  .year-selector .map-date {
    position: absolute;
    bottom: -1rem;
    left: 0;
    font-family: Righteous;
    font-size: 3.3rem;
    transition: 350ms ease all;
  }

  label:not(.selected) span {
    color:#666;
  }

  label.selected span {
    color: var(--gcc-white);
  }

  label:not(:last-of-type) span {
    position: relative;
    left: -1.3rem;
    top: -3.8rem;
  }

  label:last-of-type span {
    position: relative;
    left: -3.8rem;
    top: -3.8rem;
    display: flex;
    width: 11rem;
  }

  .year-selector .map-date.d {
    left: 3.3rem;
  }

  .year-selector .map-date.d-2 {
    left: 3.4rem;
  }

  .year-selector .map-date.y {
    left: 5.2rem;
  }

  .year-selector .map-date:not(.fixed) {
    transform: translate(50px);
    opacity: 0;
  }

  .year-selector #input-1:checked ~ .content .map-date.d-1 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-1:checked ~ .content .map-date.y-1 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-1:checked ~ .content .map-date.c-1 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-1:checked ~ .content .timeline-dot:nth-child(1) ~ .timeline-dot {
    background: #827B68;
  }

  .year-selector #input-1:checked ~ .content .timeline-line:before {
    width: 0%;
  }

  .year-selector #input-1:not(:checked) ~ .content .map-info:nth-child(1) {
    right: 150px;
  }

  .year-selector #input-1:not(:checked) ~ .content .map-date[class*="-1"] {
    right: 150px;
  }

  .year-selector #input-2:checked ~ .content .map-date.d-2 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-2:checked ~ .content .map-date.y-2 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-2:checked ~ .content .map-date.c-2 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-2:checked ~ .content .timeline-dot:nth-child(2) ~ .timeline-dot {
    background: #827B68;
  }

  .year-selector #input-2:checked ~ .content .timeline-line:before {
    width: 50%;
  }

  .year-selector #input-2:not(:checked) ~ .content .map-date[class*="-2"] {
    right: 150px;
  }

  .year-selector #input-3:checked ~ .content .map-date.d-3 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-3:checked ~ .content .map-date.y-3 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-3:checked ~ .content .map-date.c-3 {
    opacity: 1;
    transform: translate(0);
  }

  .year-selector #input-3:checked ~ .content .timeline-dot:nth-child(3) ~ .timeline-dot {
    background: #827B68;
  }

  .year-selector #input-3:checked ~ .content .timeline-line:before {
    width: 100%;
  }

  .year-selector #input-3:not(:checked) ~ .content .map-date[class*="-3"] {
    right: 150px;
  }

  input {
    position: absolute;
    left: -9999px;
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