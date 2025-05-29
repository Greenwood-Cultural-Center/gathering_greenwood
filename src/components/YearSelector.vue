<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
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

const years = props.yearArray;

const selected = ref("");

const firstYear = years[0].year;
const lastYear = years[years.length - 1].year;

function buildYears() {
  years.forEach(async (year, index) => {
    year.d = year.year.slice(2, 3);
    year.y = year.year.slice(3, 4);
    year.c = year.year.slice(0, 2);
    year.inputid = `input-${index + 1}`;
    year.labelid = `label-${index + 1}`;
    year.dclass = `d-${index + 1}`;
    year.yclass = `y-${index + 1}`;
    year.cclass = `c-${index + 1}`;
    year.value = year.year;
  });

  years.map((year, index) => {
    year.key = objectHash(year);
  });

  years.push({
    year: `${firstYear} - ${lastYear}`,
    c: '',
    d: '',
    y: '',
    inputid: `input-${years.length + 1}`,
    labelid: `label-${years.length + 1}`,
    dclass: `d-${years.length + 1}`,
    yclass: `y-${years.length + 1}`,
    cclass: `c-${years.length + 1}`,
    value: '',
    key: objectHash({
      year: `${firstYear} - ${lastYear}`,
      c: '',
      d: '',
      y: '',
      inputid: `input-${years.length + 1}`,
      labelid: `label-${years.length + 1}`,
      dclass: `d-${years.length + 1}`,
      yclass: `y-${years.length + 1}`,
      cclass: `c-${years.length + 1}`,
      value: ''
    })
  });
}

// Show fancy year selector
const showfancy = ref(false);

const clickedElement = ref(null);

onBeforeMount(() => {
  buildYears();console.log(years);
});

onMounted(() => {
  // Set the default year to the last year in the array
  const defaultYear = years[years.length - 1].value;
  selected.value = defaultYear;
  var selector = `input[value="${defaultYear}"]`;
  var el = document.querySelector(selector);
  setYear(defaultYear, { target: el });
});

// Function to set the year
function setYear(year, event) {

  // Remove the class from the previously clicked element
  if (clickedElement.value) {
    clickedElement.value.removeAttribute('checked');
    document.querySelector(`label[for="${clickedElement.value.id}"]`).classList.remove('selected');
  }

  // Update the selected year
  selected.value = year;

  // Store the clicked element
  clickedElement.value = event.target;

  // Add a class to the clicked element
  clickedElement.value.setAttribute('checked', '');

  document.querySelector(`label[for="${clickedElement.value.id}"]`).classList.add('selected');

  // Call the function passed from the parent to set the year
  props.onYearChange(year);
}

const step = computed(() => {
  return years.length > 1 ? 100 / (years.length - 1) : 0;
});

const selectedIndex = computed(() =>
  years.findIndex(year => year.value === selected.value)
);

const lineWidth = computed(() => {
  return `${selectedIndex.value * step.value}%`;
});

</script>

<template>
    <div class="year-selector">
      <input v-for="year in years" type="radio" name="year" :id="year.inputid" :value="year.value" :key="year.key" @change="setYear($event.target.value, $event)"></input>
      <div class="content">
        <div v-if="showfancy" class="maps-date">
          <div class="map-date d d-1">1</div>
          <div class="map-date d d-2">2</div>
          <div class="map-date d d-3"></div>
          <div class="map-date y y-1 y-2">0</div>
          <div class="map-date y y-3"></div>
          <div class="map-date c c-1 c-2">19</div>
          <div class="map-date c c-3"></div>
        </div>
        <div class="timeline">
          <label class="timeline-dot" v-for="year in years" :for="year.inputid"><span v-if="!showfancy" :id="year.labelid" :key="year.key" >{{ year.year }}</span></label>
          <div class="timeline-line" :style="{ '--line-width': lineWidth }"></div>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .year-selector {
    position: relative;
    user-select: none;
    width: 30rem;
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
    right: 5rem;
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
    width: var(--line-width, 0%);
    transition: width 350ms ease;
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
    color: #959595;
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