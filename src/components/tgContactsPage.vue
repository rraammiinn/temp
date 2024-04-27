<template>
    <div v-if="userSearch">
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
          <div v-for="user in users" @click="$router.push({name:'chat', params:{otherId:user.id},query:{initMessageId:'',showUser:true}})" :key="user.id">
              <v-list-item class="listItem"
              :prepend-avatar="getUserAvatarUrl(user.id,user.avatar)"
              :title="user.name"
              :subtitle="user.username"
            >
            <template v-slot:append>
            <v-btn v-if="contacts.has(user.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteContact(contacts.get(user.id).contactId)"
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
            <div v-for="contact in contacts.values()" @click="$router.push({name:'chat', params:{otherId:contact.id},query:{initMessageId:'',showUser:true}})" :key="contact.id">
              <v-list-item class="listItem"
              :prepend-avatar="getUserAvatarUrl(contact.id,contact.avatar)"
              :title="contact.name"
              :subtitle="contact.username"
            >
            <template v-slot:append>
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteContact(contact.contactId)"
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
  import {pb} from '@/funcs/pb';
  import { storeToRefs } from "pinia";
  
  import { useDataStore } from "@/store/dataStore";
  import {addContact,deleteContact} from '@/funcs/contactFunc';
  import {useOtherStore} from '@/store/otherStore'

  import {getUserAvatarUrl} from '@/funcs/commonFuncs';




  const {showError, showProgressBar, hideProgressBar} = useOtherStore()

  // const{updateContacts}=useDataStore()
  const{contacts,users}=storeToRefs(useDataStore())
  
  // updateContacts()
  
  const userSearch=inject('userSearch')
 
  </script>