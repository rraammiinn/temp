<template>
    <tg-user-details :is-in-rel="isInRel" :blocked="blocked" style="z-index: 888;" :user="allChatsData.allMessages[props.otherId].other" v-if="showUser"></tg-user-details>
  
  <div class="main">
  
  
  
  
    <tg-scrollable @reply="(messageId,userAvatarUrl,messageText)=>{replyTo=messageId;replyToAvatarUrl=userAvatarUrl;replyToText=messageText;messageInput.focus();}" @imageSelect="(selectedImage)=>{sheet = !sheet;image=selectedImage}" v-model:allMessages="allChatsData.allMessages" messages-type="chat" :init-message-id="props.initMessageId" :other-id="props.otherId" :message-generator="messageGenerator"></tg-scrollable>
  

  
  
      <v-bottom-sheet v-model="sheet">
        <img style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;max-width: 100vw;;max-height: 80dvh;object-fit: contain;" :src="image">
        <div style="width: 100%;">
        <v-btn style="border-radius: 0;" color="error" width="50%" prepend-icon="mdi-close" @click="sheet=false">close</v-btn>
        <a download style="text-decoration: none;" :href="image"><v-btn style="border-radius: 0;" width="50%" color="primary" prepend-icon="mdi-download" @click="sheet=false">download</v-btn></a>
        </div>
  
      </v-bottom-sheet>
  
  
        <div v-if="files.length" style="position: fixed;bottom: 0;height: 6.25rem;width: 90%;background-color:var(--tgBg) ;"></div>
  
        <div style="position: fixed;bottom: 0;height: 3.5rem;width: 90%;background-color:var(--tgBg) ;overflow: auto;white-space: nowrap;overflow-y: hidden;">
  
          <v-btn v-if="files.length"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="removeAllFiles"
            ></v-btn>
  
          <v-chip v-for="file in files" :key="file"
  
          @click:close="removeFile(file)"
        class="ma-2"
        closable
        color="var(--tgBrown)"
        close-icon="mdi-delete"
        :prepend-icon="getFileIcon(file.name)"
        :model-value="true"
      >
        {{ file.name }}
      </v-chip>
        </div>

        <div :style="{position: 'fixed',bottom: (files.length)? '3.5rem':'.75rem',width: '90%'}">
          <div style="padding-bottom:1rem;display:flex;justify-content: space-between;gap: 1rem;">
            <div style="display: flex;flex-shrink: 0;">
              <v-btn v-if="!isRecording"
              color="primary"
              :icon="mediaType == 'audio' ? 'mdi-microphone' : 'mdi-webcam'"
              variant="text"
              @click.stop="()=>{recorder.startRecording(videoPreview)}"
              @contextmenu.stop.prevent="if(mediaType == 'audio')mediaType = 'video';else mediaType = 'audio'"
            ></v-btn>
            <div v-else>
              <v-btn
              color="error"
              icon="mdi-stop"
              variant="text"
              @click.stop="()=>{recorder.stopRecording()}"
            ></v-btn>
            <v-btn v-if="isPaused"
              color="success"
              icon="mdi-play"
              variant="text"
              @click.stop="()=>{recorder.resumeRecording()}"
            ></v-btn>
            <v-btn v-else
              color="warning"
              icon="mdi-pause"
              variant="text"
              @click.stop="()=>{recorder.pauseRecording()}"
            ></v-btn>
            </div>
            </div>
            
            <div v-if="replyTo" style="display: flex;gap: .5rem;overflow: hidden;align-items: center;">
            <span v-if="replyToText" style="white-space: nowrap;overflow: hidden;background-color: var(--tgBrown);text-overflow: ellipsis;border-radius: .25rem;padding-left: .5rem;padding-right: .5rem">{{ replyToText }}</span>
            <v-btn @click="()=>{replyTo='',replyToAvatarUrl='';replyToText='';messageInput.blur();}" variant="text" size="1.5rem" color="error" icon="mdi-close"></v-btn>
            </div>
          </div>
  
          <v-textarea
            dir="auto"
            ref="messageInput"
            label="message"
            auto-grow
            variant="solo-filled"
            rows="1"
            row-height="15"
            :loading="loading"
          density="compact"
          append-inner-icon="mdi-send"
          single-line
          hide-details
          @click:append-inner.stop="send"
          v-model="msg"
          prepend-inner-icon="mdi-image"
          @click:prepend-inner.stop="fileInput?.click()"
          ></v-textarea>
        </div>
  
  
      </div>
      <input multiple accept="*/*" ref="fileInput" @change="addFiles" type="file" hidden>
  
  
      <video autoplay muted ref="videoPreview" style="position: fixed;top: 0;width: 100%;margin-top: 4rem;display: none;max-height: 50%;"></video>
  
  </template>
  
  
  <style scoped>
  .main{
      width: 90vw;
      margin: auto;
      height: 90dvh;
  }
  .card{
      margin: 1rem;
      max-width: 80%;
      margin-top: 1rem;
      margin-bottom: 3rem;
      width: min-content;
  }
  .fromYou{
      align-self: flex-end;
  }
  .fileBtn:hover{
    width: fit-content;
  }
  </style>
  
  
  
  
  
  
  
  <script setup>
  import { ref, inject, onMounted, computed, onUpdated, onUnmounted } from 'vue';
  import pb from '@/main';
  import {storeToRefs} from 'pinia'
  import tgScrollable from './tgScrollable.vue';
  
  import {useDataStore} from '@/store/dataStore'
  import {getChatMessages,getChatMessageById,getPreviousChatMessages,getNextChatMessages,getLastChatMessages,ChatMessageGenerator} from '@/funcs/chatFuncs'
  
  
  import tgCard from './tgCard.vue';
  import {getFileType, getIcon, getFileIcon} from '@/funcs/commonFuncs'
  import { ChatData } from '@/store/dataModels';

  import {useOtherStore} from '@/store/otherStore'

  import {VoiceRecorder, VideoRecorder} from '@/funcs/mediaFuncs'

  const videoPreview = ref()

  const {showError, showProgressBar, hideProgressBar} = useOtherStore()
  
  
  const{updateUnseenCount}=useDataStore()
  const{rels,allChatsData}=storeToRefs(useDataStore())
  
  const props=defineProps(['otherId', 'initMessageId'])
  
  const scrollable=ref();
  
  const showGoToBottom=ref(false)
  
  
  function addFiles(){
    for (let i=0;i<fileInput.value.files.length;i++){
      files.value.push(fileInput.value.files[i])
    }
    fileInput.value.value=null
  }
  const fileInput=ref()
  const messageInput=ref()
  
  const showUser=inject('showUser')
  const chatsContainer=ref()
  
  
  function removeFile(file){
    files.value = files.value.filter(h => h != file)
  }
  
  function removeAllFiles() {
    files.value=[]
  }
  
  
  
  const files=ref([]);
  
  
  
  async function send(){
    showProgressBar()
    try{
      if(!isInRel.value){
      let rel,backRel;
      try{rel = await pb.collection('rels').create({follower:pb.authStore.model.id, following:props.otherId, active:true},{expand:'follower,following'})}catch{}
      try{backRel = await pb.collection('rels').create({follower:props.otherId, following:pb.authStore.model.id, active:true},{expand:'follower,following'})}catch{}
    }
      let formData = new FormData();
      formData.append('from', pb.authStore.model.id)
      formData.append('to', props.otherId)
      formData.append('text', msg.value)

      if(replyTo.value){
        formData.append('replyto', replyTo.value)
      }
  
      for (const file of files.value){
  
        formData.append('files', file)
      }
  
      
      const record = await pb.collection('chatMessages').create(formData);
    }catch{showError('sending message failed.')}

      msg.value=''
      replyTo.value=''
      replyToAvatarUrl.value=''
      replyToText.value=''
      files.value=[]
    hideProgressBar()
  }
  
  const msg=ref('')
  const replyTo=ref('')
  const replyToAvatarUrl=ref('')
  const replyToText=ref('')
  
  
  
  import tgUserDetails from './tgUserDetails.vue';
  
  const sheet=ref(false)
  const image=ref('')
  const startEnabled=ref(false)
  const endEnabled=ref(false)
  
  
  
  
  const messageGenerator = new ChatMessageGenerator(props.otherId,props.initMessageId)
  const isInRel=inject('isInRel')
  const blocked=inject('blocked')

  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{chatsContainer.value?.scrollIntoView({block:'center'});}})
 

  
  onUpdated(()=>{if(isTop){scrollable.value.scrollTop=scrollable.value.scrollHeight-previousScrollHeight;previousScrollHeight=scrollable.value.scrollHeight;isTop=false;}else if(isGoToBottom){scrollable.value.scrollTop=scrollable.value.scrollHeight;isGoToBottom=false;showGoToBottom.value=false;}})
  
  let isTop=false;
  let isGoToBottom=false
  let previousScrollHeight;
  
  
  
  
  
  
  

  let startScrollTop=0
  
 
  
  

  
  const isRecording=ref(false);
  const isPaused=ref(false);
  
  const mediaType=ref('audio');
  
  const voiceRecorder = new VoiceRecorder(()=>{isRecording.value=true;isPaused.value=false;},(file)=>{isRecording.value=false;files.value.push(file)},()=>{isPaused.value=false;},()=>{isPaused.value=true;})

  const videoRecorder = new VideoRecorder(()=>{isRecording.value=true;isPaused.value=false;videoPreview.value.style.display='block';},(file)=>{isRecording.value=false;videoPreview.value.srcObject=null;videoPreview.value.style.display='none';files.value.push(file)},()=>{isPaused.value=false;videoPreview.value.style.display='block';},()=>{isPaused.value=true;videoPreview.value.style.display='none';})
  
  const recorder = computed(()=>(mediaType.value == 'audio' ? voiceRecorder : videoRecorder))


  
  </script>