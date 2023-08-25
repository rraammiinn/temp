<template>
        <!-- <v-progress-linear
        :active="true"
        :indeterminate="true"
        absolute
        bottom
        color="primary"
      ></v-progress-linear> -->
    <div class="main">
<template v-for="chat in chats">
    <v-card elevation="10" color="#c78c55" style="width: fit-content;" :class="{fromYou:(chat.from==pb.authStore.model.id), card:true}"  v-if="chat.from==other.id || chat.to==other.id" :text="chat.text" :title="getUserFromId(chat.from).name" :prepend-avatar="`/api/files/users/${chat.from}/${getUserFromId(chat.from).avatar}`">
      <!-- <div style="display: flex;flex-wrap: wrap;justify-content: stretch;"> -->
      
      <template  v-for="file in chat.files">
        <!-- <v-divider></v-divider> -->
        <v-img @click="sheet = !sheet;image=`/api/files/messages/${chat.id}/${file}`" width="calc(100%-1rem)" style="border-radius: .3rem;margin: .5rem;" :src="`/api/files/messages/${chat.id}/${file}`"></v-img>
        <!-- <img style="border-radius: .3rem;margin: .5rem;height: 5rem;justify-self: stretch;display: block;" :src="`/api/files/messages/${chat.id}/${file}`"> -->
        <!-- <div style="background-image: `/api/files/messages/${chat.id}/${file}`;border-radius: .3rem;margin: .5rem;height: 10rem;justify-self: stretch;"></div> -->
      </template>
    <!-- </div> -->
    </v-card>
</template>



    <v-bottom-sheet v-model="sheet">
      <v-img style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;" max-width="100vw" max-height="85vh" :src="image"></v-img>
      <div style="width: 100%;">
      <v-btn color="error" style="width: 50%;" prepend-icon="mdi-close" @click="sheet=false">close</v-btn>
      <a style="text-decoration: none;" :href="image"><v-btn width="50%" color="primary" prepend-icon="mdi-download" @click="sheet=false">download</v-btn></a>
      </div>

    </v-bottom-sheet>

    <!-- <v-text-field style="position: fixed;bottom: 1rem;width: 90%;"
        :loading="loading"
        density="compact"
        variant="solo-filled"
        label="message"
        append-inner-icon="mdi-send"
        single-line
        hide-details
        @click:append-inner="send"
        v-model="msg"
        color="#96571d"
        prepend-inner-icon="mdi-image"
        @click:prepend-inner="selectFile"
      ></v-text-field> -->


      <v-textarea
      style="position: fixed;bottom: 1rem;width: 90%;"
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
        color="#c78c55"
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

const other=inject('other')
const chats=inject('chats')
const users=inject('users')

// const chats=ref([
//     {you:true,msg:'lorcdc  cdcidc           dccccccccccccccccccccccnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuucccccucuccddddddddddddwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxccccccc ...njgnnghhhhhhhhkm4jn5hhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjllllllllllllllllllllllllllllllllllllllllrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'},
//     {you:false,msg:'cddddddddddddd   cccccccccccccccccccccccccccccnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuucccccucuccddddddddddddwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxcccccccccc asoijhijj ...njgnnghhhhhhhhkm4jn5hhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjllllllllllllllllllllllllllllllllllllllllrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'},
//     {you:true,msg:'ojdcodo dcjdn cdciiiiiiiic  dddddddddddddddddnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuucccccucuccddddddddddddwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxcddddddddddddddddddddddddddddddiic c . ...njgnnghhhhhhhhkm4jn5hhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjllllllllllllllllllllllllllllllllllllllllrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'}
// ])

// const chats = ref(await pb.collection('messages').getFullList({
//     sort: 'created',
//     filter:`from = "${other.value.id}" || to = "${other.value.id}"`
// }));

var files=[];
var handlers=[];

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

    
    handlers = await window.showOpenFilePicker(pickerOpts)
    files = handlers.map(async(handler) => await handler.getFile())
    console.log(files)

    // formData.append('avatar', image);
    // await pb.collection('users').update(pb.authStore.model.id, formData);
 
}


async function send(){
    var formData = new FormData();
    chats.value.push({you:true,msg:msg.value})
    console.log(other)
    // files.forEach(file => formData.append('files', file))
    // formData.append('files', files)
    formData.append('from', pb.authStore.model.id)
    formData.append('to', other.value.id)
    formData.append('text', msg.value)
    formData.append('seen', false)

    for (const handler of handlers){
      formData.append('files', await handler.getFile())
    }

    
    const record = await pb.collection('messages').create(formData);

}

const msg=ref('')




// pb.collection('messages').subscribe('*', function (e) {
//     // console.log(e.record);

//     if(e.action=='create' && (e.record.from==other.value.id || e.record.to==other.value.id)){
//         chats.value.push(e.record)
//     }
// });

// pb.collection('messages').unsubscribe();


import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
const sheet=ref(false)
const image=ref('')
</script>