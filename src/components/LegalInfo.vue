<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

function handleReturn() {
  emit('close');
}
</script>

<template>
  <div class="legal-info-overlay">
    <div class="legal-info-container">
      <!-- Background with script text -->
      <div class="background-texture"></div>
      <div class="content">

        <!-- Left side logos -->
        <div class="logos-section">
          <img src="/gcc-logo.png" alt="Greenwood Cultural Center" class="gcc-logo">
          <img src="/city_of_tulsa_logo.png" alt="City of Tulsa" class="tulsa-logo">
        </div>

        <!-- Main Title -->
        <div class="text-content">
          <h1 class="main-title">
            GATHERING GREENWOOD
          </h1>

          <!-- Legal Text -->
          <div class="legal-text">
            <p>This project was supported by Grant No.15BJA-22-GG-01763-EMME awarded by the Bureau of Justice Assistance. The Bureau of Justice Assistance is a component of the Department of Justice's Office of Justice Programs, which also includes the Bureau of Justice Statistics, the National Institute of Justice, the Office of Juvenile Justice and Delinquency Prevention, the Office for Victims of Crime, and the SMART Office. Points of view or opinions in this document are those of the author and do not necessarily represent the official position or policies of the U.S. Department of Justice.</p>
            <p class="map-credit">Map data courtesy of the OpenHistoricalMap project,<br>
            in the public domain unless otherwise noted.</p>
          </div>

        <!-- Return Button -->
          <button @click="handleReturn" class="return-button">
            Return
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-info-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.legal-info-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #E8DCC6; /* Beige/tan background */
  color: #333;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/info-bkg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  padding: 3rem;
  display: flex;
  gap: 4rem;
  flex-direction: row;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  flex-shrink: 0;
}

.gcc-logo {
  height: 25rem;
  width: 25rem;
}

.main-title {
  font-size: 4rem;
  font-weight: 900;
  width: 70vw;
  color: #000;
  margin: 2rem 0;
  line-height: 0.9;
  letter-spacing: 2px;
}

.legal-text {
  font-family: 'Figtree', sans-serif;
  font-weight: 700;
  flex: 1;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.legal-text p {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: justify;
}

.map-credit {
  text-align: center !important;
  font-weight: 700;
  font-family: 'Figtree', sans-serif;
}

.tulsa-logo-section {
  margin: 2rem 0;
}

.tulsa-logo {
  padding-left: 3rem;
  height: 8.44rem;
  width: 19.362rem;
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.return-button {
  background-color: #1B3B22;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 4rem;
  margin-left:auto;
  MARGIN-TOP:5rem;
  font-weight: bold;
  width: 20.3478rem;
  height: 7.8125rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 4rem;
}

.return-button:active {
  transform: scale(0.90);
  background-color: #0f2817;
}
</style>