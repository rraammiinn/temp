<template>
  <tg-user-details :otherId="allChatMessages[props.otherId].other" v-show="showUser"></tg-user-details>

<div class="main">

  <div ref="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;">
    <div style="padding-top: 5rem;padding-bottom: 5rem;display: flex;flex-direction: column;">
    <template v-for="message,i in allChatMessages[props.otherId].messages" :key="message.id">
      <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(allChatMessages[props.otherId].messages[i-1]?.created).toLocaleDateString()" style="width: fit-content;margin: auto;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>



      <tg-card @imageSelect="(selectedImage)=>{sheet = !sheet;image=selectedImage}" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :time="message.created" :id="message.id" :name="((message.from==pb.authStore.model.id) ? pb.authStore.model : allChatMessages[props.otherId].other).name" :text="message.text" :avatar="`/api/files/users/${message.from}/${((message.from==pb.authStore.model.id) ? pb.authStore.model : allChatMessages[props.otherId].other).avatar}`" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(allChatMessages[props.otherId].otherLastSeen).getTime()"></tg-card>


</template>
</div>
  </div>



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
        <div style="padding-bottom:1rem;display:flex">
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

        <v-textarea
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
<!-- 
      <v-textarea
      :style="{position: 'fixed',bottom: (files.length)? '3.5rem':'.75rem',width: '90%'}"
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
        ></v-textarea> -->

    </div>
    <input multiple accept="*/*" ref="fileInput" @change="addFiles" type="file" hidden>

    <v-btn v-show="showGoToBottom" @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;position: fixed;right: 1.5rem;" color="primary" size="3.5rem" elevation="24" :style="{bottom: (files.length)? '8rem':'5.25rem'}"></v-btn>


</template>


<style scoped>
.main{
    width: 90vw;
    margin: auto;
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

import {useDataStore} from '@/store/dataStore'
import {getChatMessages,getChatMessageById,getPreviousChatMessages,getNextChatMessages,getLastChatMessages} from '@/funcs/chatFuncs'


// import tgFileChip from '@/components/tgFileChip.vue'
import tgCard from './tgCard.vue';
import {getFileType, getIcon} from '@/funcs/commonFuncs'


const{updateUnseenCount}=useDataStore()
const{rels,allChatMessages}=storeToRefs(useDataStore())

const props=defineProps(['otherId', 'initMessageId'])

const scrollable=ref();

const showGoToBottom=ref(false)


function addFiles(){
  // files.value=[]
  for (var i=0;i<fileInput.value.files.length;i++){
    files.value.push(fileInput.value.files[i])
  }

}
const fileInput=ref()

const showUser=inject('showUser')
const chatsContainer=ref()


function removeFile(file){
  console.log(files.value)
  files.value = files.value.filter(h => h != file)
  console.log(files.value)
}

function removeAllFiles() {
  files.value=[]
}

var isInRel=false


const files=ref([]);



async function send(){
  if(!isInRel){
    try{await pb.collection('rels').create({follower:pb.authStore.model.id, following:props.otherId})}catch{}
    try{await pb.collection('rels').create({follower:props.otherId, following:pb.authStore.model.id})}catch{}
    isInRel=true
    // await pb.collection('rels').create({follower:pb.authStore.model.id, following:props.otherId})
  }
    var formData = new FormData();
    console.log(props.otherId)
    formData.append('from', pb.authStore.model.id)
    formData.append('to', props.otherId)
    formData.append('text', msg.value)
    formData.append('seen', false)

    for (const file of files.value){

      formData.append('files', file)
    }

    
    const record = await pb.collection('chatMessages').create(formData);
    msg.value=''
    files.value=[]

}

const msg=ref('')



// import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import tgUserDetails from './tgUserDetails.vue';

const sheet=ref(false)
const image=ref('')
var startEnabled=true
var endEnabled=true




// var searchedMessage;

initializeMessages();


onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{chatsContainer.value?.scrollIntoView({block:'center'});}})

onMounted(()=>{scrollable.value.addEventListener('scroll', scrollHandler)})

function scrollHandler(e){
  if(e.target.scrollTop==0 && startEnabled){
    previousScrollHeight=e.target.scrollHeight
    getPreviousMessages(e);console.log('start');}
  else if(e.target.scrollTop+e.target.clientHeight==e.target.scrollHeight && endEnabled){
    getNextMessages();console.log('end');}
  else{
    showGoToBottom.value = (endEnabled || e.target.scrollHeight - e.target.scrollTop > 5000) && (startScrollTop < e.target.scrollTop);
    startScrollTop=e.target.scrollTop;
  }
}

async function getPreviousMessages(e){
  try{
    isTop=true
    // const previous10Messages=(await pb.collection('chatMessages').getList(1,10,{filter:`(from = "${props.otherId}" || to = "${props.otherId}") && created < "${allChatMessages.value[props.otherId].messages[0].created}"`, sort: '-created'})).items.reverse()
    const previous10Messages= await getPreviousChatMessages(props.otherId,allChatMessages.value[props.otherId].messages[0].created)
    if(previous10Messages.length<10){startEnabled=false;isTop=false};
      allChatMessages.value[props.otherId].messages=[...previous10Messages, ...allChatMessages.value[props.otherId].messages]


    }
    catch{}
}

