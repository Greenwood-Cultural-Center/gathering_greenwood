<script setup>
import { defineProps, ref, computed, toRef} from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: Array,
    required: true,
  },
  delay: {
    type: Number,
    required: true,
  },
  iconClass: {
    type: String,
    default: '',
  },
});

const delayRef = toRef(props, 'delay');

const cssVars = computed(() => ({
  "--transitionDelay": `${delayRef.value}s`,
}));

</script>

<template>
  <a href="#" :style="{cssVars}" :title="title" class="fabInnerButton"><FontAwesomeIcon :icon="icon" :class="`icon ${iconClass}`" /></a><div :style="{cssVars}" class="fabLabel">{{ title }}</div>
</template>

<style>
/* Non-scoped style block to inject CSS variable */
.fabInnerButton {
  --transitionDelay: v-bind(cssVars['--transitionDelay']);
}

.fabLabel {
  --transitionDelay: v-bind(cssVars['--transitionDelay']);
}
</style>

<style scoped>

  a {
      display: block;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      text-decoration: none;
      margin: 10px auto 0;
      line-height: 1.15;
      background-color: var(--gcc-dk-green);
      color: var(--gcc-white);
      opacity: 0;
      visibility: hidden;
      position: relative;
      box-shadow: 0 0 5px 1px rgba(51, 51, 51, .3);
      transition: opacity .2s ease-in-out var(--transitionDelay), transform .15s ease-in-out;
    }

  a .icon {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

  .fabLabel {
    position: relative;
    top: -3rem;
    right: -7rem;
    width: 7rem;
    color: var(--gcc-dk-green);
    transition: opacity .2s ease-in-out var(--transitionDelay), transform .15s ease-in-out;
    opacity: 0;
    visibility: hidden;
    text-shadow: 2px 1px 0px #eee
  }

</style>