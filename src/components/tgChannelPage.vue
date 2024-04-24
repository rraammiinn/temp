<template>
    <tg-channel-details :subscribed="subscribed" :owner="owner" :channel="allChannelsData.allDatas.get(props.channelId).channel" v-if="showChannel"></tg-channel-details>
  
  <div class="main">
  
  
  
  
    <tg-scrollable :key="scrollableKey" v-model:allDatas="allChannelsData.allDatas" messages-type="channel" :is-owner="isOwner" :init-message-id="props.initMessageId" :other-id="props.channelId" :message-generator="messageGenerator"></tg-scrollable>

    <tg-sender sender-type="channel" :channel-id="props.channelId" :channel-subscribed="subscribed" :channel-is-owner="isOwner"></tg-sender>

  

      </div>

  
  </template>
  
  
  <style scoped>
  .main{
      width: 90vw;
      margin: auto;
      height: 90dvh;
  }
  </style>
  
  
  
  
  
  
  
  <script setup>
  import { ref, inject, onMounted, computed, onUpdated, onUnmounted } from 'vue';
  import pb from '@/main';
  import {storeToRefs} from 'pinia'
  import tgScrollable from './tgScrollable.vue';
  
  import {useDataStore} from '@/store/dataStore'
  import {getChannelMessages,getChannelMessageById,getPreviousChannelMessages,getNextChannelMessages,getLastChannelMessages,ChannelMessageGenerator} from '@/funcs/channelFuncs'
  
  
  import tgSender from './tgSender.vue';

  import {useOtherStore} from '@/store/otherStore'

  const{channelRels,allChannelsData}=storeToRefs(useDataStore())
  
  const props=defineProps(['channelId', 'initMessageId'])
  

  const showChannel=inject('showChannel')
  const channelsContainer=ref()
  
  

  
  const subscribed=inject('subscribed')
  const isOwner=inject('isOwner')
  const scrollableKey=inject('scrollableKey')
  
  

  
  
  import tgChannelDetails from './tgChannelDetails.vue';

  
  
  const messageGenerator = new ChannelMessageGenerator(props.channelId,props.initMessageId)
  let owner;
  try{
    owner=await pb.collection('users').getOne(allChannelsData.value.allDatas.get(props.channelId).channel?.owner);
  }catch{}

  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{channelsContainer.value?.scrollIntoView({block:'center'});}})
 


  
  
  
  </script>