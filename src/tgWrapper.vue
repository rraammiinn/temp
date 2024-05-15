<template><slot></slot></template>

<script setup>
import { watchEffect, onBeforeUnmount, onUnmounted, onActivated, ref, provide } from "vue";
import {storeToRefs} from 'pinia'
import {useDataStore} from '@/store/dataStore'
import {useAuthStore} from '@/store/authStore'
import { useOtherStore } from "@/store/otherStore";

import {pb} from '@/funcs/pb';
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

if(!isInitialized.value && isLoggedIn.value && isVerified.value){
  try{
      subscribeAll()
      await pb.collection('users').update(pb.authStore.model.id,{online:true})
    }catch{}finally{
      await init()
    }
}




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



        window.addEventListener("online", (event) => {router.go()});


        window.addEventListener("beforeunload", ()=>{pb.collection('users').update(authData.value.id,{online:false})});
        document.addEventListener('visibilitychange', ()=>{if (document.visibilityState === 'visible'){pb.collection('users').update(authData.value.id,{online:true})}else{pb.collection('users').update(authData.value.id,{online:false})}});



</script>