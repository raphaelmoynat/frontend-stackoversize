<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()
const currentUser = localStorage.getItem('user')

const question = ref([])
const message = ref("")
const replyContent = ref("")
const replyMessage = ref("")
const editingReplyId = ref(null)
const votingInProgress = ref(false)

async function getQuestions() {
  const token = localStorage.getItem("token")
  if (token) {
    try {
      const response = await axios.get(`https://stackoversize.raphaelmoynat.com/question/${route.params.id}/`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      question.value = response.data
      console.log(response.data.author)
      console.log(currentUser)
    } catch (error) {
      message.value = error
    }
  } else {
    message.value = "Vous devez être connectés pour voir la question"
  }
}

async function deleteQuestion() {
  const token = localStorage.getItem("token")
  if (token) {
    try {
      await axios.delete(`https://stackoversize.raphaelmoynat.com/question/delete/${route.params.id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      router.push('/questions')
    } catch (error) {
      message.value = error
    }
  }
}

async function postReply() {
  const token = localStorage.getItem("token")
  if (!token) {
    replyMessage.value = "Vous devez être connecté pour répondre"
    return
  }

  if (!replyContent.value.trim()) {
    replyMessage.value = "Veuillez entrer une réponse"
    return;
  }

  if (editingReplyId.value !== null) {
    await editReply(editingReplyId.value)
    return;
  }

  try {
    await axios.post(`https://stackoversize.raphaelmoynat.com/reply/create/${route.params.id}`,
      {content: replyContent.value},
      {headers: {Authorization: `Bearer ${token}`}}
    );

    replyContent.value = ""
    replyMessage.value = "Réponse ajoutée"
    await getQuestions()

    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)

  } catch (error) {
    replyMessage.value = error
    console.error(error)
  }
}

async function deleteReply(replyId) {
  const token = localStorage.getItem("token");
  if (!token) {
    replyMessage.value = "Vous devez être connecté pour supprimer une réponse"
    return
  }

  try {
    await axios.delete(`https://stackoversize.raphaelmoynat.com/reply/delete/${replyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    replyMessage.value = "Réponse supprimée avec succès"
    await getQuestions()

    setTimeout(() => {
      replyMessage.value = ""
    }, 2000);

  } catch (error) {
    replyMessage.value = error
    console.error(error)
  }
}

function startEditReply(reply) {
  editingReplyId.value = reply.id
  replyContent.value = reply.content
  setTimeout(() => {
    document.querySelector('.add-reply-form').scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function cancelEdit() {
  editingReplyId.value = null
  replyContent.value = ""
}

async function editReply(replyId) {
  const token = localStorage.getItem("token")
  if (!token) return

  try {
    await axios.put(`https://stackoversize.raphaelmoynat.com/reply/edit/${replyId}`,
      {content: replyContent.value},
      {headers: {Authorization: `Bearer ${token}`}}
    );

    editingReplyId.value = null
    replyContent.value = ""
    await getQuestions()
    replyMessage.value = "Réponse modifiée "

    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)

  } catch (error) {
    replyMessage.value = error
  }
}

async function voteReply(replyId, isUseful) {
  const token = localStorage.getItem("token")
  if (!token) {
    replyMessage.value = "Vous devez être connecté pour voter"
    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)
    return
  }

  try {
    await axios.post(`https://stackoversize.raphaelmoynat.com/reply/vote/${replyId}`,
      { is_useful: isUseful },
      { headers: { Authorization: `Bearer ${token}` }}
    );

    await getQuestions();
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    replyMessage.value = "Erreur lors du vote"
    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)
  } finally {
    votingInProgress.value = false;
  }
}

