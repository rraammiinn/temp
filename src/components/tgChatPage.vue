<template>
  <tg-user-page v-show="showUser"></tg-user-page>

<div class="main">

<v-infinite-scroll v-on="{load:(startEnabled||endEnabled)?load:null}" ref="iScroll" :side="scrollSide">
  <!-- <template #loading></template> -->
  <div style="padding-bottom: 3rem;" ref="chatsContainer">
<template v-for="chat in allChats" :key="chat.id">
    <v-card :id="chat.id" elevation="10" color="var(--tgBrown)" style="width: fit-content;" :class="{fromYou:(chat.from==pb.authStore.model.id), card:true}"  :text="chat.text" :title="getUserFromId(chat.from).name" :prepend-avatar="`/api/files/users/${chat.from}/${getUserFromId(chat.from).avatar}`">
      <v-divider v-if="chat.files.length"></v-divider>
      <div v-if="chat.files.length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: center;">
        <template  v-for="file in chat.files" :key="file">
          <img @click="sheet = !sheet;image=`/api/files/messages/${chat.id}/${file}`" style="border-radius: .3rem;margin: .5rem;height: 8rem;" :src="`/api/files/messages/${chat.id}/${file}`">
        </template>
      </div>
      <!-- <template  v-for="file in chat.files" :key="file">
        <v-img @click="sheet = !sheet;image=`/api/files/messages/${chat.id}/${file}`" width="calc(100%-1rem)" style="border-radius: .3rem;margin: .5rem;" :src="`/api/files/messages/${chat.id}/${file}`"></v-img>
      </template> -->
    </v-card>
</template>
</div>
</v-infinite-scroll>



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
        @click:append-inner="send"
        v-model="msg"
        prepend-inner-icon="mdi-image"
        @click:prepend-inner="selectFile"
        ></v-textarea>

    </div>
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
    margin-left: auto;
}
</style>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import pb from '@/main';

// const side=ref('both')
const showUser=inject('showUser')
const iScroll=ref()
const chatsContainer=ref()
// iScroll.value.scrollTop=10;
onMounted(()=>{
  if(initChatId){document.getElementById(initChatId.value).scrollIntoView({block:'center'});}else{chatsContainer.value.scrollIntoView({block:'center'});}})

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
      formData.append('files', await handler.getFile())
    }

    
    const record = await pb.collection('messages').create(formData);

}

const msg=ref('')



import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll'
import TgUserPage from './tgUserPage.vue';

const sheet=ref(false)
const image=ref('')
const startEnabled=ref(true)
const endEnabled=ref(true)
const scrollSide = computed(()=>{if(startEnabled.value && endEnabled.value)return 'both'; else if(startEnabled.value)return 'start'; else if(endEnabled.value)return 'end'; else return '';})




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

async function load ({ side, done }) {
  console.log('side : ',side)
  var new10Chats=[]
  if(side=='end' && endEnabled.value){
    // startEnabled=false
    console.log('enddddd.....')
    console.log(endEnabled.value)
    console.log(scrollSide)
    // endEnabled=false
    try{
      // startEnabled=false
    new10Chats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created > "${chats.value[chats.value.length-1].created}"`, sort: 'created'})).items
    if(!new10Chats.length){
      endEnabled.value=false;
      pb.collection('messages').subscribe('*', function (e) {
    if(e.action=='create' && (e.record.from == other.value.id || e.record.to == other.value.id)){
        newChats.value.push(e.record)
    }
});}
    chats.value=[...chats.value, ...new10Chats]
    }
    catch{}
    // console.log('new chats : ', newChats)


    // startEnabled=true
    // endEnabled=true
  }
  if(side=='start' && startEnabled.value){
    // startEnabled=false
    // endEnabled=false
    try{
      // endEnabled=false
    new10Chats=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created < "${chats.value[0].created}"`, sort: '-created'})).items.toReversed()
    if(!new10Chats.length)startEnabled.value=false;
    chats.value=[...new10Chats, ...chats.value]
    }
    catch{}
    console.log('new chats : ', new10Chats)
    // startEnabled=true
    // endEnabled=true
  }

  // console.log('new chats : ', newChats)

// setTimeout(() => {
//   done('ok');
// }, 100);



// console.log('chats : ',chats.value)
done('ok');
}


const chats=ref([])
const newChats=ref([])
const allChats=computed(()=>[...chats.value, ...newChats.value])
var initChat=[]
const initChatId=inject('initChatId')

try{
  if(initChatId.value){
    initChat[0]=await pb.collection('messages').getOne(initChatId.value)
  }
  else{
    initChat[0]=await pb.collection('messages').getFirstListItem(`(from = "${other.value.id}" || to = "${other.value.id}") && seen = true`, {sort: '-created'})
  }


initChat=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}") && created <= "${initChat[0].created}"`, sort: '-created'})).items.toReversed()
  if(initChat.length<10){
    startEnabled.value=false
    // side.value='end'
  }

}
catch{
  startEnabled.value=false
  // side.value='end'
  initChat=(await pb.collection('messages').getList(1,10,{filter:`(from = "${other.value.id}" || to = "${other.value.id}")`, sort: 'created'})).items
}
chats.value=initChat

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
</script>