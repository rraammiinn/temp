<template>
    <tg-user-details :is-in-rel="isInRel" :blocked="blocked" style="z-index: 888;" :user="allChatsData.allDatas.get(props.otherId).other" v-if="showUser"></tg-user-details>
  
  <div class="main">
  
  
  
  
    <tg-scrollable @reply="reply" v-model:allDatas="allChatsData.allDatas" messages-type="chat" :init-message-id="props.initMessageId" :other-id="props.otherId" :message-generator="messageGenerator"></tg-scrollable>

    <tg-sender sender-type="chat" :other-id="props.otherId" :reply-to="replyTo" :reply-to-text="replyToText" :reply-to-avatar-url="replyToAvatarUrl"></tg-sender>

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
  import {getChatMessages,getChatMessageById,getPreviousChatMessages,getNextChatMessages,getLastChatMessages,ChatMessageGenerator} from '@/funcs/chatFuncs'
  
  
  import tgSender from './tgSender.vue';

  import {useOtherStore} from '@/store/otherStore'


  const{rels,allChatsData}=storeToRefs(useDataStore())
  
  const props=defineProps(['otherId', 'initMessageId'])
  
  
  

  const showUser=inject('showUser')
  const chatsContainer=ref()
  
  

  const replyTo=ref('')
  const replyToAvatarUrl=ref('')
  const replyToText=ref('')
  

  function reply(messageId,userAvatarUrl,messageText){
    replyTo.value=messageId;
    replyToAvatarUrl.value=userAvatarUrl;
    replyToText.value=messageText;
    document.getElementById('message-input').focus();
  }
  
  
  
  import tgUserDetails from './tgUserDetails.vue';
  

  
  const messageGenerator = new ChatMessageGenerator(props.otherId,props.initMessageId)
  const isInRel=inject('isInRel')
  const blocked=inject('blocked')

  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{chatsContainer.value?.scrollIntoView({block:'center'});}})
 

  

  
  </script>