<template>
    <tg-main>
    <template #main><suspense><tg-channel-page :channelId="channelId" :initMessageId="route.query.initMessageId"></tg-channel-page></suspense></template>
    <template #appBar><tg-channel-app-bar :channelId="channelId"></tg-channel-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount,onUnmounted, ref, provide, computed } from 'vue';
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

    if(!allChannelsData.value.allMessages[channelId]){
        // var channelRel
        // try{channelRel=await pb.collection('channelMembers').create({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'})}catch{channelRel=await pb.collection('channelMembers').getFirstListItem({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'})}
        // allChannelsData.allMessages[channelId]=new ChannelData(channelRel)

        const channel=await pb.collection('channels').getOne(channelId)
        allChannelsData.value.allMessages[channelId]=new ChannelData(null,channel)
    }
    const subscribed=computed(()=>!!allChannelsData.value.allMessages[channelId].channelRelId)
    const isOwner=computed(()=>allChannelsData.value.allMessages[channelId]?.channel?.owner==pb.authStore.model.id)  
    const showChannel=ref(route.query.showChannel=='true')
    provide('showChannel', showChannel)
    provide('subscribed',subscribed)
    provide('isOwner',isOwner)
    
    onBeforeUnmount(()=>{allChannelsData.value.allMessages[channelId].updateUnseenCount()})


    </script>
