<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()

const route = useRoute()

const currentUser = localStorage.getItem('user')


const question = ref([])
const message = ref("")

async function getQuestions() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get(`http://localhost:8000/question/${route.params.id}/`, {
        headers : { Authorization: `Bearer ${token}` },
      });
      question.value = response.data
      console.log(response.data.author)
      console.log(currentUser)
    } catch (error) {
      message.value = error
    }

  }else{
    message.value="Vous devez être connectés pour voir la question"

  }

}


async function deleteQuestion() {
  const token = localStorage.getItem("token")
  if (token) {
    try {
      await axios.delete(`http://127.0.0.1:8000/question/delete/${route.params.id}`, {
        headers : { Authorization: `Bearer ${token}` },
      });
      router.push('/questions');
    } catch (error) {
      message.value = error
    }
  }
}



onMounted(getQuestions);
</script>



<template>
<div v-if="message">{{ message }}</div>


  <div v-if="question.id" class="mb-4">
    <div class="card border-primary shadow-sm p-3">
      <div class="card-body">
        <h2 class="card-title mb-2 text-primary">{{ question.title }}</h2>

        <p class="text-muted small">
          Posée par <strong>{{ question.author }}</strong> le {{ question.createdAt }}
        </p>

        <p class="card-text">{{ question.description }}</p>

        <div>
            <span
              v-for="tag in question.tags"
              :key="tag"
              class=""
            >
              #{{ tag }}
            </span>
        </div>

        <hr />

        <div>
          <h5 class="mt-3">Réponses :</h5>
          <div v-if="question.replies && question.replies.length">
            <div
              v-for="reply in question.replies"
              :key="reply.id"
              class="p-2 border rounded mb-2"
              :class="{ 'border-success': reply.is_best }"
            >
              <p class="mb-1">{{ reply.content }}</p>
              <p class="text-muted small">
                Répondu par <strong>{{ reply.author }}</strong> -
                Votes utiles : {{ reply.useful_votes_count }}
              </p>
              <span v-if="reply.is_best" class="badge bg-success">Meilleure réponse</span>
            </div>
          </div>
          <p v-else class="text-muted">Aucune réponse pour le moment.</p>
        </div>
      </div>

      <div class="card-footer bg-white d-flex justify-content-between">
        <router-link to="/questions">
          <a class="btn btn-primary">
            Retour
          </a>

        </router-link>

        <div v-if="currentUser == question.author">
          <router-link :to="`/edit-question/${question.id}`" class="btn btn-primary btn-sm">
            Modifier
          </router-link>
          <button @click="deleteQuestion" class="btn btn-danger">
            Supprimer
          </button>
        </div>




      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
