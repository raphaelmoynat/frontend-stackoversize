<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const message = ref('');
const messageClass = ref('');

const confirmEmail = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');


  if (email) {
    try {
      const response = await axios.get(`http://localhost:8000/confirm-email?email=${email}`);
      message.value = response.data.message;
      messageClass.value = "text-success";
    } catch (error) {
      message.value = "Erreur lors de la confirmation de l'email";
      messageClass.value = "text-danger";
    }
  } else {
    message.value = "Aucune adresse email trouvée";
    messageClass.value = "text-danger";
  }
};

onMounted(confirmEmail);
</script>


<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4 text-center">
      <h1>Confirmation d'Email</h1>
      <p v-if="message" :class="messageClass">{{ message }}</p>
      <router-link to="/login" class="btn btn-success mt-3" v-if="message">
        Se connecter
      </router-link>
    </div>
  </div>
</template>

