<template>
    <tg-user-details style="z-index: 888;" :user="user" v-if="showUser"></tg-user-details>

    <tg-group-details @join="async()=>{await allGroupsData.allDatas.get(props.groupId).init();await messageGenerator.initializeMessages()}" :joined="joined" :owner="owner" :members="allGroupsData.allDatas.get(props.groupId).groupMems" :group="allGroupsData.allDatas.get(props.groupId).group" :block-list="allGroupsData.allDatas.get(props.groupId).blockList" v-if="showGroup"></tg-group-details>
  
  <div class="main">
  
  
  
  
    <tg-scrollable :key="scrollableKey" @reply="reply" @userSelect="(selectedUser)=>{if(selectedUser == pb.authStore.model.id)return;user=allGroupsData.allDatas.get(props.groupId).groupMems.get(selectedUser);showUser=true;}" v-model:allDatas="allGroupsData.allDatas" messages-type="group" :is-owner="isOwner" :init-message-id="props.initMessageId" :other-id="props.groupId" :message-generator="messageGenerator"></tg-scrollable>

    <tg-sender sender-type="group" :group-id="props.groupId" :group-joined="joined" :group-blocked="blocked" :reply-to="replyTo" :reply-to-text="replyToText" :reply-to-avatar-url="replyToAvatarUrl"></tg-sender>


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
  import { ref, inject, onMounted, computed, onUpdated, onUnmounted, watchEffect } from 'vue';
  import {pb} from '@/funcs/pb';
  import {storeToRefs} from 'pinia'
  import tgScrollable from './tgScrollable.vue';
  
  import {useDataStore} from '@/store/dataStore'
  import {getGroupMessages,getGroupMessageById,getPreviousGroupMessages,getNextGroupMessages,getLastGroupMessages,GroupMessageGenerator,join} from '@/funcs/groupFuncs'
  
  
  import tgSender from './tgSender.vue';

  import tgUserDetails from './tgUserDetails.vue';

  import {useOtherStore} from '@/store/otherStore'


  const user=ref()
  const showUser =inject('showUser')

  
  
  const{groupRels,allGroupsData}=storeToRefs(useDataStore())
  
  const props=defineProps(['groupId', 'initMessageId'])
  
  
  

  const showGroup=inject('showGroup')
  const groupsContainer=ref()
  
  

  const joined=inject('joined')
  const isOwner=inject('isOwner')
  const scrollableKey=inject('scrollableKey')
  const blocked=allGroupsData.value.allDatas.get(props.groupId)?.blocked
  

  const replyTo=ref('')
  const replyToAvatarUrl=ref('')
  const replyToText=ref('')
  

  
  function reply(messageId,userAvatarUrl,messageText){
    replyTo.value=messageId;
    replyToAvatarUrl.value=userAvatarUrl;
    replyToText.value=messageText;
    document.getElementById('message-input').focus();
  }
  
  
  import tgGroupDetails from './tgGroupDetails.vue';

  
  
  const messageGenerator = new GroupMessageGenerator(props.groupId,props.initMessageId)
  let owner;
  try{
    owner=await pb.collection('users').getOne(allGroupsData.value.allDatas.get(props.groupId).group?.owner);
  }catch{}
  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{groupsContainer.value?.scrollIntoView({block:'center'});}})
 

 
  </script>