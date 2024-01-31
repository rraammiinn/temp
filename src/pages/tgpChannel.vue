<template>
    <tg-main>
    <template #main><suspense><tg-channel-page :channelId="channelId" :initMessageId="route.query.initMessageId"></tg-channel-page></suspense></template>
    <template #appBar><tg-channel-app-bar :channelId="channelId"></tg-channel-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount,onUnmounted, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';
    import pb from '@/main';

    import {useDataStore} from '@/store/dataStore'
    import {ChannelData} from '@/store/dataModels'
    

    const{allChannelsData}=useDataStore()

    import tgMain from '../components/tgMain.vue';
    import tgChannelAppBar from '../components/tgChannelAppBar.vue';
    import tgChannelPage from '../components/tgChannelPage.vue';

    const route=useRoute()
    const channelId=route.params.channelId

    if(!allChannelsData.allMessages[channelId]){
        var channelRel
        try{channelRel=await pb.collection('channelMembers').create({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'})}catch{channelRel=await pb.collection('channelMembers').getFirstListItem({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'})}
        allChannelsData.allMessages[channelId]=new ChannelData(channelRel)
    }
    console.log(route)
    const showChannel=ref(route.query.showChannel=='true')
    provide('showChannel', showChannel)
    
    onBeforeUnmount(()=>{allChannelsData.allMessages[channelId].updateUnseenCount().then(console.log('*****'))})


    </script>
