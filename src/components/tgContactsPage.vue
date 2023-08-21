<template>
      <!-- <v-list :items="users"  item-props  lines="three"> -->
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
      <!-- </v-list> -->

</template>

<style scoped>
.listItem:hover{
    color: #1867C0;
    background-color:#1866c010;
}
</style>

<script setup>
import { ref, inject, onMounted } from 'vue';
import pb from '@/main';

const users=ref()
// users.value=await pb.collection('users').getFullList({sort: '-created',})
await getUsers()

pb.collection('users').subscribe('*', getUsers);

// onMounted(
// getUsers
// )

// onMounted(async()=>{
//   await getUsers()
// pb.collection('users').subscribe('*', async function (e) {
//   if(e.action=='create'){
//     await getUsers()}
//     console.log(e)
// });
// }

// )

async function getUsers(){
    users.value = await pb.collection('users').getFullList({
    sort: '-created',
});
}



const currentPage=inject('currentPage')
const other=inject('other')

const items=ref([
  {prependAvatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwDJ2a1CRPF6uU1g3JWNmPnLUJkkPImYSh-Q&usqp=CAU',name:'s',mail:'xxx@gmail.com',isSaved:false},
  {prependAvatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwDJ2a1CRPF6uU1g3JWNmPnLUJkkPImYSh-Q&usqp=CAU',name:'sss',mail:'xxxxx@gmail.com',isSaved:true},
  {prependAvatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwDJ2a1CRPF6uU1g3JWNmPnLUJkkPImYSh-Q&usqp=CAU',name:'sssss',mail:'xxxxxxxxx@gmail.com',isSaved:false},
])
</script>