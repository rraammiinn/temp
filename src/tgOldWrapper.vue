<template><slot></slot></template>

<script setup>
import { watchEffect } from "vue";
import {storeToRefs} from 'pinia'
import {useDataStore} from '@/store/dataStore'
import {useAuthStore} from '@/store/authStore'
import pb from "@/main";
import { useRouter } from 'vue-router';

const{isLoggedIn,authData}=storeToRefs(useAuthStore())
const{updateChatRels,updateGroupRels,updateGroups,updateAllMessages,updateGroupMems}=useDataStore()
const{allChatsData,
    // allGroupMessages,
    // allChannelMessages,
    // groupRels,
    // channelRels,
    // groups
}=storeToRefs(useDataStore())

watchEffect(async()=>{
    if(!isLoggedIn.value)return;
    console.log('s...')
    await updateChatRels()
    // await updateGroups()
    await updateAllMessages()
    // console.log('e...')
    // console.log('groups ---> ',groups.value)
    // console.log('agm ---> ',allGroupMessages.value)


    pb.collection('users').subscribe('*',(e)=>{try{allChatsData.value.allMessages[e.record.id].lastVisited=e.record.lastvisited;allChatsData.value.allMessages[e.record.id].isOnline=true}catch{}})
    setInterval(()=>{for(const index in allChatsData.value.allMessages){
    allChatsData.value.allMessages[index].isOnline=(new Date().getTime()-new Date(allChatsData.value.allMessages[index].lastVisited).getTime())<6900
    }},5000)


    setInterval(()=>{pb.collection('users').update(authData.value.id,{lastvisited:new Date().toISOString().replace('T',' ')})},3000)

    pb.collection('rels').subscribe('*',async(e)=>{
        console.log(e)
        
        if(e.record.follower==authData.value.id && e.action=='create'){
                allChatsData.value.allMessages[e.record.following]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:true,lastSeen:null,lastVisited:null,isOnline:false,relId:e.record.id,backRelId:null,otherLastSeen:null};
                allChatsData.value.allMessages[e.record.following].other= await pb.collection('users').getFirstListItem(`id = "${e.record.following}"`)
        }
            else if(e.record.following==authData.value.id){
                if(e.action=='create'){
                    allChatsData.value.allMessages[e.record.follower]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:true,lastSeen:null,lastVisited:null,isOnline:false,relId:null,backRelId:e.record.id,otherLastSeen:null};
                    allChatsData.value.allMessages[e.record.follower].other= await pb.collection('users').getFirstListItem(`id = "${e.record.follower}"`)
                }allChatsData.value.allMessages[e.record.follower].otherLastSeen=e.record.lastseen
            }
        })

    pb.collection('chatMessages').subscribe('*',(e)=>{
        console.log(':::new msg:::',e)
        
        const index=(e.record.from==authData.value.id ? e.record.to : e.record.from);

        console.log(':::old msgs:::',allChatsData.value.allMessages[index])

        if(e.action=='create'){
            if(allChatsData.value.allMessages[index].cacheNewMessages)allChatsData.value.allMessages[index].messages.push(e.record);
            allChatsData.value.allMessages[index].unseenCount++;allChatsData.value.allMessages[index].lastMessage=e.record;}
            else if(e.action=='update' && e.record.created>=allChatsData.value.allMessages[index].messages[0].created && e.record.created<=allChatsData.value.allMessages[index].messages.at(-1).created)allChatsData.value.allMessages[index].messages[allChatsData.value.allMessages[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete')allChatsData.value.allMessages[index].messages=allChatsData.value.allMessages[index].messages.filter(msg=>{msg.id != e.record.id})
            console.log(':::new msgs:::',allChatsData.value.allMessages[index])
        })






//     pb.collection('groupMembers').subscribe('*',async(e)=>{
//         if(groupRels.value.find(rel=>{rel.group==e.record.group}) && e.action=='create'){
//                 allGroupMessages.value[e.record.group].groupMems.push(await pb.collection('users').getFirstListItem(`id = "${e.record.mem}"`))
//         }
//         else if(e.record.mem==authData.value.id && e.action=='create'){
//             if(!allGroupMessages.value[e.record.group]){
//             allGroupMessages.value[e.record.group]={groupMems:{},lastMessage:null,group:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:e.record.lastseen || 0,relId:e.record.id,messagesType:'group'}
//             allGroupMessages.value[e.record.group].group= await pb.collection('groups').getOne(e.record.group)
//             }
//             allGroupMessages.value[e.record.group].relId=e.record.id
//             allGroupMessages.value[e.record.group].lastMessage= await pb.collection('groupMessages').getFirstListItem(`group = "${e.record.group}"`, {sort:'-created',expand:'from'})
//         }
//         })
})



// pb.collection('groupMessages').subscribe('*',async(e)=>{
//         const index=e.record.group;
//         if(e.action=='create'){
//             if(!allGroupMessages.value[index].groupMems[e.record.from]){await updateGroupMems(e.record.group)}
//             if(allGroupMessages.value[index].cacheNewMessages)allGroupMessages.value[index].messages.push(e.record);
//             allGroupMessages.value[index].unseenCount++;allGroupMessages.value[index].lastMessage=e.record;allGroupMessages.value[index].lastMessage['expand']={from:allGroupMessages.value[index].groupMems[e.record.from]}}
//             else if(e.action=='update' && e.record.created>=allGroupMessages.value[index].messages[0].created && e.record.created<=allGroupMessages.value[index].messages.at(-1).created)allGroupMessages.value[index].messages[allGroupMessages.value[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
//             else if(e.record.action='delete')allGroupMessages.value[index].messages=allGroupMessages.value[index].messages.filter(msg=>{msg.id != e.record.id})})


//             pb.collection('channelMessages').subscribe('*',(e)=>{
//         const index=e.record.channel;
//         if(e.action=='create'){
//             if(allChannelMessages.value[index].cacheNewMessages)allChannelMessages.value[index].messages.push(e.record);
//             allChannelMessages.value[index].unseenCount++;allChannelMessages.value[index].lastMessage=e.record;}
//             else if(e.action=='update' && e.record.created>=allChannelMessages.value[index].messages[0].created && e.record.created<=allChannelMessages.value[index].messages.at(-1).created)allChannelMessages.value[index].messages[allChannelMessages.value[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
//             else if(e.record.action='delete')allChannelMessages.value[index].messages=allChannelMessages.value[index].messages.filter(msg=>{msg.id != e.record.id})})




</script>