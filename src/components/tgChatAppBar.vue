<template>
    <v-btn @click="if(!showUser)$router.back();showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-badge :content="isOnline ? 'online' : 'offline'" :color="isOnline ? 'var(--tgGreen)' : 'gray'"><v-avatar @click="showUser=true;previousPage='chat';" :image="`/api/files/users/${props.other}/${allMessages[props.other].other.avatar}`"></v-avatar></v-badge>
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<style scoped>
.listItem{
    background-color: var(--tgBg);
}
.listItem:hover{
    background-color: var(--tgBg);
}
</style>

<script setup>
import {inject,ref} from 'vue';
import pb from '@/main';
const currentPage=inject('currentPage')
const props=defineProps(['other'])

const showUser=inject('showUser')
const previousPage=inject('previousPage')
const allMessages=inject('allMessages')

var lastseen=0;
const isOnline=ref(false)
pb.collection('users').subscribe(props.other, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>