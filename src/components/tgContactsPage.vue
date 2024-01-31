<template>
    <div v-if="userSearch">
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
          <div v-for="user in users" @click="allChatsData[user.id]={other:user,messages:[]};$router.push({name:'chat', params:{otherId:user.id},query:{initMessageId:'',showUser:true}})" :key="user.id">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/users/${user.id}/${user.avatar}`"
              :title="user.name"
              :subtitle="user.username"
            >
            <template v-slot:append>
            <v-btn v-if="contactIds.includes(user.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteContact(getContactFromId(user.id).id)"
            ></v-btn>
            <v-btn v-else
              color="primary"
              icon="mdi-plus"
              variant="text"
              @click.stop="addContact(user.id)"
            ></v-btn>
          </template>
          </v-list-item>
            <v-divider></v-divider>
          </div></div>
    <div v-else>
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">contacts</h3>
            <div v-for="contact in allChatsData.contacts" @click="$router.push({name:'chat', params:{otherId:contact.following},query:{initMessageId:'',showUser:true}})" :key="contact.following">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/users/${contact.following}/${contact.expand.following.avatar}`"
              :title="contact.expand.following.name"
              :subtitle="contact.expand.following.username"
            >
            <template v-slot:append>
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteContact(contact.id)"
            ></v-btn>
          </template>
          </v-list-item>
            <v-divider></v-divider>
          </div>
    </div>
  
  
  
  
  
  </template>
  
  <style scoped>
  .listItem:hover{
      color: var(--tgPrimary);
      background-color:var(--tgPrimaryHover);
  }
  </style>
  
  <script setup>
  import { ref, inject, computed, watchEffect } from 'vue';
  import pb from '@/main';
  import { storeToRefs } from "pinia";
  
  import { useDataStore } from "@/store/dataStore";
  const{updateContacts}=useDataStore()
  const{allChatsData}=storeToRefs(useDataStore())
  
  updateContacts()
  
  const userSearch=inject('userSearch')
  const users=ref()
  
  
  
  
  async function addContact(contact){
    await pb.collection('contacts').create({follower:pb.authStore.model.id, following:contact})
  }
  async function deleteContact(contact){
    await pb.collection('contacts').delete(contact);
  }
  // async function getContacts(){
  //   return await pb.collection('contacts').getFullList({expand:'following'});
  // }
  // const contacts=ref(await getContacts())
  pb.collection('contacts').subscribe('*', updateContacts)
  
  
  function getContactFromId(id){
    return allChatsData.value.contacts.find(contact=>contact.following==id)
  }
  
  
  const contactIds=computed(()=>allChatsData.value.contacts.map(contact=>contact.following))
  
  watchEffect(async ()=>{
    if(userSearch.value){
      users.value=await pb.collection('users').getFullList({filter:`name ~ "${userSearch.value}" || username ~ "${userSearch.value}" || email ~ "${userSearch.value}"`})
    }
  })
  
  console.log(allChatsData.value.contacts)
  console.log(contactIds.value)
  </script>