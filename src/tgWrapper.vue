<template><slot></slot></template>

<script setup>
import { watchEffect, onBeforeUnmount, onUnmounted, onActivated, ref, provide } from "vue";
import {storeToRefs} from 'pinia'
import {useDataStore} from '@/store/dataStore'
import {useAuthStore} from '@/store/authStore'
import { useOtherStore } from "@/store/otherStore";

import pb from "@/main";
import { useRouter } from 'vue-router';
import { AllChannelsData, ChatData, GroupData } from "@/store/dataModels";
import {subscribeToNewMessages} from '@/funcs/chatFuncs'
import { onMounted } from "vue";

import {searchUsers,searchGroups,searchChannels,saveUsers,saveGroups,saveChannels,searchMessages} from '@/funcs/db'

const router = useRouter()

const historyLengthOffset = router.options.history.state.position || 0;

provide('historyLengthOffset', historyLengthOffset)

const nowDate=ref(new Date())
provide('nowDate',nowDate)

setInterval(()=>{nowDate.value = new Date()},5000)

const{isLoggedIn,authData,isVerified}=storeToRefs(useAuthStore())
const{updateChatRels,updateGroupRels,updateChannelRels,updateGroups,updateAllMessages,updateGroupMems,updateContacts,init,subscribeAll}=useDataStore()
const{allChatsData,
    allGroupsData,
    allChannelsData,
    
    users,
    searchedGroups,
    searchedChannels,

    searchMessageResults,

    isInitialized

}=storeToRefs(useDataStore())


const {userSearch, groupSearch, channelSearch, searchMessage}=storeToRefs(useOtherStore())

if(!isInitialized.value && isLoggedIn.value, isVerified.value){await init();subscribeAll();}




watchEffect(async ()=>{
    if(userSearch.value){
      try{
        users.value=(await pb.collection('users').getFullList({filter:`name ~ "${userSearch.value}" || username ~ "${userSearch.value}" || email ~ "${userSearch.value}"`})).filter(user=>user.id != authData.value.id)
        await saveUsers(JSON.parse(JSON.stringify(users.value)))
      }catch{
        users.value = await searchUsers(userSearch.value)
      }
    }
})

watchEffect(async ()=>{
    if(groupSearch.value){
      try{
        searchedGroups.value=await pb.collection('groups').getFullList({filter:`name ~ "${groupSearch.value}"`})
        await saveGroups(JSON.parse(JSON.stringify(searchedGroups.value)))
      }catch{
        searchedGroups.value = await searchGroups(groupSearch.value)
      }
    }
})

watchEffect(async ()=>{
    if(channelSearch.value){
      try{
        searchedChannels.value=await pb.collection('channels').getFullList({filter:`name ~ "${channelSearch.value}"`})
        await saveChannels(JSON.parse(JSON.stringify(searchedChannels.value)))
      }catch{
        searchedChannels.value = await searchChannels(channelSearch.value)
      }
    }
})


watchEffect(async ()=>{
  if(searchMessage.value){
    try{
      searchMessageResults.value=[...await pb.collection('chatMessages').getFullList({filter:`text ~ "${searchMessage.value}"`,expand:'from,to'}),
      ...await pb.collection('groupMessages').getFullList({filter:`text ~ "${searchMessage.value}"`,expand:'from,group'}),
      ...await pb.collection('channelMessages').getFullList({filter:`text ~ "${searchMessage.value}"`,expand:'channel'})].sort((a,b)=>new Date(b.created).getTime()-new Date(a.created).getTime())
    }catch{
      searchMessageResults.value = await searchMessages(searchMessage.value)
    }
  }
})

// watchEffect(async()=>{
//     if(!isLoggedIn.value)return;

//     // await init()

//     // subscribeAll()

// //     pb.collection('contacts').subscribe('*', updateContacts)




// //     pb.collection('users').subscribe('*',async(e)=>{
// //         try{
// //             allChatsData.value.allDatas.get(e.record.id).isOnline = e.record.online;
// //             allChatsData.value.allDatas.get(e.record.id).lastVisited = e.record.updated;
// //         }catch{}
// //     })


// //     pb.collection('rels').subscribe('*',async(e)=>{
// //             if(e.action=='create' && e.record.follower==authData.value.id){
// //                 const rel= await pb.collection('rels').getFirstListItem(`follower = "${e.record.follower}" && following = "${e.record.following}"`, {expand:'follower,following'})
// //                 const backRel= await pb.collection('rels').getFirstListItem(`follower = "${e.record.following}" && following = "${e.record.follower}"`, {expand:'follower,following'})
// //                 allChatsData.value.allDatas.set(e.record.following, new ChatData(rel,backRel));
// //                 subscribeToNewMessages(e.record.following)
// //                 await allChatsData.value.allDatas.get(e.record.following).init()
// //             }
// //         if(e.action=='update' && e.record.following == authData.value.id)allChatsData.value.allDatas.get(e.record.follower).otherLastSeen=e.record.lastseen
        

