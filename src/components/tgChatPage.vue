<template>
  <tg-user-page v-show="showUser"></tg-user-page>

<div class="main">

  <div ref="scrollable"  class="scrollable" style="width: 90vw; height: 100vh;position: fixed;bottom: 0;overflow-y: scroll;">
    <div style="padding-top: 5rem;padding-bottom: 5rem;display: flex;flex-direction: column;">
    <template v-for="chat,i in allChats" :key="chat.id">
      <v-chip v-if="chat.created.slice(0,10) != allChats[i-1]?.created.slice(0,10)" style="width: fit-content;margin: auto;" color="var(--tgBrown)">{{ chat.created.slice(0,10) }}</v-chip>
    <v-card :id="chat.id" elevation="10" color="var(--tgBrown)" style="width: fit-content;" :class="{fromYou:(chat.from==pb.authStore.model.id), card:true}"  :text="chat.text" :title="getUserFromId(chat.from).name" :prepend-avatar="`/api/files/users/${chat.from}/${getUserFromId(chat.from).avatar}`">
      <v-divider v-if="chat.files.length"></v-divider>
      <div v-if="chat.files.length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: center;">
        <template  v-for="file in chat.files" :key="file">
          <img @click="sheet = !sheet;image=`/api/files/messages/${chat.id}/${file}`" style="border-radius: .3rem;margin: .5rem;height: 8rem;" :src="`/api/files/messages/${chat.id}/${file}`">
        </template>
      </div>
      <div style="padding: 1rem;display: flex;justify-content: space-between;opacity: .5;font-size: .5rem;font-weight: bold;">
        <span>{{chat.created.slice(11,16)}}</span>
        <v-icon v-if="chat.from==pb.authStore.model.id" :icon="chat.seen ? 'mdi-check-all' : 'mdi-check'"></v-icon>
      </div>
    </v-card>
</template>
</div>
  </div>


<!-- <v-infinite-scroll v-on="{load:(startEnabled||endEnabled)?load:null}" ref="iScroll" :side="scrollSide">
  <template #loading><v-progress-linear indeterminate></v-progress-linear></template>
  <div style="padding-bottom: 3rem;" ref="chatsContainer">
<template v-for="chat in allChats" :key="chat.id">
    <v-card :id="chat.id" elevation="10" color="var(--tgBrown)" style="width: fit-content;" :class="{fromYou:(chat.from==pb.authStore.model.id), card:true}"  :text="chat.text" :title="getUserFromId(chat.from).name" :prepend-avatar="`/api/files/users/${chat.from}/${getUserFromId(chat.from).avatar}`">
      <v-divider v-if="chat.files.length"></v-divider>
      <div v-if="chat.files.length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: center;">
        <template  v-for="file in chat.files" :key="file">
          <img @click="sheet = !sheet;image=`/api/files/messages/${chat.id}/${file}`" style="border-radius: .3rem;margin: .5rem;height: 8rem;" :src="`/api/files/messages/${chat.id}/${file}`">
        </template>
      </div>
    </v-card>
</template>
</div>
</v-infinite-scroll> -->



    <v-bottom-sheet v-model="sheet">
      <v-img style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;" max-width="100vw" max-height="85vh" :src="image"></v-img>
      <div style="width: 100%;">
      <v-btn style="border-radius: 0;" color="error" width="50%" prepend-icon="mdi-close" @click="sheet=false">close</v-btn>
      <a style="text-decoration: none;" :href="image"><v-btn style="border-radius: 0;" width="50%" color="primary" prepend-icon="mdi-download" @click="sheet=false">download</v-btn></a>
      </div>

    </v-bottom-sheet>


      <div v-if="handlers.length" style="position: fixed;bottom: 0;height: 6.25rem;width: 90%;background-color:var(--tgBg) ;"></div>

      <div style="position: fixed;bottom: 0;height: 3.5rem;width: 90%;background-color:var(--tgBg) ;overflow: auto;white-space: nowrap;overflow-y: hidden;">
        <v-chip v-for="handler in handlers" :key="handler"

        @click:close="removeFile(handler)"
      class="ma-2"
      closable
      color="var(--tgBrown)"
      close-icon="mdi-delete"
      prepend-icon="mdi-image"
      :model-value="true"
    >
      {{ handler.name }}
    </v-chip>
      </div>

      <v-textarea
      :style="{position: 'fixed',bottom: (handlers.length)? '3.5rem':'.75rem',width: '90%'}"
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
    <input multiple accept="image/*" ref="fileInput" @change="upload_" type="file" hidden>

    <v-btn v-show="showGoToBottom" @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;position: fixed;right: 1.5rem;" color="primary" size="3.5rem" elevation="24" :style="{bottom: (handlers.length)? '8rem':'5.25rem'}"></v-btn>


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
    /* margin-left: auto; */
    align-self: flex-end;
}
</style>

