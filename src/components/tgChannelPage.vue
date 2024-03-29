<template>
    <tg-channel-details :subscribed="subscribed" :owner="owner" :channel="allChannelsData.allMessages[props.channelId].channel" v-if="showChannel"></tg-channel-details>
  
  <div class="main">
  
  
  
  
    <tg-scrollable @imageSelect="(selectedImage)=>{sheet = !sheet;image=selectedImage}" v-model:allMessages="allChannelsData.allMessages" messages-type="channel" :is-owner="isOwner" :init-message-id="props.initMessageId" :other-id="props.channelId" :message-generator="messageGenerator"></tg-scrollable>
  

  
  
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
          <div v-if="subscribed && isOwner" style="padding-bottom:1rem;display:flex">
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
  
          <v-textarea v-if="subscribed && isOwner"
            dir="auto"
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

          <v-btn v-if="!subscribed" color="primary" @click="subscribe(props.channelId)" style="position: fixed;bottom: .75rem;width: 90%;">subscribe</v-btn>

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
  import {getChannelMessages,getChannelMessageById,getPreviousChannelMessages,getNextChannelMessages,getLastChannelMessages,ChannelMessageGenerator} from '@/funcs/channelFuncs'
  
  
  import tgCard from './tgCard.vue';
  import {getFileType, getIcon, getFileIcon} from '@/funcs/commonFuncs'
  import { subscribe } from '@/funcs/channelFuncs';

  import {useOtherStore} from '@/store/otherStore'

  import {VoiceRecorder, VideoRecorder} from '@/funcs/mediaFuncs'

  const videoPreview = ref()



  const {showError, showProgressBar, hideProgressBar} = useOtherStore()

  
  
  const{updateUnseenCount}=useDataStore()
  const{channelRels,allChannelsData}=storeToRefs(useDataStore())
  
  const props=defineProps(['channelId', 'initMessageId'])
  
  const scrollable=ref();
  
  const showGoToBottom=ref(false)


  
  
  function addFiles(){
    for (let i=0;i<fileInput.value.files.length;i++){
      files.value.push(fileInput.value.files[i])
    }
    fileInput.value.value=null
  }
  const fileInput=ref()
  
  const showChannel=inject('showChannel')
  const channelsContainer=ref()
  
  
  function removeFile(file){
    files.value = files.value.filter(h => h != file)
  }
  
  function removeAllFiles() {
    files.value=[]
  }
  
  const subscribed=inject('subscribed')
  const isOwner=inject('isOwner')
  
  
  const files=ref([]);
  
  
  
  async function send(){
    showProgressBar()
    try{
      if(!isOwner.value){
      return;
    }
      let formData = new FormData();
      formData.append('from', pb.authStore.model.id)
      formData.append('channel', props.channelId)
      formData.append('text', msg.value)
  
      for (const file of files.value){
  
        formData.append('files', file)
      }
  
      
      const record = await pb.collection('channelMessages').create(formData);
    }catch{showError('sending message failed.')}

      msg.value=''
      files.value=[]
    hideProgressBar()
  }
  
  const msg=ref('')
  
  
  
  import tgChannelDetails from './tgChannelDetails.vue';
  import { ChannelData } from '@/store/dataModels';
  
  const sheet=ref(false)
  const image=ref('')
  const startEnabled=ref(false)
  const endEnabled=ref(false)
  
  
  
  
  const messageGenerator = new ChannelMessageGenerator(props.channelId,props.initMessageId)
  const owner=await pb.collection('users').getOne(allChannelsData.value.allMessages[props.channelId].channel?.owner);


  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{channelsContainer.value?.scrollIntoView({block:'center'});}})
 

  
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