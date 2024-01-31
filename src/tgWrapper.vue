<template><slot></slot></template>

<script setup>
import { watchEffect } from "vue";
import {storeToRefs} from 'pinia'
import {useDataStore} from '@/store/dataStore'
import {useAuthStore} from '@/store/authStore'
import pb from "@/main";
import { useRouter } from 'vue-router';
import { AllChannelsData, ChatData, GroupData } from "@/store/dataModels";

const{isLoggedIn,authData}=storeToRefs(useAuthStore())
const{updateChatRels,updateGroupRels,updateChannelRels,updateGroups,updateAllMessages,updateGroupMems}=useDataStore()
const{allChatsData,
    allGroupsData,
    allChannelsData
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
    await updateGroupRels()
    await updateChannelRels()
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
        if((e.record.follower==authData.value.id || e.record.following==authData.value.id)){
            if(e.action=='create'){
                const rel=pb.collection('rels').getFirstListItem(`follower = "${e.record.follower}" && following = "${e.record.following}"`, {expand:'follower,following'})
                const backRel=pb.collection('rels').getFirstListItem(`follower = "${e.record.following}" && following = "${e.record.follower}"`, {expand:'follower,following'})
                if(rel.active)allChatsData.value.allMessages[e.record.following]=new ChatData(rel,backRel);else return;
            }
        allChatsData.value.allMessages[e.record.follower].otherLastSeen=e.record.lastseen
        }
        console.log(e)
        
        // if(e.record.follower==authData.value.id && e.action=='create'){
        //         // allChatsData.value.allMessages[e.record.following]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:true,lastSeen:null,lastVisited:null,isOnline:false,relId:e.record.id,backRelId:null,otherLastSeen:null};
        //         // allChatsData.value.allMessages[e.record.following].other= await pb.collection('users').getFirstListItem(`id = "${e.record.following}"`)
        // }
        //     else if(e.record.following==authData.value.id){                
        //         if(e.action=='create'){
        //             // allChatsData.value.allMessages[e.record.follower]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:true,lastSeen:null,lastVisited:null,isOnline:false,relId:null,backRelId:e.record.id,otherLastSeen:null};
        //             // allChatsData.value.allMessages[e.record.follower].other= await pb.collection('users').getFirstListItem(`id = "${e.record.follower}"`)
        //         }
        //         // allChatsData.value.allMessages[e.record.follower].otherLastSeen=e.record.lastseen
        //     }
        })

    pb.collection('chatMessages').subscribe('*',(e)=>{
        const index=(e.record.from==authData.value.id ? e.record.to : e.record.from);
        if(e.action=='create'){
            if(allChatsData.value.allMessages[index].cacheNewMessages)allChatsData.value.allMessages[index].messages.push(e.record);
            allChatsData.value.allMessages[index].unseenCount++;allChatsData.value.allMessages[index].lastMessage=e.record;}
            else if(e.action=='update' && e.record.created>=allChatsData.value.allMessages[index].messages[0].created && e.record.created<=allChatsData.value.allMessages[index].messages.at(-1).created)allChatsData.value.allMessages[index].messages[allChatsData.value.allMessages[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete')allChatsData.value.allMessages[index].messages=allChatsData.value.allMessages[index].messages.filter(msg=>{msg.id != e.record.id})})






    pb.collection('groupMembers').subscribe('*',async(e)=>{
        if(allGroupsData.value.groupRels.find(groupRel=>{groupRel.group==e.record.group}) && e.action=='create'){
                allGroupsData.value.allMessages[e.record.group].groupMems.push(await pb.collection('users').getFirstListItem(`id = "${e.record.mem}"`))
        }
        else if(e.record.mem==authData.value.id && e.action=='create'){
            allGroupsData.value.allMessages[e.record.group]=new GroupData(await pb.collection('groupMembers').getFirstListItem({"mem":pb.authStore.model.id, "group":e.record.group},{expand:'mem,group'}))
            await allGroupsData.value.allMessages[e.record.group].init()
        }
        })
})



pb.collection('groupMessages').subscribe('*',async(e)=>{
        const index=e.record.group;
        if(e.action=='create'){
            if(!allGroupsData.value.allMessages[index].groupMems[e.record.from]){await updateGroupMems(e.record.group)}
            if(allGroupsData.value.allMessages[index].cacheNewMessages)allGroupsData.value.allMessages[index].messages.push(e.record);
            allGroupsData.value.allMessages[index].unseenCount++;allGroupsData.value.allMessages[index].lastMessage=e.record;allGroupsData.value.allMessages[index].lastMessage['expand']={from:allGroupsData.value.allMessages[index].groupMems[e.record.from]}}
            else if(e.action=='update' && e.record.created>=allGroupsData.value.allMessages[index].messages[0].created && e.record.created<=allGroupsData.value.allMessages[index].messages.at(-1).created)allGroupsData.value.allMessages[index].messages[allGroupsData.value.allMessages[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete')allGroupsData.value.allMessages[index].messages=allGroupsData.value.allMessages[index].messages.filter(msg=>{msg.id != e.record.id})})


            pb.collection('channelMessages').subscribe('*',(e)=>{
        const index=e.record.channel;
        if(e.action=='create'){
            if(AllChannelsData.value.allMessages[index].cacheNewMessages)AllChannelsData.value.allMessages[index].messages.push(e.record);
            AllChannelsData.value.allMessages[index].unseenCount++;AllChannelsData.value.allMessages[index].lastMessage=e.record;}
            else if(e.action=='update' && e.record.created>=AllChannelsData.value.allMessages[index].messages[0].created && e.record.created<=AllChannelsData.value.allMessages[index].messages.at(-1).created)AllChannelsData.value.allMessages[index].messages[AllChannelsData.value.allMessages[index].messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete')AllChannelsData.value.allMessages[index].messages=AllChannelsData.value.allMessages[index].messages.filter(msg=>{msg.id != e.record.id})})




</script>