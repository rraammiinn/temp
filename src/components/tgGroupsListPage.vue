<template>
    <div v-if="groupSearch">
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
          <div v-for="group in searchedGroups" @click="allGroupsData[group.id]={group:group,messages:[]};$router.push({name:'group', params:{groupId:group.id},query:{initMessageId:'',showGroup:true}})" :key="group.id">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/groups/${group.id}/${group.avatar}`"
              :title="group.name"
              subtitle=""
            >
            <template v-slot:append>
            <v-btn @click="$router.push({name:'groupSettings', params:{groupId:group.id}})" v-if="group.owner == pb.authStore.model.id"
              color="primary"
              icon="mdi-tune"
              variant="text"
              @click.stop=""
            ></v-btn>
            <v-btn v-if="activeGroupsIds.includes(group.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="leave(group.id)"
            ></v-btn>
            <v-btn v-else
              color="primary"
              icon="mdi-plus"
              variant="text"
              @click.stop="join(group.id)"
            ></v-btn>
          </template>
          </v-list-item>
            <v-divider></v-divider>
          </div></div>
    <div v-else>
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">groups</h3>
      <template v-for="groupRel in allGroupsData.groupRels">
        <div v-if="groupRel.active" @click="$router.push({name:'group', params:{groupId:groupRel.group},query:{initMessageId:'',showGroup:true}})" :key="groupRel.group">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/groups/${groupRel.group}/${groupRel.expand.group.avatar}`"
              :title="groupRel.expand.group.name"
              subtitle=""
            >
            <template v-slot:append>
              <v-btn @click="$router.push({name:'groupSettings', params:{groupId:groupRel.group}})" v-if="groupRel.expand.group.owner == pb.authStore.model.id"
              color="primary"
              icon="mdi-tune"
              variant="text"
              @click.stop=""
            ></v-btn>
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="leave(groupRel.group)"
            ></v-btn>
          </template>
          </v-list-item>
            <v-divider></v-divider>
          </div>
      </template>
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
  import { join,leave } from '@/funcs/groupFuncs';
  const{updateGroupRels}=useDataStore()
  const{allGroupsData}=storeToRefs(useDataStore())
  
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
  // pb.collection('groupMembers').subscribe('*', updateGroupRels)
  
  
  function getGroupFromId(id){
    return allGroupsData.value.groupRels.find(group=>group.group==id)
  }
  
  
  const activeGroupsIds=computed(()=>allGroupsData.value.groupRels.filter(groupRel=>groupRel.active).map(groupRel=>groupRel.group))
  
  watchEffect(async ()=>{
    if(groupSearch.value){
      searchedGroups.value=await pb.collection('groups').getFullList({filter:`name ~ "${groupSearch.value}"`})
    }
  })
  
  console.log(allGroupsData.value.groupRels)
  </script>