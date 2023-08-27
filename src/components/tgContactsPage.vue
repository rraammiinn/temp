<template>
  <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">contacts</h3>
          <div v-for="contact in contacts" @click="currentPage='chat';other=getUserFromId(contact.following)" :key="contact.following">
            <v-list-item class="listItem"
            :prepend-avatar="`/api/files/users/${contact.following}/${getUserFromId(contact.following).avatar}`"
            :title="getUserFromId(contact.following).name"
            :subtitle="getUserFromId(contact.following).username"
          >
          <template v-slot:append>
          <v-btn
            color="error"
            icon="mdi-delete"
            variant="text"
          ></v-btn>
        </template>
        </v-list-item>
          <v-divider></v-divider>
        </div>


        <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
        <div v-for="user in users" @click="currentPage='chat';other=user" :key="user.id">
            <v-list-item class="listItem"
            :prepend-avatar="`/api/files/users/${user.id}/${user.avatar}`"
            :title="user.name"
            :subtitle="user.username"
          >
          <template v-slot:append>
          <v-btn v-if="user.isSaved"
            color="error"
            icon="mdi-delete"
            variant="text"
          ></v-btn>
          <v-btn v-else
            color="primary"
            icon="mdi-plus"
            variant="text"
          ></v-btn>
        </template>
        </v-list-item>
          <v-divider></v-divider>
        </div>

</template>

<style scoped>
.listItem:hover{
    color: var(--tgPrimary);
    background-color:var(--tgPrimaryHover);
}
</style>

<script setup>
import { ref, inject, onMounted } from 'vue';
import pb from '@/main';



const currentPage=inject('currentPage')
const other=inject('other')
const users=inject('users')


const contacts=inject('contacts')

function getUserFromId(id){
    return users.value.find(u=>u.id==id)
}


</script>