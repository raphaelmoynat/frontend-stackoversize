<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const currentUser = localStorage.getItem('user')
const userProfile = ref({
  display_name: '',
  bio: '',
  user_class: ''
});
const allProfiles = ref([])
const message = ref('')
const successMessage = ref('')
const editMode = ref(false)

async function getUserProfile() {
  const token = localStorage.getItem('token')
  if (!token) {
    message.value = "Vous devez être connecté";
    return
  }

  try {
    const response = await axios.get('https://stackoversize.raphaelmoynat.com/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    userProfile.value = response.data
  } catch (error) {
    console.error(error)
    message.value = error
  }
}

async function getAllProfiles() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await axios.get('https://stackoversize.raphaelmoynat.com/profile/list', {
      headers: { Authorization: `Bearer ${token}` }
    })
    allProfiles.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function updateProfile() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    await axios.put('https://stackoversize.raphaelmoynat.com/profile', {
      display_name: userProfile.value.display_name,
      bio: userProfile.value.bio,
      user_class: userProfile.value.user_class
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    successMessage.value = "Profil mis à jour"
    editMode.value = false

    await getUserProfile();
    await getAllProfiles();

    setTimeout(() => {
      successMessage.value = ""
    }, 2000)
  } catch (error) {
    message.value = error

    setTimeout(() => {
      message.value = "";
    }, 2000);
  }
}

function switchMode() {
  editMode.value = true
}

function cancelEdit() {
  getUserProfile()
  editMode.value = false
}



onMounted(() => {
  getUserProfile()
  getAllProfiles()
})
</script>

<template>
  <div class="container my-4">
    <div v-if="message" class="alert alert-danger">{{ message }}</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

    <div class="card mb-4">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2>Mon Profil</h2>
        <div v-if="!editMode">
          <button @click="switchMode" class="btn btn-light">Modifier</button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="!editMode">
          <div class="mb-3">
            <h5>Display name</h5>
            <p>{{ userProfile.display_name || 'Non défini' }}</p>
          </div>

          <div class="mb-3">
            <h5>Biographie</h5>
            <p>{{ userProfile.bio || 'Non défini' }}</p>
          </div>

          <div class="mb-3">
            <h5>Classe</h5>
            <p>{{ userProfile.user_class || 'Non défini' }}</p>
          </div>

          <div>
            <h5>Statistiques</h5>
            <p>Questions: {{ userProfile.questions_count || 0 }}</p>
            <p>Réponses: {{ userProfile.replies_count || 0 }}</p>
          </div>
        </div>

        <div v-else>
          <div class="mb-3">
            <label for="display_name" class="form-label">Display name</label>
            <input
              type="text"
              class="form-control"
              id="display_name"
              v-model="userProfile.display_name"
            >
          </div>

          <div class="mb-3">
            <label for="bio" class="form-label">Biographie</label>
            <textarea
              class="form-control"
              id="bio"
              rows="3"
              v-model="userProfile.bio"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="user_class" class="form-label">Classe</label>
            <input
              type="text"
              class="form-control"
              id="user_class"
              v-model="userProfile.user_class"
            >
          </div>

          <div class="d-flex justify-content-end">
            <button @click="cancelEdit" class="btn btn-secondary me-2">Annuler</button>
            <button @click="updateProfile" class="btn btn-success">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">Tous les utilisateurs</h2>
      </div>

      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Bio</th>
              <th>Classe</th>
              <th>Questions</th>
              <th>Réponses</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="profile in allProfiles" :key="profile.user">
              <td class="fw-bold">{{ profile.display_name }}</td>
              <td>{{ profile.bio || 'Non défini' }}</td>
              <td>{{ profile.user_class || 'Non défini' }}</td>
              <td>{{ profile.questions_count }}</td>
              <td>{{ profile.replies_count }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="userProfile.questions && userProfile.questions.length > 0" class="card mt-4 ">
      <div class="card-header bg-primary text-white">
        <h3 class="mb-0">Mes questions</h3>
      </div>

      <div class="card-body">
        <div v-for="question in userProfile.questions" :key="question.id" class="mb-3 border-bottom pb-3">
          <router-link :to="`/question/${question.id}`" class="fs-5 text-decoration-none">
            {{ question.title }}
          </router-link>
          <p class="text-muted mb-1">{{ question.description }}</p>
          <div>
            <span v-for="tag in question.tags" :key="tag" class="badge bg-secondary me-1">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>



</style>
