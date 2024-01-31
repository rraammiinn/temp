<template>
  <div v-if="channelSearch">
    <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">global</h3>
        <div v-for="channel in searchedChannels" @click="allChannelMessages[channel.id]={channel:channel,messages:[]};$router.push({name:'channel', params:{channelId:channel.id},query:{initMessageId:'',showChannel:true}})" :key="channel.id">
            <v-list-item class="listItem"
            :prepend-avatar="`/api/files/channels/${channel.id}/${channel.avatar}`"
            :title="channel.name"
            subtitle=""
          >
          <template v-slot:append>
          <v-btn v-if="channelIds.includes(channel.id)"
            color="error"
            icon="mdi-delete"
            variant="text"
            @click.stop="deleteChannel(getChannelFromId(channel.id).id)"
          ></v-btn>
          <v-btn v-else
            color="primary"
            icon="mdi-plus"
            variant="text"
            @click.stop="addChannel(channel.id)"
          ></v-btn>
        </template>
        </v-list-item>
          <v-divider></v-divider>
        </div></div>
  <div v-else>
    <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">channels</h3>
          <div v-for="channelRel in channelRels" @click="$router.push({name:'channel', params:{channelId:channelRel.channel},query:{initMessageId:'',showChannel:true}})" :key="channelRel.channel">
            <v-list-item class="listItem"
            :prepend-avatar="`/api/files/channels/${channelRel.channel}/${channelRel.expand.channel.avatar}`"
            :title="channelRel.expand.channel.name"
            subtitle=""
          >
          <template v-slot:append>
          <v-btn
            color="error"
            icon="mdi-delete"
            variant="text"
            @click.stop="deleteChannel(channelRel.id)"
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
const{updateChannelRels,allChannelMessages}=useDataStore()
const{channelRels}=storeToRefs(useDataStore())

updateChannelRels()

const channelSearch=inject('channelSearch')
const searchedChannels=ref([])



async function addChannel(channel){
  await pb.collection('channelMembers').create({mem:pb.authStore.model.id, channel:channel})
}
async function deleteChannel(channel){
  await pb.collection('channelMembers').delete(channel);
}
// async function getChannels(){
//   return await pb.collection('channels').getFullList({expand:'following'});
// }
// const channels=ref(await getChannels())
pb.collection('channelMembers').subscribe('*', updateChannelRels)


function getChannelFromId(id){
  return channelRels.value.find(channel=>channel.channel==id)
}


const channelIds=computed(()=>channelRels.value.map(channel=>channel.channel))

watchEffect(async ()=>{
  if(channelSearch.value){
    searchedChannels.value=await pb.collection('channels').getFullList({filter:`name ~ "${channelSearch.value}"`})
  }
})

console.log(channelRels.value)
console.log(channelIds.value)
</script>