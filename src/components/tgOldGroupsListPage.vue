<template>
    <div v-if="groupSearch">
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
          <div v-for="group in searchedGroups" @click="$router.push({name:'group', params:{groupId:group.id},query:{initMessageId:'',showGroup:true}})" :key="group.id">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/groups/${group.id}/${group.avatar}`"
              :title="group.name"
              subtitle=""
            >
            <template v-slot:append>
            <v-btn v-if="groupIds.includes(group.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteGroup(getGroupFromId(group.id).id)"
            ></v-btn>
            <v-btn v-else
              color="primary"
              icon="mdi-plus"
              variant="text"
              @click.stop="addGroup(group.id)"
            ></v-btn>
          </template>
          </v-list-item>
            <v-divider></v-divider>
          </div></div>
    <div v-else>
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">groups</h3>
            <div v-for="group in groups" @click="$router.push({name:'group', params:{groupId:group.id},query:{initMessageId:'',showGroup:true}})" :key="group.id">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/groups/${group.id}/${group.avatar}`"
              :title="group.name"
              subtitle=""
            >
            <template v-slot:append>
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteGroup(group.id)"
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
  const{updateGroupRels,allGroupMessages}=useDataStore()
  const{groupRels,groups}=storeToRefs(useDataStore())
  
  updateGroupRels()
  
  const groupSearch=inject('groupSearch')
  const searchedGroups=ref([])
  
  
  
  async function addGroup(group){
    await pb.collection('groupMembers').create({mem:pb.authStore.model.id, group:group})
  }
  async function deleteGroup(group){
    await pb.collection('groupMembers').delete(group);
  }
  // async function getGroups(){
  //   return await pb.collection('groups').getFullList({expand:'following'});
  // }
  // const groups=ref(await getGroups())
  pb.collection('groupMembers').subscribe('*', updateGroupRels)
  
  
  function getGroupFromId(id){
    return groupRels.value.find(group=>group.group==id)
  }
  
  
  const groupIds=computed(()=>groupRels.value.map(group=>group.group))
  
  watchEffect(async ()=>{
    if(groupSearch.value){
      searchedGroups.value=await pb.collection('groups').getFullList({filter:`name ~ "${groupSearch.value}"`})
    }
  })
  
  console.log(groupRels.value)
  console.log(groupIds.value)
  </script>