// //         })

// //     pb.collection('chatMessages').subscribe('*',(e)=>{
// //         const index=(e.record.from==authData.value.id ? e.record.to : e.record.from);
// //         if(e.action=='create'){
// //             if(allChatsData.value.allDatas.get(index).cacheNewMessages)allChatsData.value.allDatas.get(index).messages.push(e.record);
// //             if(e.record.from != authData.value.id)allChatsData.value.allDatas.get(index).unseenCount++;
// //             allChatsData.value.allDatas.get(index).lastMessage=e.record;}
// //             else if(e.action=='update' && e.record.created>=allChatsData.value.allDatas.get(index).messages[0].created && e.record.created<=allChatsData.value.allDatas.get(index).messages.at(-1).created)allChatsData.value.allDatas.get(index).messages[allChatsData.value.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
// //             else if(e.record.action='delete'){if(new Date(e.record.created) > new Date(allChatsData.value.allDatas.get(index).lastSeen)){allChatsData.value.allDatas.get(index).unseenCount--;};allChatsData.value.allDatas.get(index).messages=allChatsData.value.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)}})






// //     pb.collection('groupMembers').subscribe('*',async(e)=>{


// //         if(allGroupsData.value.groupRels.find(groupRel=>{groupRel.group==e.record.group}) && e.action=='create'){
// //                 allGroupsData.value.allDatas.get(e.record.group).groupMems.set(e.record.mem, await pb.collection('users').getFirstListItem(`id = "${e.record.mem}"`))
// //         }
// //         else if(e.action=='create' && e.record.mem==authData.value.id){
// //             await updateGroupRels();
// //         }

// //         })





// // pb.collection('groupMessages').subscribe('*',async(e)=>{
// //         const index=e.record.group;
// //         if(e.action=='create'){
// //             if(!allGroupsData.value.allDatas.get(index).groupMems.get(e.record.from)){await updateGroupMems(e.record.group)}
// //             if(allGroupsData.value.allDatas.get(index).cacheNewMessages)allGroupsData.value.allDatas.get(index).messages.push(e.record);
// //             if(e.record.from != authData.value.id)allGroupsData.value.allDatas.get(index).unseenCount++;
// //             allGroupsData.value.allDatas.get(index).lastMessage=e.record;allGroupsData.value.allDatas.get(index).lastMessage['expand']={from:allGroupsData.value.allDatas.get(index).groupMems.get(e.record.from)}}
// //             else if(e.action=='update' && e.record.created>=allGroupsData.value.allDatas.get(index).messages[0].created && e.record.created<=allGroupsData.value.allDatas.get(index).messages.at(-1).created)allGroupsData.value.allDatas.get(index).messages[allGroupsData.value.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
// //             else if(e.record.action='delete'){if(new Date(e.record.created) > new Date(allGroupsData.value.allDatas.get(index).lastSeen)){allGroupsData.value.allDatas.get(index).unseenCount--;};allGroupsData.value.allDatas.get(index).messages=allGroupsData.value.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)}})


// //             pb.collection('channelMessages').subscribe('*',(e)=>{
// //         const index=e.record.channel;
// //         if(e.action=='create'){
// //             if(allChannelsData.value.allDatas.get(index).cacheNewMessages)allChannelsData.value.allDatas.get(index).messages.push(e.record);
// //             if(e.record.from != authData.value.id)allChannelsData.value.allDatas.get(index).unseenCount++;
// //             allChannelsData.value.allDatas.get(index).lastMessage=e.record;}
// //             else if(e.action=='update' && e.record.created>=allChannelsData.value.allDatas.get(index).messages[0].created && e.record.created<=allChannelsData.value.allDatas.get(index).messages.at(-1).created)allChannelsData.value.allDatas.get(index).messages[allChannelsData.value.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
// //             else if(e.record.action='delete'){if(new Date(e.record.created) > new Date(allChannelsData.value.allDatas.get(index).lastSeen)){allChannelsData.value.allDatas.get(index).unseenCount--;};allChannelsData.value.allDatas.get(index).messages=allChannelsData.value.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)}})


// })




        window.addEventListener("beforeunload", ()=>{pb.collection('users').update(authData.value.id,{online:false})});
        document.addEventListener('visibilitychange', ()=>{if (document.visibilityState === 'visible'){pb.collection('users').update(authData.value.id,{online:true})}else{pb.collection('users').update(authData.value.id,{online:false})}});



</script>