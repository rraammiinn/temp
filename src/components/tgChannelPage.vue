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
        :prepend-icon="file.name=='voice.mp3' ? 'mdi-microphone' : getIcon(getFileType(file.name))"
        :model-value="true"
      >
        {{ file.name }}
      </v-chip>
        </div>
  
        <div :style="{position: 'fixed',bottom: (files.length)? '3.5rem':'.75rem',width: '90%'}">
          <div v-if="subscribed && isOwner" style="padding-bottom:1rem;display:flex">
            <v-btn v-if="!isRecording"
              color="primary"
              icon="mdi-microphone"
              variant="text"
              @click.stop="startRecording"
            ></v-btn>
            <div v-else>
              <v-btn
              color="error"
              icon="mdi-stop"
              variant="text"
              @click.stop="stopRecording"
            ></v-btn>
            <v-btn v-if="isPaused"
              color="success"
              icon="mdi-play"
              variant="text"
              @click.stop="resumeRecording"
            ></v-btn>
            <v-btn v-else
              color="warning"
              icon="mdi-pause"
              variant="text"
              @click.stop="pauseRecording"
            ></v-btn>
            </div>
          </div>
  
          <v-textarea v-if="subscribed && isOwner"
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
  
      <!-- <v-btn v-show="showGoToBottom" @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;position: fixed;right: 1.5rem;" color="primary" size="3.5rem" elevation="24" :style="{bottom: (files.length)? '8rem':'5.25rem'}"></v-btn> -->
  
  
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
  import {getFileType, getIcon} from '@/funcs/commonFuncs'
  import { subscribe } from '@/funcs/channelFuncs';
  
  
  const{updateUnseenCount}=useDataStore()
  const{channelRels,allChannelsData}=storeToRefs(useDataStore())
  
  const props=defineProps(['channelId', 'initMessageId'])
  
  const scrollable=ref();
  
  const showGoToBottom=ref(false)


  
  
  function addFiles(){
    for (var i=0;i<fileInput.value.files.length;i++){
      files.value.push(fileInput.value.files[i])
    }
  
  }
  const fileInput=ref()
  
  const showChannel=inject('showChannel')
  const channelsContainer=ref()
  
  
  function removeFile(file){
    console.log(files.value)
    files.value = files.value.filter(h => h != file)
    console.log(files.value)
  }
  
  function removeAllFiles() {
    files.value=[]
  }
  
  // const subscribed=computed(()=>!!allChannelsData.value.allMessages[props.channelId].channelRelId)
  const subscribed=inject('subscribed')
  const isOwner=inject('isOwner')
  // const isOwner=computed(()=>allChannelsData.value.allMessages[props.channelId]?.channel?.owner==pb.authStore.model.id)  
  
  
  const files=ref([]);
  
  
  
  async function send(){
    if(!isOwner.value){
      return;
    }
      var formData = new FormData();
      console.log(props.channelId)
      formData.append('from', pb.authStore.model.id)
      formData.append('channel', props.channelId)
      formData.append('text', msg.value)
  
      for (const file of files.value){
  
        formData.append('files', file)
      }
  
      
      const record = await pb.collection('channelMessages').create(formData);
      msg.value=''
      files.value=[]
  
  }
  
  const msg=ref('')
  
  
  
  import tgChannelDetails from './tgChannelDetails.vue';
  import { ChannelData } from '@/store/dataModels';
  
  const sheet=ref(false)
  const image=ref('')
  const startEnabled=ref(false)
  const endEnabled=ref(false)
  
  
  
  
  const messageGenerator = new ChannelMessageGenerator(props.channelId,props.initMessageId)
  // await messageGenerator.initializeMessages()
  const owner=await pb.collection('users').getOne(allChannelsData.value.allMessages[props.channelId].channel?.owner);


  // initializeChannelMessages(props.channelId,props.initMessageId)
  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{channelsContainer.value?.scrollIntoView({block:'center'});}})
 

  
  onUpdated(()=>{if(isTop){scrollable.value.scrollTop=scrollable.value.scrollHeight-previousScrollHeight;previousScrollHeight=scrollable.value.scrollHeight;isTop=false;}else if(isGoToBottom){scrollable.value.scrollTop=scrollable.value.scrollHeight;isGoToBottom=false;showGoToBottom.value=false;}})
  
  var isTop=false;
  var isGoToBottom=false
  var previousScrollHeight;
  
  
  
  
  
  
  
  // async function goToBottom(){
  //   if(endEnabled.value){
  //   startEnabled.value=true
  //   endEnabled.value=false
  //   allChannelsData.allMessages.value[props.channelId].messages= await getLastChannelMessages(props.channelId)
  //   isGoToBottom=true
  //   const date = allChannelsData.allMessages.value[props.channelId].messages.at(-1).created
  //     if(new Date(allChannelsData.allMessages.value[props.channelId].lastSeen) < new Date(date)){
  //     allChannelsData.allMessages.value[props.channelId].lastSeen=date;
  //     pb.collection('channelRels').update(allChannelsData.allMessages.value[props.channelId].channelRelId,{lastseen:date})
  //     }
  //   subscribeToNewMessages()
  //   if(allChannelsData.allMessages.value[props.channelId].messages.length<10)startEnabled.value=false;}
  //   else{scrollable.value.scrollTop=scrollable.value.scrollHeight;showGoToBottom.value=false;}
  // }
  var startScrollTop=0
  
 
  
  // onUnmounted(()=>updateUnseenCount(props.channelId))
  

  
  const isRecording=ref(false);
  const isPaused=ref(false);
  var chunks=[];
  var mediaRecorder;
  
  
  
  function startRecording() {
    if (navigator.mediaDevices?.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        {
          audio: true,
        },
      )
  
      .then((stream) => {
        isRecording.value=true;
        isPaused.value=false;
  
        mediaRecorder = new MediaRecorder(stream);
  
        mediaRecorder.onstop = (e) => {
          isRecording.value=false;
          const blob = new Blob(chunks, { type: "audio/mp3; codecs=mp3" });
          const file = new File([blob],'voice.mp3',{ type: 'audio/mp3' })
          files.value.push(file)
    }
  
    mediaRecorder.onpause = (e) => {
      isPaused.value=true;
    }
  
    mediaRecorder.onresume = (e) => {
      isPaused.value=false;
    }
  
  
        mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
  };
    chunks=[];
    mediaRecorder.start();
  
      })
  
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
  }
  
  function stopRecording() {
    mediaRecorder.stop();
  }
  
  function pauseRecording() {
    mediaRecorder.pause();
  }
  
  function resumeRecording() {
    mediaRecorder.resume();
  }

//   async function subscribe(){
//   try{const channelRel = await pb.collection('channelMembers').create({"mem":pb.authStore.model.id, "channel":props.channelId},{expand:'mem,channel'});
//   subscribed.value=true;
//   const messages=allChannelsData.value.allMessages[props.channelId].messages
//   const cacheNewMessages=allChannelsData.value.allMessages[props.channelId].cacheNewMessages
//   allChannelsData.value.allMessages[props.channelId]=new ChannelData(channelRel)
//   try{
//     await allChannelsData.value.allMessages[props.channelId].init()
//   }catch{}
//   allChannelsData.value.allMessages[props.channelId].messages=messages
//   allChannelsData.value.allMessages[props.channelId].cacheNewMessages=cacheNewMessages
// }
//   catch{}}
  
  
  
  </script>