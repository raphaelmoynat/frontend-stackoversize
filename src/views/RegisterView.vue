<script setup>
import { ref } from 'vue';
import axios from 'axios';


const username = ref('');
const email = ref('');
const password = ref('');
const message = ref('');

async function register(){
  try {
    const response = await axios.post('https://stackoversize.raphaelmoynat.com/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    message.value = response.data.message;
  } catch (error) {
    message.value = error
  }
}


</script>


<template>
  <div class="container mt-5">
    <h1 class="text-center">Inscription</h1>
    <form @submit.prevent="register" class="card p-4 shadow-sm">

      <div class="mb-3">
        <label for="username" class="form-label">Nom d'utilisateur</label>
        <input v-model="username" type="text" id="username" class="form-control" placeholder="Nom d'utilisateur" required />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="email" type="email" id="email" class="form-control" placeholder="Email" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input v-model="password" type="password" id="password" class="form-control" placeholder="Mot de passe" required />
      </div>

      <button type="submit" class="btn btn-primary ">
         S'inscrire
      </button>
    </form>

    <p v-if="message" class="mt-3 text-center text-success">{{ message }}</p>
  </div>
</template>