<script setup>
import { ref, inject, onMounted, computed, onUpdated } from 'vue';
import pb from '@/main';

// const side=ref('both')
const initChatId=inject('initChatId')
const showGoToBottom=ref(false)


function upload_(){
  handlers.value=[]
  for (var i=0;i<fileInput.value.files.length;i++){
    handlers.value.push(fileInput.value.files[i])
  }
  // fileInput.value.files.forEach(file => {
  //   handlers.value.append(structuredClone(file))
  // });
}
const fileInput=ref()

const showUser=inject('showUser')
const iScroll=ref()
const chatsContainer=ref()
// iScroll.value.scrollTop=10;

function scrolll(){console.log('.....')}

function getUserFromId(id){
    return users.value.find(u=>u.id==id)
}

function removeFile(handler){
  console.log(handlers.value)
  handlers.value = handlers.value.filter(h => h != handler)
  console.log(handlers.value)
}

const other=inject('other')
// const chats=inject('chats')
const users=inject('users')
const rels=inject('rels')


var isInRel=false
for(const rel of rels.value){
  if(rel.follower == other.value.id || rel.following == other.value.id) {isInRel=true;}
}

var files=[];
const handlers=ref([]);

async function selectFile(){
    const pickerOpts = {
  types: [
    {
      description: "avatar",
      accept: {
        "image/*": [],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: true,
};


    handlers.value = await window.showOpenFilePicker(pickerOpts)
    files = handlers.value.map(async(handler) => await handler.getFile())
    console.log(files)

    // formData.append('avatar', image);
    // await pb.collection('users').update(pb.authStore.model.id, formData);

}


async function send(){
  if(!isInRel){
    await pb.collection('rels').create({follower:pb.authStore.model.id, following:other.value.id})
  }
    var formData = new FormData();
    // chats.value.push({you:true,msg:msg.value})
    console.log(other)
    formData.append('from', pb.authStore.model.id)
    formData.append('to', other.value.id)
    formData.append('text', msg.value)
    formData.append('seen', false)

    for (const handler of handlers.value){

      formData.append('files', handler)
    }

    
    const record = await pb.collection('messages').create(formData);
    msg.value=''
    handlers.value=[]

}

const msg=ref('')



import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll'
import TgUserPage from './tgUserPage.vue';

const sheet=ref(false)
const image=ref('')
// const startEnabled=ref(true)
// const endEnabled=ref(true)
var startEnabled=true
var endEnabled=true
// const scrollSide = computed(()=>{if(startEnabled.value && endEnabled.value)return 'both'; else if(startEnabled.value)return 'start'; else if(endEnabled.value)return 'end'; else return '';})




// setTimeout(() => {
//   startEnabled=false
//   endEnabled=true
//   chatsContainer.value.scrollIntoView({block:'center'})
// }, 5000);

// setTimeout(() => {
//   startEnabled=true
//   endEnabled=true
//   chatsContainer.value.scrollIntoView({block:'center'})
// }, 5000);

// setInterval(() => {
//   startEnabled=!startEnabled
//   endEnabled=!endEnabled
// }, 1000);

// async function load ({ side, done }) {
//   console.log('side : ',side)
//   var new10Chats=[]
//   if(side=='end' && endEnabled.value){
//     console.log('enddddd.....')
//     console.log(endEnabled.value)
//     console.log(scrollSide)
//     try{
//     new10Chats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created > "${chats.value[chats.value.length-1].created}"`, sort: 'created'})).items
//     if(!new10Chats.length){
//       endEnabled.value=false;
//       pb.collection('messages').subscribe('*', function (e) {
//     if(e.action=='create' && (e.record.from == other.value.id || e.record.to == other.value.id)){
//         newChats.value.push(e.record)
//     }
// });}
//     chats.value=[...chats.value, ...new10Chats]
//     }
//     catch{}

//     done('ok');
//   }
//   if(side=='start' && startEnabled.value){
//     startEnabled.value=false
//     endEnabled.value=false
//     const chatId=chats.value[1].id
//         document.getElementById(chatId)?.scrollIntoView({block:'start'});

  
//     try{
//     new10Chats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created < "${chats.value[0].created}"`, sort: '-created'})).items.reverse()
//     setTimeout(() => {
//       chats.value=[...new10Chats, ...chats.value]
//       document.getElementById(chatId)?.scrollIntoView({block:'start'});
//       startEnabled.value = !!new10Chats.length
//       done('ok');
//     }, 100);
//     }
//     catch{}
//     console.log('new chats : ', new10Chats)

//     endEnabled.value=true
//   }

// }


const chats=ref([])
const newChats=ref([])
const allChats=computed(()=>[...chats.value, ...newChats.value])
var initChat=[]

try{
  if(initChatId.value){
    initChat[0]=await pb.collection('messages').getOne(initChatId.value)
  }
  else{
    initChat[0]=await pb.collection('messages').getFirstListItem(`(from = "${other.value.id}" || to = "${other.value.id}") && seen = true`, {sort: '-created'})
  }


initChat=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created <= "${initChat[0].created}"`, sort: '-created'})).items.reverse()
  if(initChat.length<10){
    // startEnabled.value=false
    startEnabled=false;
    isTop=false;
    try{
      const extraChats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created > "${initChat[initChat.length-1].created}"`, sort: 'created'})).items
      initChat=[...initChat, ...extraChats]
    }
    catch{}
    // side.value='end'
  }

}
catch(e){
  console.log('errrooooorrr..... : ',e)
  // startEnabled.value=false
  startEnabled=false;
  isTop=false;
  // side.value='end'
  initChat=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}")`, sort: 'created'})).items
}
chats.value=initChat

