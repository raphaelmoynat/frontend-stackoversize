<script setup>
import { ref } from 'vue';
import axios from 'axios';

const title = ref('')
const description = ref('')
const tags = ref([])
const tagInput = ref('')
const message = ref('')

function addTag (){
    tags.value.push(tagInput.value.trim())
    tagInput.value = ''
};

function removeTag(){
  tags.value.splice(index, 1)
};

async function createQuestion(){
  const token = localStorage.getItem("token");
  if (token){
    try {
      const response = await axios.post('http://127.0.0.1:8000/question/create', {
        title: title.value,
        description: description.value,
        tags: tags.value
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      message.value = "Question créée avec succès"
      title.value = ''
      description.value = ''
      tags.value = []
    } catch (error) {
      message.value = error;
    }

  }

}
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Créer une question</h1>
    <form @submit.prevent="createQuestion" class="card p-4 shadow-sm">
      <div class="mb-3">
        <label for="title" class="form-label">Titre</label>
        <input v-model="title" type="text" class="form-control" placeholder="Titre" required />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea v-model="description"  class="form-control" rows="4" placeholder="Description" required></textarea>
      </div>
      <div class="mb-3">
        <label for="tags" class="form-label">Tags</label>
        <div class="input-group">
          <input v-model="tagInput" type="text"  class="form-control" placeholder="Tag" />
          <button type="button" class="btn btn-secondary" @click="addTag">Ajouter</button>
        </div>
        <div class="mt-2 d-flex flex-wrap gap-2">
          <span v-for="(tag, index) in tags" :key="index" class="badge bg-primary d-flex align-items-center">
            {{ tag }}
            <button type="button" class="btn-close btn-close-white ms-2" aria-label="Close" @click="removeTag(index)" ></button>
          </span>
        </div>
      </div>
      <button type="submit" class="btn btn-primary w-100">
        Créer la question
      </button>
    </form>
    <p v-if="message" class="mt-3 text-center" :class="message.includes('succès') ? 'text-success' : 'text-danger'">{{ message }}</p>
  </div>
</template>

<style scoped>


</style>
