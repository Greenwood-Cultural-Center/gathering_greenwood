<script setup>
import { ref, onMounted } from 'vue';
import HelpVideoModal from './HelpVideoModal.vue';
import LegalInfo from './LegalInfo.vue';

const videoModalRef = ref(null);
const helpVideoUrl = 'GCC-Kiosk-April-2025.webm';
const showInfo = ref(false);

const emit = defineEmits(['close']);

function showHelpVideo() {
  // Logic to show help video
  if (videoModalRef.value) {
    videoModalRef.value.openDialog();
  }
}

function exploreMap() {
  emit('close');
}

function closeInfoPage() {
  showInfo.value = false;
}

function openInfoPage() {
  showInfo.value = true;
}
</script>

<template>
  <div class="landing-overlay">
    <div class="welcome-container">
      <div class="background-texture"></div>
      <div class="content">
        <h1 class="welcome-text">
          <img src="/Welcome-to-sm.webp" width="496" height="96" alt="Welcome to in script lettering" class="welcome-script">
          <span class="title" width="1524.6" height="105.59">GATHERING GREENWOOD</span>
        </h1>

        <div class="buttons-layout">
          <!-- Main row of 3 buttons -->
          <div class="main-buttons">
            <button class="button how-to" @click="showHelpVideo">How to</button>

            <button class="button explore" @click="exploreMap">Explore the Map</button>
            <button class="button feedback">Feedback</button>
          </div>

          <!-- Project Info button (bottom-right) -->
          <div class="bottom-right">
            <button class="button project-info" @click="openInfoPage">Project Info</button>
          </div>

          <!-- Video Modal Component to show help video -->
          <HelpVideoModal ref="videoModalRef" :url="helpVideoUrl" :autoplay="true"></HelpVideoModal>
          <LegalInfo v-if="showInfo" @close="closeInfoPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


.landing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  --main-button-width: 20.901rem;
  --main-button-height: 9.085rem;
  --sub-button-width: 10.6739rem;
  --sub-button-height: 4.617rem;
}

.welcome-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--gcc-dk-green); /* Dark green background */
  color: white;
  overflow: hidden;
}

.background-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/welcome-bkg.webp');
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;
}

.content {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.welcome-text {
  text-align: center;
}

.welcome-script {
  width: 31rem;
  height: 6rem;
  transform: translate(-337px, 42px);
}

.title {
  display: block;
  font-family: 'Figtree';
  font-size: 6rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--gcc-white);
  text-shadow: 2px 5px var(--gcc-orange);
}

.buttons-layout {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.main-buttons {
  display: flex;
  justify-content: space-evenly;
  gap: 2rem;
}

.main-buttons button {
  width: var(--main-button-width);
  height: var(--main-button-height);
}

button.project-info {
  width: var(--sub-button-width);
  height: var(--sub-button-height);
  font-size: 1.986rem;
  padding: 0 0.5rem;
  line-height: 1.7rem;
}

.bottom-right {
  position: absolute;
  bottom: calc(var(--sub-button-height) * 0.90);
  right: calc(((var(--main-button-width) / 2) + 7rem) - (var(--sub-button-width) / 2));
}

.button {
  font-family: "Figtree", sans-serif;
  padding: 0rem;
  font-size: 3.177rem;
  font-weight: 900;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.button:active {
  transform: scale(0.95);
}

.how-to {
  background-color: var(--gcc-orange); /* Gold/brown color */
  color: var(--gcc-white);
}

.explore, .feedback, .project-info {
  background-color: var(--gcc-white);
  color: var(--gcc-dk-green); /* Dark green */
}

@media (max-height: 700px) {
  .welcome-text {
    margin-block-start: 20px;
    margin-block-end: 70px;
  }
}
</style>