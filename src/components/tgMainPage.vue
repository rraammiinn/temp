<template>

    <!-- <v-text-field v-model="pass"></v-text-field>
    <v-btn @click="signIn">sign in</v-btn>
    <v-btn @click="getU"> get u</v-btn>
    <v-btn @click="getM">get m</v-btn> -->


    <v-list v-if="chatSearch" :items="Object.keys(searchChats)"  item-props  lines="three">

<div v-for="searchChat in searchChats" @click="initChatId=searchChat.id;previousPage='main';currentPage='chat';other=searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from'];">
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
          <v-divider v-if="lastChat.lastChat"></v-divider>
        </div>
      </v-list>

      <div v-show="showActionButton" style="position: fixed;bottom: 1.5rem;right: 1.5rem;display: flex;flex-direction: column;align-items: flex-end;">
        <div v-show="showActionButtonItems">
          <div style="display: flex;justify-content: flex-end;gap: 1rem;align-items: center;padding: .5rem;padding-top: 0;"><v-chip color="primary">add channel</v-chip><v-btn color="primary" icon="mdi-podcast" rounded size="2.5rem" elevation="24"></v-btn></div>
          <div style="display: flex;justify-content: flex-end;gap: 1rem;align-items: center;padding: .5rem;padding-top: 0;"><v-chip color="primary">add group</v-chip><v-btn color="primary" icon="mdi-contacts" rounded size="2.5rem" elevation="24"></v-btn></div>
        </div>
        <v-btn @click="showActionButtonItems=!showActionButtonItems" :icon="showActionButtonItems ? 'mdi-close' : 'mdi-plus'" style="border-radius: 50%;margin-top: 1rem;" :color="showActionButtonItems ? 'error' : 'primary'" size="3.5rem" elevation="24"></v-btn>
      </div>

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
  import { ref, inject, watchEffect, onMounted } from 'vue';
  const currentPage=inject('currentPage')
  const other=inject('other')
  const lastChats=inject('lastChats')
  const users=inject('users')
  const chatSearch=inject('chatSearch')
  const searchChats=ref([])
  const initChatId=inject('initChatId')
  const previousPage=inject('previousPage')




  var startScrollTop=0
  onMounted(()=>{document.querySelector('.v-layout>.v-main').addEventListener('scroll',(e)=>{showActionButton.value = startScrollTop > e.target.scrollTop;startScrollTop=e.target.scrollTop;showActionButtonItems.value=false;},{passive:true})})
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

const showActionButton=ref(true)
const showActionButtonItems=ref(false)
  </script>