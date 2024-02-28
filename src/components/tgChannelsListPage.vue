<template>
    <div v-if="channelSearch">
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
          <div v-for="channel in searchedChannels" @click="allChannelsData[channel.id]={channel:channel,messages:[]};$router.push({name:'channel', params:{channelId:channel.id},query:{initMessageId:'',showChannel:true}})" :key="channel.id">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/channels/${channel.id}/${channel.avatar}`"
              :title="channel.name"
              subtitle=""
            >
            <template v-slot:append>
            <v-btn @click="$router.push({name:'channelSettings', params:{channelId:channel.id}})" v-if="channel.owner == pb.authStore.model.id"
              color="primary"
              icon="mdi-tune"
              variant="text"
            ></v-btn>
            <v-btn v-if="channelIds.includes(channel.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="unsubscribe(channel.id)"
            ></v-btn>
            <v-btn v-else
              color="primary"
              icon="mdi-plus"
              variant="text"
              @click.stop="subscribe(channel.id)"
            ></v-btn>
          </template>
          </v-list-item>
            <v-divider></v-divider>
          </div></div>
    <div v-else>
      <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">channels</h3>
            <div v-for="channelRel in allChannelsData.channelRels" @click="$router.push({name:'channel', params:{channelId:channelRel.channel},query:{initMessageId:'',showChannel:true}})" :key="channelRel.channel">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/channels/${channelRel.channel}/${channelRel.expand.channel.avatar}`"
              :title="channelRel.expand.channel.name"
              subtitle=""
            >
            <template v-slot:append>
            <v-btn @click="$router.push({name:'channelSettings', params:{channelId:channelRel.channel}})" v-if="channelRel.expand.channel.owner == pb.authStore.model.id"
              color="primary"
              icon="mdi-tune"
              variant="text"
              @click.stop=""
            ></v-btn>
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="unsubscribe(channelRel.channel)"
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
  import { subscribe, unsubscribe } from '@/funcs/channelFuncs';

  import {useOtherStore} from '@/store/otherStore'

  const {showError} = useOtherStore()
  
  const{updateChannelRels}=useDataStore()
  const{allChannelsData}=storeToRefs(useDataStore())
  
  updateChannelRels()
  
  const channelSearch=inject('channelSearch')
  const searchedChannels=ref([])
  
  
  
  async function addChannel(channelId){
    await subscribe(channelId)
  }
  async function deleteChannel(channelId){
    await unsubscribe(channelId)
  }
  // async function getChannels(){
  //   return await pb.collection('channels').getFullList({expand:'following'});
  // }
  // const channels=ref(await getChannels())
  pb.collection('channelMembers').subscribe('*', updateChannelRels)
  
  
  function getChannelFromId(id){
    return allChannelsData.value.channelRels.find(channel=>channel.channel==id)
  }
  
  
  const channelIds=computed(()=>allChannelsData.value.channelRels.map(channel=>channel.channel))
  
  watchEffect(async ()=>{
    if(channelSearch.value){
      searchedChannels.value=await pb.collection('channels').getFullList({filter:`name ~ "${channelSearch.value}"`})
    }
  })
  
  console.log(allChannelsData.value.channelRels)
  console.log(channelIds.value)
  </script>