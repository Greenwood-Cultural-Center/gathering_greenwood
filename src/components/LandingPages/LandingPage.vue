<script setup>
import { ref, onMounted } from 'vue';
import HelpVideoModal from '@Modals/HelpVideoModal.vue';
import LegalInfo from '@Landing/LegalInfo.vue';
import FeedbackForm from '@Landing/FeedbackForm.vue';

const videoModalRef = ref(null);
const helpVideoUrl = 'GCC-Kiosk-April-2025.webm';
const showInfo = ref(false);
const showFeedback = ref(false);

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
function closeFeedback() {
  showFeedback.value = false;
}

function openFeedback() {
  showFeedback.value = true;
}
</script>

<template>
  <div class='landing-page-root'>
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
              <button class="button feedback"@click="openFeedback">Feedback</button>
            </div>

            <!-- Project Info button (bottom-right) -->
            <div class="bottom-right">
              <button class="button project-info" @click="openInfoPage">Project Info</button>
            </div>
          </div>
        </div>
        <!-- Video Modal Component to show help video -->
        <HelpVideoModal ref="videoModalRef" :url="helpVideoUrl" :autoplay="true"></HelpVideoModal>
      </div>
    </div>
    <LegalInfo v-if="showInfo" @close="closeInfoPage" />
    <FeedbackForm v-if="showFeedback" @close="closeFeedback" />
</div>
</template>

<style scoped>

h1, h2, h3, h4, h5, h6 {
  font-family: "Figtree";
}

.landing-page-root {
  width: 100%;
  height: 100%;
}

.landing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  --main-button-width: 20.901rem;
  --main-button-height: 9.085rem;
  --sub-button-width: 15rem;
  --sub-button-height: 8rem;
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
.welcome-script {
  width: 42rem;
  height: 8.129rem;
  transform: translate(-27.625rem, 4.3125rem);
}

.welcome-text {
  text-align: center;
  margin-block-start: 24rem;
  margin-block-end: 6.125rem;
}

.title {
  display: block;
  font-size: 8rem;
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
  gap: 9rem;
}

.main-buttons button {
  width: var(--main-button-width);
  height: var(--main-button-height);
}

button.project-info {
  width: var(--sub-button-width);
  height: var(--sub-button-height);
  font-size: 3rem;
  padding: 0 0;
  line-height: 2.75rem;
}

.bottom-right {
  position: absolute;
  bottom: calc(var(--sub-button-height) * 1.5);
  right: calc(((var(--main-button-width) / 2) + 19.65rem) - (var(--sub-button-width) / 2));
}

.button {
  font-family: "Figtree";
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

@media (max-width: 2500px) and (max-height: 1400px) and (min-resolution: 0.74dppx) and (resolution: 0.81dppx) {
  .welcome-text {
    margin-block-start: 13.375rem;
    margin-block-end: 10.125rem;
  }

  .welcome-script {
    width: 42rem;
    height: 8.129rem;
    transform: translate(-27.625rem, 4.3125rem);
  }

  .title {
    font-size: 8rem;
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 1.2);
    right: calc(((var(--main-button-width) / 2) + 17.8rem) - (var(--sub-button-width) / 2));
  }
}

@media (max-width: 2500px) and (max-height: 1300px) and (min-resolution: 0.74dppx) and (resolution: 0.81dppx) {
  .welcome-text {
    margin-block-start: 132px;
    margin-block-end: 123px;
  }

  .welcome-script {
    width: 47rem;
    height: 9.1rem;
    transform: translate(-25.625rem, 4.3125rem);
  }

  .title {
    font-size: 8rem;
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 0.9);
    right: calc(((var(--main-button-width) / 2) + 17.7rem) - (var(--sub-button-width) / 2));
  }
}

@media screen and (max-width: 1930px) and (max-height: 1090px) {
  .welcome-text {
    margin-block-start: 10rem;
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 0.4);
    right: calc(((var(--main-button-width) / 2) + 9.7rem) - (var(--sub-button-width) / 2));
  }

  .welcome-script {
    width: 39rem;
    height: 7.5rem;
    transform: translate(-28.625rem, 4.3125rem);
  }
}

/* @media (max-width: 1600px) and (max-height:900px) {
  .welcome-text {
    margin-block-start: 90px;
    margin-block-end: 80px;
  }

  .title {
    font-size: 5.7rem;
  }

  .welcome-script {
    width: 30rem;
    height: 5.864rem;
    transform: translate(-316px, 55px);
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 1.10);
    right: calc(((var(--main-button-width) / 2) + 7rem) - (var(--sub-button-width) / 2));
  }
}

@media (max-width: 1600px) and (max-height:700px) {
  .welcome-text {
    margin-block-start: 20px;
    margin-block-end: 70px;
  }

  .title {
    font-size: 5.7rem;
  }

  .welcome-script {
    width: 30rem;
    height: 5.864rem;
    transform: translate(-320px, 55px);
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 0.60);
    right: calc(((var(--main-button-width) / 2) + 7rem) - (var(--sub-button-width) / 2));
  }
}

@media (max-width: 1400px) and (max-height: 1300px) {
  .welcome-text {
    margin-block-start: 14.6875rem;
    margin-block-end: 7.3125rem;
  }

  .welcome-script {
    width: 27rem;
    height: 5.226rem;
    transform: translate(-294px, 53px);
  }

  .title {
    font-size: 5.2rem;
  }

  .bottom-right {
        bottom: calc(var(--sub-button-height) * 1.2);
        right: calc(((var(--main-button-width) / 2) + 1rem) - (var(--sub-button-width) / 2));
  }
}


@media (max-width: 1400px) and (max-height: 1100px) {
  .welcome-text {
    margin-block-start: 13.6875rem;
    margin-block-end: 7.3125rem;
  }

  .welcome-script {
    width: 27rem;
    height: 5.226rem;
    transform: translate(-294px, 53px);
  }

  .title {
    font-size: 5.2rem;
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 0.70);
    right: calc(((var(--main-button-width) / 2) + 0.5rem) - (var(--sub-button-width) / 2));
  }
}

@media (max-width: 1080px) and (max-height: 800px) {
  .welcome-text {
    margin-block-start: 3.6875rem;
    margin-block-end: 2.3125rem;
  }

  .welcome-text span {
    font-size: 4.2rem;
  }

  .welcome-script {
    transform: translate(-229px, 45px);
  }

  .title {
    font-size: 5.2rem;
  }

  .main-buttons {
    gap: 3rem;
    padding: 0 3rem;
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 0.3);
    right: calc(((var(--main-button-width) / 2) + 1.6rem) - (var(--sub-button-width) / 2));
  }
}

@media (max-width: 800px) and (max-height: 1080px) {
  .welcome-text {
    margin-block-start: 3.6875rem;
    margin-block-end: 2.3125rem;
  }

  .welcome-text span {
    font-size: 4.2rem;
  }

  .welcome-script {
    transform: translate(-229px, 45px);
  }

  .title {
    font-size: 5.2rem;
  }

  .main-buttons {
    gap: 3rem;
    padding: 0 3rem;
  }

  .bottom-right {
    bottom: calc(var(--sub-button-height) * 0.3);
    right: calc(((var(--main-button-width) / 2) + 1.6rem) - (var(--sub-button-width) / 2));
  }
} */

</style>