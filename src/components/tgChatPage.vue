<template>

    <div class="main">

<v-infinite-scroll side="both" @load="load">
<template v-for="chat in chats" :key="chat.id">
    <v-card elevation="10" color="var(--tgBrown)" style="width: fit-content;" :class="{fromYou:(chat.from==pb.authStore.model.id), card:true}"  v-if="chat.from==other.id || chat.to==other.id" :text="chat.text" :title="getUserFromId(chat.from).name" :prepend-avatar="`/api/files/users/${chat.from}/${getUserFromId(chat.from).avatar}`">

      <template  v-for="file in chat.files" :key="file">
        <v-img @click="sheet = !sheet;image=`/api/files/messages/${chat.id}/${file}`" width="calc(100%-1rem)" style="border-radius: .3rem;margin: .5rem;" :src="`/api/files/messages/${chat.id}/${file}`"></v-img>
      </template>
    </v-card>
</template>
</v-infinite-scroll>



    <v-bottom-sheet v-model="sheet">
      <v-img style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;" max-width="100vw" max-height="85vh" :src="image"></v-img>
      <div style="width: 100%;">
      <v-btn style="border-radius: 0;" color="error" width="50%" prepend-icon="mdi-close" @click="sheet=false">close</v-btn>
      <a style="text-decoration: none;" :href="image"><v-btn style="border-radius: 0;" width="50%" color="primary" prepend-icon="mdi-download" @click="sheet=false">download</v-btn></a>
      </div>

    </v-bottom-sheet>


      <div style="position: fixed;bottom: 0;height: 6.5rem;width: 90%;background-color:var(--tgBg) ;"></div>

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
      style="position: fixed;bottom: 3.5rem;width: 90%;"
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
        color="var(--tgBrown)"
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
    margin: 3rem;
    max-width: 80%;
    margin-top: 1rem;
    margin-bottom: 5rem;
}
.fromYou{
    margin-left: auto;
}
</style>

<script setup>
import { ref, inject } from 'vue';
import pb from '@/main';


function getUserFromId(id){
    return users.value.find(u=>u.id==id)
}

function removeFile(handler){
  console.log(handlers.value)
  handlers.value = handlers.value.filter(h => h != handler)
  console.log(handlers.value)
}

const other=inject('other')
const chats=inject('chats')
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
    chats.value.push({you:true,msg:msg.value})
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

const sheet=ref(false)
const image=ref('')


async function load ({ side, done }) {
  console.log(side)

  setTimeout(() => {
    done('ok')
  }, 1000);

}
</script>