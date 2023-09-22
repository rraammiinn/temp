<template><slot></slot></template>

<script setup>
import { watchEffect } from "vue";
import {storeToRefs} from 'pinia'
import {useDataStore} from '@/store/dataStore'
import {useAuthStore} from '@/store/authStore'
import pb from "@/main";

const{isLoggedIn,authData}=storeToRefs(useAuthStore())
const{updateRels,updateAllMessages,allChatMessages}=useDataStore()

watchEffect(async()=>{
    if(!isLoggedIn.value)return;
    console.log('s...')
    await updateRels()
    await updateAllMessages()
    console.log('e...')


    pb.collection('users').subscribe('*',(e)=>{try{allChatMessages[e.record.id].lastVisited=e.record.lastvisited;allChatMessages[e.record.id].isOnline=true}catch{}})
    setInterval(()=>{for(const index in allChatMessages){
    allChatMessages[index].isOnline=(new Date().getTime()-new Date(allChatMessages[index].lastVisited).getTime())<6000
    }},1000)


    setInterval(()=>{pb.collection('users').update(authData.value.id,{lastvisited:new Date().toISOString().replace('T',' ')})},5000)


})



</script>