<template><slot></slot></template>

<script setup>
import { watchEffect } from "vue";
import {storeToRefs} from 'pinia'
import {useDataStore} from '@/store/dataStore'
import {useAuthStore} from '@/store/authStore'
import pb from "@/main";
import { useRouter } from 'vue-router';

const{isLoggedIn,authData}=storeToRefs(useAuthStore())
const{updateRels,updateAllMessages}=useDataStore()
const{allChatMessages}=storeToRefs(useDataStore())

watchEffect(async()=>{
    if(!isLoggedIn.value)return;
    console.log('s...')
    await updateRels()
    await updateAllMessages()
    console.log('e...')


    pb.collection('users').subscribe('*',(e)=>{try{allChatMessages.value[e.record.id].lastVisited=e.record.lastvisited;allChatMessages.value[e.record.id].isOnline=true}catch{}})
    setInterval(()=>{for(const index in allChatMessages.value){
    allChatMessages.value[index].isOnline=(new Date().getTime()-new Date(allChatMessages.value[index].lastVisited).getTime())<6900
    }},5000)


    setInterval(()=>{pb.collection('users').update(authData.value.id,{lastvisited:new Date().toISOString().replace('T',' ')})},3000)

    // pb.collection('rels').subscribe('*',(e)=>{try{allChatMessages.value[e.record.follower].otherLastSeen=e.record.lastseen}catch{}})
    pb.collection('rels').subscribe('*',async(e)=>{
        console.log(e)
        
        if(e.record.follower==authData.value.id && e.action=='create'){
                allChatMessages.value[e.record.following]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:true,lastSeen:null,lastVisited:null,isOnline:false,relId:e.record.id,backRelId:null,otherLastSeen:null};
                allChatMessages.value[e.record.following].other= await pb.collection('user').getFirstListItem(`id = "${e.record.following}"`)
            // allChatMessages.value[e.record.following].lastSeen=e.record.lastseen
        }
            else if(e.record.following==authData.value.id){
                if(e.action=='create'){
                    allChatMessages.value[e.record.follower]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:true,lastSeen:null,lastVisited:null,isOnline:false,relId:null,backRelId:e.record.id,otherLastSeen:null};
                    allChatMessages.value[e.record.follower].other= await pb.collection('user').getFirstListItem(`id = "${e.record.follower}"`)
                }allChatMessages.value[e.record.follower].otherLastSeen=e.record.lastseen
            }
        })

    pb.collection('chatMessages').subscribe('*',(e)=>{
        const index=(e.record.from==authData.value.id ? e.record.to : e.record.from);
        if(e.action=='create'){
            if(allChatMessages.value[index].cacheNewMessages)allChatMessages.value[index].messages.push(e.record);
            allChatMessages.value[index].unseenCount++;allChatMessages.value[index].lastMessage=e.record;}
            else if(e.action=='update' && e.record.created>=allChatMessages.value[index].messages[0].created && e.record.created<=allChatMessages.value[index].messages.at(-1).created)allChatMessages.value[index].messages[allChatMessages.value[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete')allChatMessages.value[index].messages=allChatMessages.value[index].messages.filter(msg=>{msg.id != e.record.id})})

    // pb.collection('chatMessages').subscribe('*',(e)=>{if(e.action=='create'){const index=e.record.from==authData.id?e.record.to:e.record.from;allChatMessages.value[index]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null,lastVisited:null,isOnline:false,relId:null,backRelId:null,otherLastSeen:null};allChatMessages.value[index].lastMessage=e.record.text}})

})

// if(!isLoggedIn.value)useRouter().push({name:'login'});


</script>