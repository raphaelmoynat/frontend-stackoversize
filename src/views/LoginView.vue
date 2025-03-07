<script setup>
import { ref } from 'vue';
import axios from 'axios';


const username = ref('');
const password = ref('');
const message = ref('');

async function login() {
  try {
    const response = await axios.post('http://localhost:8000/login', {
      username: username.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('user', username.value);
    message.value = "Connexion réussie";
  } catch (error) {
    message.value = "Identifiants incorrects";
  }
};

</script>



<template>
  <div class="container mt-5">
    <h1 class="text-center">Connexion</h1>
    <form @submit.prevent="login" class="card p-4 shadow-sm">
      <div class="mb-3">
        <label for="username" class="form-label">Nom d'utilisateur</label>
        <input v-model="username" type="text" id="username" class="form-control" placeholder="Username" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input v-model="password" type="password" id="password" class="form-control" placeholder="Mot de passe" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">
        Se connecter
      </button>
    </form>
    <p v-if="message" class="mt-3 text-center text-danger">{{ message }}</p>
  </div>
</template>



