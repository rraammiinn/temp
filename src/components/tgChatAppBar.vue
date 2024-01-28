<template>
    <v-btn @click="if(!showUser)$router.back();showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-badge :content="allChatsData.allMessages[props.otherId].isOnline ? 'online' : 'offline'" :color="allChatsData.allMessages[props.otherId].isOnline ? 'primary' : null"><v-avatar @click="showUser=true;" :image="`/api/files/users/${props.otherId}/${allChatsData.allMessages[props.otherId].other.avatar}`"></v-avatar></v-badge>
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

const {allChatsData}=storeToRefs(useDataStore())

const props=defineProps(['otherId'])

const showUser=inject('showUser')
// const allChatsData=inject('allChatsData')

// var lastseen=0;
// const isOnline=ref(false)
// pb.collection('users').subscribe(props.otherId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>