async function getNextMessages(){
    try{
      isTop=false
      // const new10Messages=(await pb.collection('chatMessages').getList(1,10,{filter:`(from = "${props.otherId}" || to = "${props.otherId}") && created > "${allChatMessages.value[props.otherId].messages.at(-1).created}"`, sort: 'created'})).items
      const new10Messages= await getNextChatMessages(props.otherId,allChatMessages.value[props.otherId].messages.at(-1).created)
      allChatMessages.value[props.otherId].messages=[...allChatMessages.value[props.otherId].messages, ...new10Messages]
      if(new10Messages.length<10){
  endEnabled=false;
subscribeToNewMessages()}
    }
    catch{}
}

onUpdated(()=>{if(isTop){scrollable.value.scrollTop=scrollable.value.scrollHeight-previousScrollHeight;previousScrollHeight=scrollable.value.scrollHeight;isTop=false;}else if(isGoToBottom){scrollable.value.scrollTop=scrollable.value.scrollHeight;isGoToBottom=false;showGoToBottom.value=false;}})

var isTop=false;
var isGoToBottom=false
var previousScrollHeight;







async function goToBottom(){
  if(endEnabled){
  startEnabled=true
  endEnabled=false
  allChatMessages.value[props.otherId].messages= await getLastChatMessages(props.otherId)
  isGoToBottom=true
  const date = allChatMessages.value[props.otherId].messages.at(-1).created
    if(new Date(allChatMessages.value[props.otherId].lastSeen) < new Date(date)){
    allChatMessages.value[props.otherId].lastSeen=date;
    pb.collection('rels').update(allChatMessages.value[props.otherId].relId,{lastseen:date})
    }
  subscribeToNewMessages()
  if(allChatMessages.value[props.otherId].messages.length<10)startEnabled=false;}
  else{scrollable.value.scrollTop=scrollable.value.scrollHeight;showGoToBottom.value=false;}
}
var startScrollTop=0

function subscribeToNewMessages(){
  // pb.collection('chatMessages').subscribe('*', function (e) {
  //   if(e.action=='create' && (e.record.from == props.otherId || e.record.to == props.otherId)){
  //     allChatMessages.value[props.otherId].messages.push(e.record)
  //   }})
  allChatMessages.value[props.otherId].cacheNewMessages=true
}





  const observer=new IntersectionObserver((e)=>{
    const date = e.filter(i=>i.isIntersecting).at(-1).target.attributes.created.value;
    if(!(new Date(date).getTime() <= new Date(allChatMessages.value[props.otherId].lastSeen).getTime())){
      allChatMessages.value[props.otherId].lastSeen=date;
      pb.collection('rels').update(allChatMessages.value[props.otherId].relId,{lastseen:date})
    }},{threshold:1,root:scrollable.value});




function attachNewIntersectionTargets(){
  allChatMessages.value[props.otherId].messages.slice(-10).forEach(msg => {
    observer.observe(document.getElementById(msg.id))
  });
}

onUpdated(attachNewIntersectionTargets)


onUnmounted(()=>updateUnseenCount(props.otherId))

async function initializeMessages(){
  try{
  if(props.initMessageId){

    // searchedMessage=await pb.collection('chatMessages').getOne(props.initMessageId);
    // allChatMessages.value[props.otherId].messages=(await pb.collection('chatMessages').getList(1,10,{filter:`(from = "${props.otherId}" || to = "${props.otherId}") && created <= "${searchedMessage.created}"`, sort: '-created'})).items.reverse();

    allChatMessages.value[props.otherId].messages.push(await getChatMessageById(props.initMessageId))
  }
  else{

    // allChatMessages.value[props.otherId].messages=(await pb.collection('chatMessages').getList(1,10,{filter:`(from = "${props.otherId}" || to = "${props.otherId}") && created <= "${allChatMessages.value[props.otherId].lastSeen}"`, sort: '-created'})).items.reverse();
    allChatMessages.value[props.otherId].messages= await getLastChatMessages(props.otherId,allChatMessages.value[props.otherId].lastSeen)

  }


  if(allChatMessages.value[props.otherId].messages.length<10){
    startEnabled=false;
    isTop=false;
    try{
      // const extraChats=(await pb.collection('chatMessages').getList(1,10,{filter:`(from = "${props.otherId}" || to = "${props.otherId}") && created > "${allChatMessages.value[props.otherId].messages.at(-1).created}"`, sort: 'created'})).items
      const extraChats= await getNextChatMessages(props.otherId,allChatMessages.value[props.otherId].messages.at(-1).created ?? 0)
      allChatMessages.value[props.otherId].messages=[...allChatMessages.value[props.otherId].messages, ...extraChats]
    }
    catch{}
  }

}
catch(e){
  console.log('errrooooorrr..... : ',e)
  startEnabled=false;
  isTop=false;
  // allChatMessages.value[props.otherId].messages=(await pb.collection('chatMessages').getList(1,10,{filter:`(from = "${props.otherId}" || to = "${props.otherId}")`, sort: 'created'})).items
  allChatMessages.value[props.otherId].messages= await getNextChatMessages(props.otherId)
}

if(allChatMessages.value[props.otherId].messages.length<10){
  endEnabled=false;
subscribeToNewMessages()}

console.log(props)
console.log(allChatMessages.value)
}


const isRecording=ref(false);
const isPaused=ref(false);
var chunks=[];
var mediaRecorder;



function startRecording() {
  if (navigator.mediaDevices?.getUserMedia) {
  console.log("getUserMedia supported.");
  navigator.mediaDevices
    .getUserMedia(
      // constraints - only audio needed for this app
      {
        audio: true,
      },
    )

    // Success callback
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

    // Error callback
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


</script>