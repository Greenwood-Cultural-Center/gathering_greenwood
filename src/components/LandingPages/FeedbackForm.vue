<script setup>
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import utils from '@utils/utils.js'

const emit = defineEmits(['close']);
const toast = useToast();

// Form data
const firstName = ref('');
const lastName = ref('');
const cellNumber = ref('');
const isSubmitting = ref(false);

// Form methods
function clearForm() {
  firstName.value = '';
  lastName.value = '';
  cellNumber.value = '';
}

async function submitForm() {
  // Validate form
  if (!firstName.value || !lastName.value || !cellNumber.value) {
    toast.warning('Please fill in all fields');
    return;
  }

  if (isSubmitting.value) return; // Prevent double submission

  isSubmitting.value = true;
  toast.info('Submitting feedback...');

  try {
    // Create form data
    const params = new URLSearchParams();
    params.append('firstName', firstName.value);
    params.append('lastName', lastName.value);
    params.append('cellNumber', utils.convertToE164(cellNumber.value, 1));
    params.append('timestamp', new Date().toISOString());


    // Submit to Google Apps Script
    const response = await fetch('https://script.google.com/macros/s/AKfycbyjhWgzg9czqtMvqQTf-t2NT4UQ3VHVsczwdHW6VPU7PKLoMADFtdoDdNIH1ezkPeGX/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      mode: 'no-cors'
    });

    // Since mode is 'no-cors', we can't read the response
    // but if we get here without error, assume success
    toast.success('Thank you for your feedback! We will reach out via text message.');
    clearForm();

    // Close the form after a short delay
    setTimeout(() => {
      handleReturn();
    }, 2000);

  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Sorry, there was an error submitting your feedback. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
}

function handleReturn() {
  emit('close');
}
</script>

<template>
  <div class="feedback-overlay">
    <div class="feedback-container">
      <!-- Background with script text -->
      <div class="background-texture"></div>

      <div class="content">
        <!-- Header -->
        <div class="header">
          <img src="/Helping through YOUR FEEDBACK.png" alt="Helping through your feedback" class="script-text" />
        </div>

        <!-- Description -->
        <div class="description">
          <p>Your feedback can help us further improve this resource for the community.
          Please provide your name and number below, and we'll<br>reach out via text message!</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="feedback-form">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              required
              class="form-input"
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              required
              class="form-input"
              :disabled="isSubmitting"
            />
          </div>

          <div class="form-group">
            <label for="cellNumber">Cell Number </label>
            <input
              id="cellNumber"
              v-model="cellNumber"
              type="tel"
              required
              class="form-input phone-input"
              placeholder="(555) 123-4567"
              :disabled="isSubmitting"
            />
          </div>

          <!-- Privacy Notice -->
          <div class="privacy-notice">
            <p><em>We value your privacy and promise to keep your information secure.<br/>
            By providing your phone number, you agree to receive SMS messages from Greenwood Cultural Center regarding your feedback.
            Message and data rates may apply</em></p>
          </div>

          <!-- Buttons -->
          <div class="button-container">
            <div class="action-button-container">
              <button type="button" @click="clearForm" class="action-button clear-button" :disabled="isSubmitting">
                Clear
              </button>
              <button type="submit" class="action-button submit-button" :disabled="isSubmitting">
                Submit
              </button>
            </div>
            <div class="return-button-container">
              <button type="button" @click="handleReturn" class="action-button return-button" :disabled="isSubmitting">
                Return
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feedback-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #E8DCC6; /* Beige/tan background */
  color: #333;
  overflow: hidden;
  display: flex;
  justify-content: left;
  align-items: center;
}

.background-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/info-bkg.webp');
  background-size: cover;
  background-position: center;
  opacity: 1;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1800px;
  width: 42.91rem;
  padding: 1rem 18.25rem 18.25rem 18.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header {
  margin-bottom: 2rem;
}

.script-text {
  width: 64.125rem;
  height: 15.625rem;
  position: fixed;
  left: 10.8125rem;
  top: 5rem;
}

.main-title {
  font-size: 4rem;
  font-weight: bold;
  color: #000;
  margin: 0;
  line-height: 0.9;
  letter-spacing: 2px;
}

.description {
  margin-bottom: 2rem;
  margin-left: 8rem;
  width: 63.75rem;
}

.description p {
  font-size: 1.2rem;
  color: #333;
  margin: 0.2rem 0;
  line-height: 1.4;
}

