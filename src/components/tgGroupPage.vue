<template>
    <!-- <tg-group-page :groupId="allGroupMessages[props.groupId].other" v-show="showGroup"></tg-group-page> -->
  
  <div class="main">
  
    <div ref="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;">
      <div style="padding-top: 5rem;padding-bottom: 5rem;display: flex;flex-direction: column;">
      <template v-for="message,i in allGroupMessages[props.groupId].messages" :key="message.id">
        <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(allGroupMessages[props.groupId].messages[i-1]?.created).toLocaleDateString()" style="width: fit-content;margin: auto;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>
      <v-card :created="message.created" :id="message.id" elevation="10" color="var(--tgBrown)" style="width: fit-content;" :class="{fromYou:(message.from==pb.authStore.model.id), card:true}"  :text="message.text" :title="(allGroupMessages[props.groupId]?.groupMems[message.from])?.name" :prepend-avatar="`/api/files/users/${message.from}/${(allGroupMessages[props.groupId]?.groupMems[message.from])?.avatar}`">
        <v-divider v-if="message.files.length"></v-divider>
        <div v-if="message.files.length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: center;">
          <template  v-for="file in message.files" :key="file">
            <img @click="sheet = !sheet;image=`/api/files/groupMessages/${message.id}/${file}`" style="border-radius: .3rem;margin: .5rem;height: 8rem;" :src="`/api/files/groupMessages/${message.id}/${file}`" onerror="this.style.display='none'">
          </template>
        </div>
        <div style="padding: 1rem;display: flex;justify-content: space-between;opacity: .5;font-size: .5rem;font-weight: bold;">
          <span>{{new Date(message.created).toLocaleTimeString([],{ hour12: false })}}</span>
          <!-- <v-icon v-if="message.from==pb.authStore.model.id" :icon="new Date(message.created).getTime() <= new Date(allGroupMessages[props.groupId].otherLastSeen).getTime() ? 'mdi-check-all' : 'mdi-check'"></v-icon> -->
        </div>
      </v-card>
  </template>
  </div>
    </div>
  
  
  
      <v-bottom-sheet v-model="sheet">
        <v-img style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;" max-width="100vw" max-height="85dvh" :src="image"></v-img>
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
        prepend-icon="mdi-image"
        :model-value="true"
      >
        {{ file.name }}
      </v-chip>
        </div>
  
        <v-textarea v-if="isMem"
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
          ></v-textarea>

          <v-btn v-else color="primary" @click="join" style="position: fixed;bottom: .75rem;width: 90%;">join</v-btn>
  
      </div>
      <input multiple accept="image/*" ref="fileInput" @change="addFiles" type="file" hidden>
  
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
  }
  .fromYou{
      align-self: flex-end;
  }
  </style>
  
  
  
  
  
  
  
  <script setup>
  import { ref, inject, onMounted, computed, onUpdated, onUnmounted } from 'vue';
  import pb from '@/main';
  import {storeToRefs} from 'pinia'
  
  import {useDataStore} from '@/store/dataStore'
  import {getGroupMessages,getGroupMessageById,getPreviousGroupMessages,getNextGroupMessages,getLastGroupMessages} from '@/funcs/groupFuncs'
  
  const{updateGroupUnseenCount,updateGroupMems}=useDataStore()
  const{rels,allGroupMessages}=storeToRefs(useDataStore())
  
  const props=defineProps(['groupId', 'initMessageId'])
  
  const scrollable=ref();
  
  const showGoToBottom=ref(false)

  await updateGroupMems(props.groupId)
  
  
  function addFiles(){
    // files.value=[]
    for (var i=0;i<fileInput.value.files.length;i++){
      files.value.push(fileInput.value.files[i])
    }
  
  }
  const fileInput=ref()
  
  const showGroup=inject('showGroup')
  const groupsContainer=ref()
  
  
  function removeFile(file){
    console.log(files.value)
    files.value = files.value.filter(h => h != file)
    console.log(files.value)
  }

  function removeAllFiles() {
  files.value=[]
}
  
  const isMem=ref(allGroupMessages.value[props.groupId].relId ?? false)
  
  
  const files=ref([]);
  
  
  
  async function send(){

      var formData = new FormData();
      console.log(props.groupId)
      formData.append('from', pb.authStore.model.id)
      formData.append('group', props.groupId)
      formData.append('text', msg.value)
  
      for (const file of files.value){
  
        formData.append('files', file)
      }
  
      
      const record = await pb.collection('groupMessages').create(formData);
      msg.value=''
      files.value=[]
  
  }
  
  const msg=ref('')
  
  
  
  // import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
  // import tgGroupDetails from './tgGroupDetails.vue';
  
  const sheet=ref(false)
  const image=ref('')
  var startEnabled=true
  var endEnabled=true
  
  
  
  
  // var searchedMessage;
  
  initializeMessages();
  
  
  onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{groupsContainer.value?.scrollIntoView({block:'center'});}})
  
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
      // const previous10Messages=(await pb.collection('groupMessages').getList(1,10,{filter:`(from = "${props.groupId}" || to = "${props.groupId}") && created < "${allGroupMessages.value[props.groupId].messages[0].created}"`, sort: '-created'})).items.reverse()
      const previous10Messages= await getPreviousGroupMessages(props.groupId,allGroupMessages.value[props.groupId].messages[0].created)
      if(previous10Messages.length<10){startEnabled=false;isTop=false};
        allGroupMessages.value[props.groupId].messages=[...previous10Messages, ...allGroupMessages.value[props.groupId].messages]
  
  
      }
      catch{}
  }
  
  async function getNextMessages(){
      try{
        isTop=false
        // const new10Messages=(await pb.collection('groupMessages').getList(1,10,{filter:`(from = "${props.groupId}" || to = "${props.groupId}") && created > "${allGroupMessages.value[props.groupId].messages.at(-1).created}"`, sort: 'created'})).items
        const new10Messages= await getNextGroupMessages(props.groupId,allGroupMessages.value[props.groupId].messages.at(-1).created)
        allGroupMessages.value[props.groupId].messages=[...allGroupMessages.value[props.groupId].messages, ...new10Messages]
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
    allGroupMessages.value[props.groupId].messages= await getLastGroupMessages(props.groupId)
    isGoToBottom=true
    const date = allGroupMessages.value[props.groupId].messages.at(-1).created
    if(new Date(allGroupMessages.value[props.groupId].lastSeen) < new Date(date)){
    allGroupMessages.value[props.groupId].lastSeen=date;
    pb.collection('groupMembers').update(allGroupMessages.value[props.groupId].relId,{lastseen:date})
    }
    subscribeToNewMessages()
    if(allGroupMessages.value[props.groupId].messages.length<10)startEnabled=false;}
    else{scrollable.value.scrollTop=scrollable.value.scrollHeight;showGoToBottom.value=false;}
  }
  var startScrollTop=0
  
  function subscribeToNewMessages(){
    // pb.collection('groupMessages').subscribe('*', function (e) {
    //   if(e.action=='create' && (e.record.from == props.groupId || e.record.to == props.groupId)){
    //     allGroupMessages.value[props.groupId].messages.push(e.record)
    //   }})
    allGroupMessages.value[props.groupId].cacheNewMessages=true
  }
  
  
  
  
  
    const observer=new IntersectionObserver((e)=>{
      const date = e.filter(i=>i.isIntersecting).at(-1).target.attributes.created.value;
      if(!(new Date(date).getTime() <= new Date(allGroupMessages.value[props.groupId].lastSeen).getTime())){
        allGroupMessages.value[props.groupId].lastSeen=date;
        pb.collection('groupMembers').update(allGroupMessages.value[props.groupId].relId,{lastseen:date})
      }},{threshold:1,root:scrollable.value});
  
  
  
  
  function attachNewIntersectionTargets(){
    allGroupMessages.value[props.groupId].messages.slice(-10).forEach(msg => {
      observer.observe(document.getElementById(msg.id))
    });
  }
  
  onUpdated(attachNewIntersectionTargets)
  
  
  onUnmounted(()=>{updateGroupUnseenCount(props.groupId);allGroupMessages.value[props.groupId].lastMessage['expand']={from:allGroupMessages.value[props.groupId].groupMems[allGroupMessages.value[props.groupId].lastMessage.from]}})
  
  async function initializeMessages(){
    try{
    if(props.initMessageId){
  
      // searchedMessage=await pb.collection('groupMessages').getOne(props.initMessageId);
      // allGroupMessages.value[props.groupId].messages=(await pb.collection('groupMessages').getList(1,10,{filter:`(from = "${props.groupId}" || to = "${props.groupId}") && created <= "${searchedMessage.created}"`, sort: '-created'})).items.reverse();
  
      allGroupMessages.value[props.groupId].messages.push(await getGroupMessageById(props.initMessageId))
    }
    else{
  
      // allGroupMessages.value[props.groupId].messages=(await pb.collection('groupMessages').getList(1,10,{filter:`(from = "${props.groupId}" || to = "${props.groupId}") && created <= "${allGroupMessages.value[props.groupId].lastSeen}"`, sort: '-created'})).items.reverse();
      allGroupMessages.value[props.groupId].messages= await getLastGroupMessages(props.groupId,allGroupMessages.value[props.groupId].lastSeen)
  
    }
  
  
    if(allGroupMessages.value[props.groupId].messages.length<10){
      startEnabled=false;
      isTop=false;
      try{
        // const extraGroups=(await pb.collection('groupMessages').getList(1,10,{filter:`(from = "${props.groupId}" || to = "${props.groupId}") && created > "${allGroupMessages.value[props.groupId].messages.at(-1).created}"`, sort: 'created'})).items
        const extraMessages= await getNextGroupMessages(props.groupId,allGroupMessages.value[props.groupId].messages.at(-1).created ?? 0)
        allGroupMessages.value[props.groupId].messages=[...allGroupMessages.value[props.groupId].messages, ...extraMessages]
      }
      catch{}
    }
  
  }
  catch(e){
    console.log('errrooooorrr..... : ',e)
    startEnabled=false;
    isTop=false;
    // allGroupMessages.value[props.groupId].messages=(await pb.collection('groupMessages').getList(1,10,{filter:`(from = "${props.groupId}" || to = "${props.groupId}")`, sort: 'created'})).items
    allGroupMessages.value[props.groupId].messages= await getNextGroupMessages(props.groupId)
  }
  
  if(allGroupMessages.value[props.groupId].messages.length<10){
    endEnabled=false;
  subscribeToNewMessages()}
  
  console.log(props)
  console.log(allGroupMessages.value)
  }


async function join(){
  try{const record = await pb.collection('groupMembers').create({"mem":pb.authStore.model.id, "group":props.groupId});
  isMem.value=true;
  allGroupMessages[props.groupId].relId=record.id
}
  catch{}}
  </script>