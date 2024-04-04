<template>
    <tg-main>
    <template #main><suspense><tg-channel-page :channelId="channelId" :initMessageId="route.query.initMessageId"></tg-channel-page></suspense></template>
    <template #appBar><tg-channel-app-bar :channelId="channelId"></tg-channel-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount,onUnmounted, ref, provide, computed, watchEffect } from 'vue';
    import { useRoute } from 'vue-router';
    import pb from '@/main';
    import { storeToRefs } from 'pinia';

    import {useDataStore} from '@/store/dataStore'
    import {ChannelData} from '@/store/dataModels'
    

    const{allChannelsData}=storeToRefs(useDataStore())

    import tgMain from '../components/tgMain.vue';
    import tgChannelAppBar from '../components/tgChannelAppBar.vue';
    import tgChannelPage from '../components/tgChannelPage.vue';

    const route=useRoute()
    const channelId=route.params.channelId

    if(!allChannelsData.value.allDatas.get(channelId)){
        try{
            const channelRel=await pb.collection('channelMembers').getFirstListItem(`channel = "${channelId}" && mem = "${pb.authStore.model.id}"`,{expand:'mem,channel'})
        allChannelsData.value.allDatas.set(channelId, new ChannelData(channelRel))
        }catch{
            const channel=await pb.collection('channels').getOne(channelId)
        allChannelsData.value.allDatas.set(channelId,new ChannelData(null,channel))
        }
        await allChannelsData.value.allDatas.get(channelId).init()
    }
    const subscribed=computed(()=>!!allChannelsData.value.allDatas.get(channelId).channelRelId)
    const isOwner=computed(()=>allChannelsData.value.allDatas.get(channelId)?.channel?.owner==pb.authStore.model.id)  
    const showChannel=ref(route.query.showChannel=='true')
    const scrollableKey=ref(Math.random())
    provide('scrollableKey',scrollableKey)
    provide('showChannel', showChannel)
    provide('subscribed',subscribed)
    provide('isOwner',isOwner)

    // watchEffect(()=>{if(subscribed.value)scrollableKey.value=Math.random();console.log(scrollableKey.value)})
    
    onBeforeUnmount(()=>{allChannelsData.value.allDatas.get(channelId).updateUnseenCount()})


    </script>
