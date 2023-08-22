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


async function send(){
    chats.value.push({you:true,msg:msg.value})
    console.log(other)
    const record = await pb.collection('messages').create({
    "from": pb.authStore.model.id,
    "to": other.value.id,
    "text": msg.value,
    "seen": false
});

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