.feedback-form {
  width: 50rem;
  max-width: 1800px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.form-group label {
  font-size: 1.7rem;
  font-weight: bold;
  color: #333;
  min-width: 120px;
  text-align: right;
}

.form-input {
  flex: 1;
  padding: 0.75rem 1rem;
  width: 35rem;
  height: 1.9rem;
  font-size: 1.1rem;
  border: 3px solid #1B3B22;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #333;
}

.phone-input {
  max-width: 200px;
}

.form-input:focus {
  outline: none;
  background-color: white;
  border-color: #405D47;
}

.privacy-notice {
  margin: 2rem 0;
  width: 87.5rem;
  text-align: left;
}

.privacy-notice p {
  font-size: 1rem;
  color: #555;
  font-weight: 800;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.button-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
  width: 104.375rem;
}

.action-button-container {
  display: flex;
  gap: 10rem;
  justify-content: center;
  align-content: space-evenly;
  margin-top: 2rem;
  width: 104.375rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 3rem 4rem;
  font-size: 3rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  min-width: 19rem;
}

button.action-button.clear-button:disabled,
button.action-button.return-button:disabled,
button.action-button.submit-button:disabled {
  background-color: #1b3b224d;
  color: #1010104d;
  border-color: #7676764d;
  transition: none;
  cursor: not-allowed;
}

button.action-button.clear-button:disabled:hover,
button.action-button.return-button:disabled:hover,
button.action-button.submit-button:disabled:hover {
  transform: none;
}

input.form-input:disabled {
  background-color: #c6c6c6;
  border-color: #1b3b224d;
  cursor: not-allowed;
}

.return-button {
  padding: 2rem 3.5rem;
  font-size: 2.5rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  min-width: 20rem;
  margin-top: 3rem;
}

.clear-button,
.submit-button {
  background-color: #1B3B22;
  color: white;
}

.return-button {
  background-color: #1B3B22;
  color: white;
}

.action-button:hover {
  transform: scale(1.05);
  background-color: #0f2817;
}

  @media (max-width: 2500px) and (max-height: 1400px) {
    .script-text {
      top: 1rem;
    }
    .content {
      padding: 18.25rem;
    }
  }

  @media screen and (max-width: 1930px) and (max-height: 1090px) {
    .script-text {
        left: 11rem;
    }

    form > div:nth-child(1) {
        gap: 2.1rem;
    }

    form > div:nth-child(2) {
        gap: 2.4rem;
    }

    form > div:nth-child(3){
        gap: 1rem;
    }

    .header {
        margin-bottom: 13rem;
    }

    .description p {
        text-align: left;
        font-size: 1.775rem;
        width: 63.125rem;
    }

    .privacy-notice p {
        font-size: 1.4rem;
    }

    .action-button-container {
        gap: 2rem;
    }

    .action-button-container .action-button {
        width: 24.3125rem;
    }

    .return-button {
        width: 19.6875rem;
        min-width: 15rem;
        height: 8.5625rem;
        font-size: 3.5rem;
        margin-top: 3rem;
    }
  }
/* 
  @media (max-width: 1600px) and (max-height:900px) {
    .script-text {
      left: 4rem;
      width: 48.0938rem;
      height: 11.7188rem;
    }

    .content {
      padding: 32rem 18.25rem 18.25rem 10rem;
    }

    .description {
      width: 63.75rem;
    }

    .description p {
      font-size: 1.6rem;
      font-weight: 600;
      margin: 0 0;
      line-height: 1.2;
    }

    .action-button-container {
      gap: 2rem;
      width: 40rem;
    }

    .action-button {
      padding: 2rem 2.5rem;
      font-size: 2rem;
      min-width: 10rem;
      margin-bottom: 5rem;
    }

    .return-button {
      padding: 1rem 2rem;
      font-size: 1.5rem;
      min-width: 5rem;
      margin-top: 5rem;
    }
  }

  @media (max-width: 1600px) and (max-height:700px) {
    .script-text {
      left: 5rem;
      width: 40rem;
      height: 9rem;
    }

    .content {
      padding: 38rem 18.25rem 18.25rem 10rem;
    }

    .description {
      width: 63.75rem;
      margin-bottom: 0.5rem;
    }

    .description p {
      font-size: 1.4rem;
      font-weight: 600;
    }

    .action-button-container {
      gap: 2rem;
      width: 40rem;
      padding-bottom: 4rem;
    }

    .action-button {
      padding: 2rem 2.5rem 1.5rem 2.5rem;
      font-size: 2.5rem;
      min-width: 10rem;
      margin-bottom: 10rem;
    }

    .return-button {
      padding: 1.5rem 2rem;
      font-size: 1.5rem;
      min-width: 5rem;
      margin-top: 3rem;
    }

    .privacy-notice {
      margin: 0;
    }

    .privacy-notice p {
      margin: 0;
    }

    .button-container {
      margin-top: 0;
    }

    .form-group {
      margin-bottom: 1rem;
    }
  }
  @media (max-width: 1400px) and (max-height: 1300px) {
    .script-text {
      left: 3rem;
    }
    .description p {
      font-size: 1.6rem;
      font-weight: 600;
    }

    .content {
      padding: 20rem 18.25rem 18.25rem 10rem;
    }

    .button-container {
      margin-top: 0.5rem;
      width: 70rem;
    }

    .action-button-container {
      gap: 1.5rem;
      padding-bottom: 0;
    }

    .return-button {
      padding: 1.5rem 2rem 1.5rem 2rem;
      font-size: 2rem;
      min-width: 5rem;
      margin-top: 3.5rem;
    }
  }

  @media (max-width: 1400px) and (max-height: 1100px) {
    .content {
      padding: 25rem 18.25rem 18.25rem 10rem;
    }

  } */
</style>