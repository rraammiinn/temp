<template>

    <!-- <v-text-field v-model="pass"></v-text-field>
    <v-btn @click="signIn">sign in</v-btn>
    <v-btn @click="getU"> get u</v-btn>
    <v-btn @click="getM">get m</v-btn> -->


    <v-list v-if="chatSearch" :items="Object.keys(searchChats)"  item-props  lines="three">

<div v-for="searchChat in searchChats" @click="previousPage='main';currentPage='chat';other=searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from'];initChatId=searchChat.id">
    <v-list-item class="listItem"
    :prepend-avatar="`/api/files/users/${searchChat[searchChat.from==pb.authStore.model.id ? 'to' : 'from']}/${searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from'].avatar}`"
    :title="searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from'].name"
    :subtitle="searchChat.text"
  ></v-list-item>
  <v-divider></v-divider>
</div>
</v-list>





      <v-list v-else :items="Object.keys(lastChats)"  item-props  lines="three">

        <div v-for="lastChat in lastChats" @click="previousPage='main';currentPage='chat';other=lastChat.user;initChatId=''">
            <v-list-item v-if="lastChat.lastChat" class="listItem"
            :prepend-avatar="`/api/files/users/${lastChat.user.id}/${lastChat.user.avatar}`"
            :title="lastChat.user.name"
            :subtitle="lastChat.lastChat.text"
          ></v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list>

  </template>

<style scoped>
.listItem:hover{
    color: var(--tgPrimary);
    background-color:var(--tgPrimaryHover);
}
.v-list-item-subtitle{
  display: block !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
.v-list-item-title{
  display: block !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

  <script setup>
  import { ref, inject, watchEffect } from 'vue';
  const currentPage=inject('currentPage')
  const other=inject('other')
  const lastChats=inject('lastChats')
  const users=inject('users')
  const chatSearch=inject('chatSearch')
  const searchChats=ref([])
  const initChatId=inject('initChatId')
  const previousPage=inject('previousPage')




  //tst...................................................
  import pb from '@/main';

  pb.collection('messages').subscribe('*', function (e) {
    console.log(e.record);
    console.log('.................')
    console.log(e)
});

  const pass=ref()
  async function signIn(){
    const authData = await pb.collection('users').authWithPassword(
    pass.value,
    'xxxxxxxxx'
);
  }

  async function getU(){
    const u = await pb.collection('users').getFullList({
    sort: '-created',
});
console.log(u)
  }

  async function getM(){
    const m = await pb.collection('messages').getFullList({
    sort: '-created',
});
console.log(m)
  }


  function getUserFromId(id){
    return users.value.find(u=>u.id==id)
}

watchEffect(async ()=>{
  if(chatSearch.value){
    searchChats.value=await pb.collection('messages').getFullList({filter:`text ~ "${chatSearch.value}"`,expand:'from,to'})
  }
})
  </script>