if(initChat.length<10){
  endEnabled=false;
subscribeToNewChats()}

// if(!initChat[0]){
//   startEnabled=false
//   initChat=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}")`, sort: 'created'})).items
// }
// else{
//   initChat=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created <= "${initChat[0].created}"`, sort: '-created'})).items.toReversed()
//   if(initChat.length<10){
//     startEnabled=false
//   }
//   chats.value=initChat

// }
// chats.value.append(initChat)
// if(!chats.value.length){
//   chats.value=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}")`, sort: '-created'})).items.toReversed()
// }
console.log(chats.value)


onMounted(()=>{if(initChatId.value){document.getElementById(initChatId.value)?.scrollIntoView({block:'center'});}else{chatsContainer.value?.scrollIntoView({block:'center'});}})

onMounted(()=>{scrollable.value.addEventListener('scroll', scrollHandler)})

function scrollHandler(e){
  if(e.target.scrollTop==0 && startEnabled){
    previousScrollHeight=e.target.scrollHeight
    getPreviousChats(e);console.log('start');}
  else if(e.target.scrollTop+e.target.clientHeight==e.target.scrollHeight && endEnabled){
    getNextChats();console.log('end');}
  else{
    showGoToBottom.value = (endEnabled || e.target.scrollHeight - e.target.scrollTop > 5000) && (startScrollTop < e.target.scrollTop);
    startScrollTop=e.target.scrollTop;
  }
}

async function getPreviousChats(e){
  try{
    isTop=true
    const previous10Chats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created < "${chats.value[0].created}"`, sort: '-created'})).items.reverse()
    if(previous10Chats.length<10){startEnabled=false;isTop=false};
      chats.value=[...previous10Chats, ...chats.value]

      // scrollHeight=e.target.scrollHeight
      // setTimeout(() => {
      //   e.target.scrollTop=e.target.scrollHeight-previousScrollHeight
      // }, 1000);
      // previousScrollHeight=e.target.scrollHeight
    }
    catch{}
}

async function getNextChats(){
    try{
      isTop=false
      const new10Chats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created > "${chats.value[chats.value.length-1].created}"`, sort: 'created'})).items
      chats.value=[...chats.value, ...new10Chats]
      if(new10Chats.length<10){
  endEnabled=false;
subscribeToNewChats()}
    }
    catch{}
}

onUpdated(()=>{if(isTop){scrollable.value.scrollTop=scrollable.value.scrollHeight-previousScrollHeight;previousScrollHeight=scrollable.value.scrollHeight;isTop=false;}else if(isGoToBottom){scrollable.value.scrollTop=scrollable.value.scrollHeight;isGoToBottom=false;showGoToBottom.value=false;}})

var isTop=false;
var isGoToBottom=false
var previousScrollHeight;
// var scrollHeight;




const scrollable=ref();



async function goToBottom(){
  if(endEnabled){
  startEnabled=true
  endEnabled=false
  chats.value=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}")`, sort: '-created'})).items.reverse()
  isGoToBottom=true
  subscribeToNewChats()
  if(chats.value.length<10)startEnabled=false;}
  else{scrollable.value.scrollTop=scrollable.value.scrollHeight;showGoToBottom.value=false;}
}
var startScrollTop=0

function subscribeToNewChats(){
  pb.collection('messages').subscribe('*', function (e) {
    if(e.action=='create' && (e.record.from == other.value.id || e.record.to == other.value.id)){
        newChats.value.push(e.record)
    }})
}
</script>