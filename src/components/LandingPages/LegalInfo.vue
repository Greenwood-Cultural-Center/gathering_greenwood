<script setup>

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
            <p class="map-credit">Map data courtesy of the OpenHistoricalMap project,<br/>in the public domain unless otherwise noted.</p>
            <!-- Return Button -->
            <button @click="handleReturn" class="return-button">
              Return
            </button>
          </div>
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
  padding: 1rem;
  display: flex;
  gap: 17rem;
  flex-direction: row;
}

.logos-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rem;
  flex-shrink: 0;
  text-align: initial;
  margin-left: 4rem;
}

.gcc-logo {
  height: 25rem;
  width: 25rem;
}

.main-title {
  font-size: 9rem;
  font-weight: 900;
  width: 43.75rem;
  color: #000;
  margin: 0 0 0 0;
  line-height: 0.9;
  letter-spacing: 2px;
  text-align: left;
  margin-left: 43px;
}

.legal-text {
  display: flex;
  flex-direction: column;
  font-weight: 700;
  flex: 1;
  line-height: 1.6;
  margin-bottom: 0;
  width: 51rem;
  align-self: center;
  width: 106rem;
}

.legal-text p {
  display: flex;
  flex-direction: column;
  font-size: 2.2rem;
  font-weight: 700;
  flex: 1;
  line-height: 1.6;
  width: 82rem;
}

p.map-credit {
  text-align: center;
  font-weight: 700;
  align-self: center;
  flex-grow: 0;
  width: 57rem;
  padding-right: 21.5rem;
}

.tulsa-logo-section {
  margin: 2rem 0;
}

.tulsa-logo {
  padding-left: 0;
  height: 11.625rem;
  width: 26.625rem;
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80rem;
  text-align: left;
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
  font-size: 4rem;
  font-weight: bold;
  width: 19.75rem;
  height: 8.625rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  margin: 4rem 0 0rem auto;
  padding: 2rem 2rem 2rem 2rem;
  background-color: #1B3B22;
}

.return-button:active {
  transform: scale(0.90);
  background-color: #0f2817;
}

@media (max-width: 2500px) and (max-height: 1400px) {
  .content {
    padding: 8rem;
    gap: 10rem;
  }

  .main-title {
    font-size: 9rem;
    font-weight: 900;
    width: 43.75rem;
    color: #000;
    margin: 2rem 0 0 0;
    line-height: 0.9;
    letter-spacing: 2px;
    text-align: left;
  }

  .legal-text {
    width: 94rem;
  }

  .legal-text p {
    display: flex;
    flex-direction: column;
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1.6;
    width: 82rem;
  }

  .logos-section {
    gap: 8rem;
  }

  p.map-credit {
    text-align: center;
    font-weight: 700;
    align-self: center;
  }

  .return-button {
    width: 19.75rem;
    height: 8.625rem;
    margin: 6rem 0 0 auto;
    padding: 2rem 2rem;
  }
}

@media (max-width: 2500px) and (max-height: 1300px) {
  .content {
    padding: 8rem;
    gap: 10rem;
  }

  .main-title {
    font-size: 9rem;
    font-weight: 900;
    width: 43.75rem;
    color: #000;
    margin: 2rem 0 0 0;
    line-height: 0.9;
    letter-spacing: 2px;
    text-align: left;
  }

  .legal-text {
    width: 94rem;
  }

  .legal-text p {
    display: flex;
    flex-direction: column;
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1.6;
    width: 82rem;
  }

  .logos-section {
    gap: 8rem;
  }

  p.map-credit {
    text-align: center;
    font-weight: 700;
    align-self: center;
  }

  .return-button {
    width: 19.75rem;
    height: 8.625rem;
    margin: 0 0 0 auto;
    padding: 2rem 2rem;
  }
}

@media screen and (max-width: 1930px) and (max-height: 1090px) {
  .content {
      gap: 10rem;
      margin-top: 10rem;
  }

  .main-title {
      font-size: 8rem;
      font-weight: 700;
      width: 43.75rem;
      margin: 0rem 0 0;
  }

  .text-content {
      text-align: left;
  }

  .logos-section {
      margin-left: 10rem;
      gap: 6rem;
      padding-top: 6rem;
  }

  .legal-text p {
      display: flex;
      flex-direction: column;
      font-size: 1.9rem;
      font-weight: 500;
      flex-grow: 0;
      line-height: 1.1;
      width: 69rem;
      margin-top: 3rem;
  }

  .legal-text {
      width: 73rem;
  }

  p.map-credit {
      width: 47.7rem;
      padding-right: 5rem;
      padding-bottom: 0rem;
  }

  .return-button {
      width: 19.75rem;
      height: 8.625rem;
      margin: 4.5rem 4.5rem 0 auto;
      padding: 2rem;
  }
}
/* 
@media (max-width: 1600px) and (max-height:900px) {
  .content {
    padding: 3rem 3rem 3rem 0rem;
    gap: 8rem;
  }

  .main-title {
    margin: 2rem 0 2rem 0;
  }

  .return-button {
    margin: 1rem 14px 0 auto;
  }
  .logos-section {
    gap: 6rem;
  }
  .return-button {
    width: 15.5534rem;
    height: 6.6127rem;
    margin: 2rem 0 0 auto;
    padding: 1rem 1rem;
  }
}

@media (max-width: 1600px) and (max-height:700px) {
  .main-title {
    margin: 0 0 0 0;
  }

  .logos-section {
    gap: 4rem;
  }

  .legal-text {
    margin-bottom: 0;
  }

  .return-button {
    width: 15.5534rem;
    height: 6.6127rem;
    margin: 0 0 0 auto;
    padding: 1rem 1rem;
  }
}

@media (max-width: 1400px) and (max-height: 1300px) {
  .content {
    padding: 3rem 3rem 3rem 0rem;
  }

  .main-title {
    margin: 8rem 0 2rem 0;
  }

  .return-button {
    margin: 9rem 14px 0 auto;
  }
  .logos-section {
    gap: 6rem;
  }

}

@media (max-width: 1400px) and (max-height: 1100px) {
  .main-title {
    margin: 6rem 0 2rem 0;
  }

  .return-button {
    margin: 6rem 0 0 auto;
  }
} */
</style>