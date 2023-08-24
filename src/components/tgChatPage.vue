<template>
    <div class="main">
<template v-for="chat in chats">
    <v-card color="#96571d" style="width: fit-content;" :class="{fromYou:(chat.from==pb.authStore.model.id), card:true}"  v-if="chat.from==other.id || chat.to==other.id" :text="chat.text"></v-card>
</template>
    <v-text-field style="position: fixed;bottom: 1rem;width: 90%;"
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
      ></v-text-field>

    </div>
</template>


<style scoped>
.main{
    width: 90vw;
    margin: auto;
}
.card{
    margin: 5rem;
    max-width: 80%;
}
.fromYou{
    margin-left: auto;
}
</style>

<script setup>
import { ref, inject } from 'vue';
import pb from '@/main';

const other=inject('other')
const chats=inject('chats')
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
</script>