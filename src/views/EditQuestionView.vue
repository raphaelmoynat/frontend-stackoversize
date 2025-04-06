<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const title = ref('')
const description = ref('')
const tags = ref([])
const tagInput = ref('')
const message = ref('')


async function getQuestionDetails() {
  const token = localStorage.getItem("token")
  if (!token) {
    return
  }


  try {
    const response = await axios.get(`https://stackoversize.raphaelmoynat.com/question/${route.params.id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const question = response.data
    title.value = question.title
    description.value = question.description
    tags.value = question.tags || []
  } catch (error) {
    message.value = "Erreur lors du chargement de la question."
  }
}

function addTag(){
  if (tagInput.value.trim()) {
    tags.value.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

function removeTag (index){
  tags.value.splice(index, 1);
}

async function updateQuestion() {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  try {
    await axios.put(`https://stackoversize.raphaelmoynat.com/question/edit/${route.params.id}`, {
      title: title.value,
      description: description.value,
      tags: tags.value
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.value = "Question mise à jour avec succès"
    setTimeout(() => {
      router.push(`/question/${route.params.id}`);
    }, 1500);
  } catch (error) {
    message.value = "Erreur lors de la mise à jour."
  }
}

onMounted(getQuestionDetails);
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Modifier la question</h1>
    <form @submit.prevent="updateQuestion" class="card p-4 shadow-sm">
      <div class="mb-3">
        <label for="title" class="form-label">Titre</label>
        <input v-model="title" type="text" class="form-control" placeholder="Titre" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea v-model="description" class="form-control" rows="4" placeholder="Description" required></textarea>
      </div>
      <div class="mb-3">
        <label for="tags" class="form-label">Tags</label>
        <div class="input-group">
          <input v-model="tagInput" type="text" class="form-control" placeholder="Tag" />
          <button type="button" class="btn btn-secondary" @click="addTag">Ajouter</button>
        </div>
        <div class="mt-2 d-flex flex-wrap gap-2">
          <span v-for="(tag, index) in tags" :key="index" class="badge bg-primary d-flex align-items-center">
            {{ tag }}
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close" @click="removeTag(index)"></button>
          </span>
        </div>
      </div>
      <button type="submit" class="btn btn-primary w-100">
        Mettre à jour la question
      </button>
    </form>
    <p v-if="message" class="mt-3 text-center" :class="message.includes('succès') ? 'text-success' : 'text-danger'">{{ message }}</p>
  </div>
</template>
