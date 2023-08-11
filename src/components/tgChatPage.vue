<template>
    <div class="main">

    <v-card style="width: fit-content;" :class="{fromYou:chat.you, card:true}" v-for="chat in chats" :text="chat.msg"></v-card>

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
import { ref } from 'vue';

const chats=ref([
    {you:true,msg:'lorcdc  cdcidc           dccccccccccccccccccccccnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuucccccucuccddddddddddddwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxccccccc ...njgnnghhhhhhhhkm4jn5hhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjllllllllllllllllllllllllllllllllllllllllrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'},
    {you:false,msg:'cddddddddddddd   cccccccccccccccccccccccccccccnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuucccccucuccddddddddddddwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxcccccccccc asoijhijj ...njgnnghhhhhhhhkm4jn5hhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjllllllllllllllllllllllllllllllllllllllllrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'},
    {you:true,msg:'ojdcodo dcjdn cdciiiiiiiic  dddddddddddddddddnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuucccccucuccddddddddddddwwwwwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxcddddddddddddddddddddddddddddddiic c . ...njgnnghhhhhhhhkm4jn5hhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjllllllllllllllllllllllllllllllllllllllllrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'}
])


function send(){
    chats.value.push({you:true,msg:msg.value})
}

const msg=ref('')
</script>