async function markAsBest(replyId) {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (currentUser !== question.value.author) {
    replyMessage.value = "Vous n'êtes pas l'auteur"
    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)
    return;
  }

  try {
    await axios.post(`https://stackoversize.raphaelmoynat.com/reply/best/${replyId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` }}
    );

    await getQuestions();
    replyMessage.value = "Réponse marquée comme la meilleure"
    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)
  } catch (error) {
    console.error("Erreur:", error);
    replyMessage.value = "Erreur lors du marquage de la meilleure réponse"
    setTimeout(() => {
      replyMessage.value = ""
    }, 2000)
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
            class="badge bg-secondary p-2 fs-6"
          >
            #{{ tag }}
          </span>
        </div>

        <div>
          <h5 class="mt-3">Réponses :</h5>
          <div v-if="question.replies && question.replies.length">
            <div
              v-for="reply in question.replies"
              :key="reply.id"
              class="p-3 border rounded mb-3"
              :class="{ 'border-success': reply.is_best }"
            >
              <div class="d-flex mb-2">
                <div class="me-3 d-flex flex-column align-items-center">
                  <button
                    @click="voteReply(reply.id, true)"
                    class="btn btn-sm btn-outline-primary mb-1"
                    :disabled="votingInProgress"
                  >
                    <i class="bi bi-arrow-up"></i>
                  </button>
                  <div class="text-center fw-bold">{{ reply.useful_votes_count }}</div>
                  <button
                    @click="voteReply(reply.id, false)"
                    class="btn btn-sm btn-outline-danger mt-1"
                    :disabled="votingInProgress"
                  >
                    <i class="bi bi-arrow-down"></i>
                  </button>
                </div>
                <div class="flex-grow-1">
                  <p class="mb-1">{{ reply.content }}</p>
                  <p class="text-muted small mb-0">
                    Répondu par <strong>{{ reply.author }}</strong> le {{ new Date(reply.created_at).toLocaleString() }}
                  </p>
                </div>
              </div>

              <div class="d-flex align-items-center">
                <span v-if="reply.is_best" class="badge bg-success me-2">Meilleure réponse</span>

                <button
                  v-if="currentUser === question.author && !reply.is_best"
                  @click="markAsBest(reply.id)"
                  class="btn btn-outline-success me-2"
                  title="Définir comme meilleure réponse"
                >
                  Meilleure réponse
                </button>

                <div v-if="currentUser === reply.author" class="ms-auto">
                  <button @click="startEditReply(reply)" class="btn btn-primary btn-sm me-1">
                    Modifier
                  </button>
                  <button @click="deleteReply(reply.id)" class="btn btn-danger btn-sm">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-muted">Aucune réponse pour le moment</p>
        </div>


      </div>

      <div class="card-footer bg-white d-flex justify-content-between">
        <router-link to="/questions">
          <a class="btn btn-primary">
            Retour
          </a>
        </router-link>

        <div v-if="currentUser == question.author">
          <router-link :to="`/edit-question/${question.id}`" class="btn btn-primary me-3">
            Modifier
          </router-link>
          <button @click="deleteQuestion" class="btn btn-danger">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 p-3 card border-secondary rounded mb-5 add-reply-form">
    <h5>{{ editingReplyId ? 'Modifier votre réponse' : 'Ajouter une réponse' }}</h5>
    <div v-if="replyMessage" class="alert alert-success">
      {{ replyMessage }}
    </div>
    <div class="form-group">
      <textarea
        v-model="replyContent"
        class="form-control"
        rows="4"
        placeholder="Écrivez votre réponse..."
      >

      </textarea>
    </div>
    <div class="mt-2">
      <button
        v-if="!editingReplyId"
        @click="postReply"
        class="btn btn-primary"
        :disabled="!replyContent.trim()"
      >
        Envoyer
      </button>
      <template v-else>
        <button
          @click="postReply"
          class="btn btn-success me-2"
          :disabled="!replyContent.trim()"
        >
          Éditer
        </button>
        <button
          @click="cancelEdit"
          class="btn btn-secondary"
        >
          Annuler
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.badge {
  margin-right: 5px;
}
</style>
