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
  ariaLabel: {
    type: String,
    default: '',
  },
  ariaDescription: {
    type: String,
    default: '',
  },
  shadowX: {
    type: Number,
    default: 3,
  },
  shadowY: {
    type: Number,
    default: 3,
  },
  shadowBlurTop: {
    type: Number,
    default: 0,
  },
  shadowBlurBottom: {
    type: Number,
    default: 1,
  },
  shadowWidth: {
    type: Number,
    default: 0.5,
  },
  shadowColor: {
    type: String,
    default: '#eee',
  },
});

const delayRef = toRef(props, 'delay');
const shadowXRef = toRef(props, 'shadowX');
const shadowYRef = toRef(props, 'shadowY');
const shadowBlurTopRef = toRef(props, 'shadowBlurTop');
const shadowBlurBottomRef = toRef(props, 'shadowBlurBottom');
const shadowWidthRef = toRef(props, 'shadowWidth');
const shadowColorRef = toRef(props, 'shadowColor');

const cssVars = computed(() => ({
  "--transitionDelay": `${delayRef.value}s`,
  "--x-offset": `${shadowXRef.value}px`,
  "--x-offset-neg": `-${shadowXRef.value}px`,
  "--y-offset": `${shadowYRef.value}px`,
  "--y-offset-neg": `-${shadowYRef.value}px`,
  "--t-blur": `${shadowBlurTopRef.value}px`,
  "--b-blur": `${shadowBlurBottomRef.value}px`,
  "--shadow-width": `${shadowWidthRef.value}px`,
  "--shadow-color": shadowColorRef.value,
}));

</script>

<template>
  <a href="#" :style="cssVars" :title="title" class="fabInnerButton" :aria-label="ariaLabel" role="button" :aria-description="ariaDescription">
    <FontAwesomeIcon :icon="icon" :class="`icon ${iconClass}`" />
  </a>
  <div :style="cssVars" class="fabLabel">{{ title }}</div>
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
      top: 47%;
      left: 50%;
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
    -webkit-text-stroke: var(--shadow-width) var(--shadow-color);
    text-shadow: var(--x-offset) var(--y-offset) var(--t-blur) var(--shadow-color), var(--x-offset-neg) var(--y-offset) var(--t-blur) var(--shadow-color), var(--x-offset-neg) var(--y-offset-neg) var(--b-blur) var(--shadow-color), var(--x-offset) var(--y-offset-neg) var(--b-blur) var(--shadow-color);
  }

</style>