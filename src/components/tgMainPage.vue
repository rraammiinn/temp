<template>

    <v-text-field v-model="pass"></v-text-field>
    <v-btn @click="signIn">sign in</v-btn>
    <v-btn @click="getU"> get u</v-btn>
    <v-btn @click="getM">get m</v-btn>


      <v-list :items="Object.keys(lastChats)"  item-props  lines="three">

        <div v-for="lastChat in lastChats" @click="currentPage='chat';other=lastChat.user">
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
</style>

  <script setup>
  import { ref, inject } from 'vue';
  const currentPage=inject('currentPage')
  const other=inject('other')
  const lastChats=inject('lastChats')
  const users=inject('users')


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


  </script>