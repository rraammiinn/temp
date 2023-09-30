<template>
    <v-btn @click="if(!showUser)$router.back();showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-badge :content="allChatMessages[props.otherId].isOnline ? 'online' : 'offline'" :color="allChatMessages[props.otherId].isOnline ? 'primary' : null"><v-avatar @click="showUser=true;" :image="`/api/files/users/${props.otherId}/${allChatMessages[props.otherId].other.avatar}`"></v-avatar></v-badge>
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
import {storeToRefs} from 'pinia'

import {useDataStore} from '@/store/dataStore'

const {allChatMessages}=storeToRefs(useDataStore())

const props=defineProps(['otherId'])

const showUser=inject('showUser')
// const allChatMessages=inject('allChatMessages')

// var lastseen=0;
// const isOnline=ref(false)
// pb.collection('users').subscribe(props.otherId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>