<script setup>

const currentUser = localStorage.getItem('user')

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');


  window.location.href = '/login';
}


</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="/">StackOversize</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul v-if="currentUser" class="navbar-nav ms-auto">
          <li class="nav-item">

            <router-link to="/questions">
              <a class="nav-link">Questions</a>
            </router-link>
          </li>
          <li class="nav-item">

            <router-link to="/create-question">
              <a class="nav-link">Add question</a>
            </router-link>
          </li>
          <li class="nav-item">

            <router-link to="/profile">
              <a class="nav-link">Profile</a>
            </router-link>
          </li>

          <li class="nav-item">
            <a @click="logout" class="nav-link" href="#" role="button">
              Logout
            </a>
          </li>

        </ul>

        <ul v-else class="navbar-nav ms-auto">
          <li>
            <router-link to="/login" class="nav-link" active-class="active">
              Login
            </router-link>

          </li>

          <li>
            <router-link to="/register" class="nav-link" active-class="active">
              Register
            </router-link>

          </li>


        </ul>
      </div>
    </div>
  </nav>


</template>

<style scoped>

</style>

