<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()
const currentUser = localStorage.getItem('user')

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand">StackOversize</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul v-if="currentUser" class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/questions" class="nav-link">Questions</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/create-question" class="nav-link">Add question</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link">Profile</router-link>
          </li>
          <li class="nav-item">
            <a @click="logout" class="nav-link" href="#">Logout</a>
          </li>
        </ul>

        <ul v-else class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
