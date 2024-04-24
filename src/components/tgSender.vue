<template>
<div style="position: absolute;bottom: 0;width: 100%;">
    <input multiple accept="*/*" ref="fileInput" @change="addFiles" type="file" hidden>
    <video autoplay muted ref="videoPreview" id="video-preview"></video>



    <div v-if="files.length" style="position: absolute;bottom: 0;height: 6.25rem;width: 90%;background-color:var(--tgBg) ;"></div>
  
  <div v-show="props.senderType == 'chat' || (props.senderType == 'channel' && (!props.channelSubscribed || props.channelIsOwner)) || (props.senderType == 'group' && (!props.groupJoined || !props.groupBlocked))" style="position: absolute;bottom: 0;height: 3.5rem;width: 90%;background-color:var(--tgBg) ;overflow: auto;white-space: nowrap;overflow-y: hidden;">

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

  <div :style="{position: 'absolute',bottom: (files.length)? '3.5rem':'.75rem',width: '90%'}">


    <div style="padding-bottom:1rem;display:flex;justify-content: space-between;gap: 1rem;align-items: center;">
      <div v-if="props.senderType == 'chat' || (props.senderType == 'group' && (!props.groupBlocked && props.groupJoined)) || props.senderType == 'channel' && (props.channelSubscribed && props.channelIsOwner)" style="display: flex;flex-shrink: 0;">
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
      
      <div v-if="props.replyTo && props.senderType != 'channel' && (props.senderType=='chat' || (!props.groupBlocked && props.groupJoined))" style="display: flex;gap: .5rem;overflow: hidden;align-items: center;">
        <img v-if="props.senderType == 'group' && props.replyToAvatarUrl" :src="props.replyToAvatarUrl" style="border-radius: .25rem;width: 2.5rem;height: 2.5rem;object-fit: cover;flex-shrink: 0;">
      <span v-if="props.replyToText" style="white-space: nowrap;overflow: hidden;background-color: var(--tgBrown);text-overflow: ellipsis;border-radius: .25rem;padding-left: .5rem;padding-right: .5rem">{{ props.replyToText }}</span>
      <v-btn @click="()=>{props.replyTo='',props.replyToAvatarUrl='';props.replyToText='';messageInput.blur();}" variant="text" size="1.5rem" color="error" icon="mdi-close"></v-btn>
      </div>

      <div style="margin-left: auto;" v-show="!props.replyTo && (props.senderType == 'chat' || (props.senderType == 'group' && props.groupJoined) || (props.senderType == 'channel' && props.channelSubscribed))" id="goToBottomBtn"></div>
    </div>




    <v-textarea v-if="props.senderType == 'chat' || (props.senderType == 'channel' && (props.channelSubscribed && props.channelIsOwner)) || (props.senderType == 'group' && (props.groupJoined && !props.groupBlocked))"
      dir="auto"
      ref="messageInput"
      id="message-input"
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

    <v-btn v-if="props.senderType == 'group' && !props.groupJoined" color="primary" @click="async()=>{await join(props.groupId);scrollableKey=Math.random();}" style="position: absolute;bottom: .75rem;width: 90%;">join</v-btn>
    <v-btn v-if="props.senderType == 'channel' && !props.channelSubscribed" color="primary" @click="async()=>{await subscribe(props.channelId);scrollableKey=Math.random();}" style="position: fixed;bottom: .75rem;width: 90%;">subscribe</v-btn>

  </div>

</div>
</template>

<style>
#video-preview{
  position: fixed;
  top: 0;
  display: none;
  z-index: 99999;
}

@media screen and (orientation: portrait) {
  #video-preview{
  left: 0;
  width: 100%;
  max-height: calc(100% - 10rem);
  background-color: black;
}
}

@media screen and (orientation: landscape) {
  #video-preview{
  right: 0;
  max-height: 100%;
}
}
</style>

<script setup>

import { ref, inject, onMounted, computed, onUpdated, onUnmounted, watchEffect } from 'vue';
  import pb from '@/main';
  import {storeToRefs} from 'pinia'
  
  import {getFileType, getIcon, getFileIcon} from '@/funcs/commonFuncs'
  import {useDataStore} from '@/store/dataStore'
  import {join} from '@/funcs/groupFuncs'
  import { subscribe } from '@/funcs/channelFuncs';
  
  
  import {useOtherStore} from '@/store/otherStore'

  import {VoiceRecorder, VideoRecorder} from '@/funcs/mediaFuncs'

  const videoPreview = ref()



  const {showError, showProgressBar, hideProgressBar} = useOtherStore()


  
  const props=defineProps(['senderType', 'otherId', 'groupId', 'channelId', 'channelSubscribed', 'groupJoined', 'groupBlocked', 'channelIsOwner', 'replyTo', 'replyToText', 'replyToAvatarUrl', 'replyTo', 'replyToText', 'replyToAvatarUrl'])
  

  // const replyTo = defineModel('replyTo')
  // const replyToText = defineModel('replyToText')
  // const replyToAvatarUrl = defineModel('replyToAvatarUrl')


  
  
  
  function addFiles(){
    for (let i=0;i<fileInput.value.files.length;i++){
      files.value.push(fileInput.value.files[i])
    }
    fileInput.value.value=null
  }
  const fileInput=ref()
  const messageInput=ref()

  
  
  
  function removeFile(file){
    files.value = files.value.filter(h => h != file)
  }
  
  function removeAllFiles() {
    files.value=[]
  }
  
  const scrollableKey=inject('scrollableKey')
  
  const files=ref([]);

  let sendEnabled=true;
  
  
  
  async function send(){
    if(!sendEnabled || (!msg.value && !files.value.length))return;
    sendEnabled=false;
    showProgressBar()
    try{
      let formData = new FormData();
      formData.append('from', pb.authStore.model.id)
      if(props.senderType == 'chat'){
      formData.append('to', props.otherId)
      }else if(props.senderType == 'group'){
      formData.append('group', props.groupId)
      }else if(props.senderType == 'channel'){
      formData.append('channel', props.channelId)
      }
      formData.append('text', msg.value)

      if(props.replyTo){
        formData.append('replyto', props.replyTo)
      }
  
      for (const file of files.value){
  
        formData.append('files', file)
      }
  
      
      const record = await pb.collection(`${props.senderType}Messages`).create(formData);
    }catch{showError('sending message failed.')}

      msg.value=''
      props.replyTo=''
      props.replyToAvatarUrl=''
      props.replyToText=''
      files.value=[]

      sendEnabled=true;
    hideProgressBar()
  }
  
  const msg=ref('')




  
  const isRecording=ref(false);
  const isPaused=ref(false);

  const mediaType=ref('audio');


  const voiceRecorder = new VoiceRecorder(()=>{isRecording.value=true;isPaused.value=false;},(file)=>{isRecording.value=false;files.value.push(file)},()=>{isPaused.value=false;},()=>{isPaused.value=true;})

  const videoRecorder = new VideoRecorder(()=>{isRecording.value=true;isPaused.value=false;videoPreview.value.style.display='block';},(file)=>{isRecording.value=false;videoPreview.value.srcObject=null;videoPreview.value.style.display='none';files.value.push(file)},()=>{isPaused.value=false;videoPreview.value.style.display='block';},()=>{isPaused.value=true;videoPreview.value.style.display='none';})
  
  const recorder = computed(()=>(mediaType.value == 'audio' ? voiceRecorder : videoRecorder))


</script>