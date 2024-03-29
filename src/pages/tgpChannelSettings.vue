<template>
    <tg-main>
    <template #main><suspense><tg-channel-settings-page :channel-id="channelId"></tg-channel-settings-page></suspense></template>
    <template #appBar><tg-channel-settings-app-bar :channel-id="channelId"></tg-channel-settings-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { computed, provide } from 'vue';
    import tgMain from '../components/tgMain.vue';
    import tgChannelSettingsAppBar from '../components/tgChannelSettingsAppBar.vue';
    import tgChannelSettingsPage from '../components/tgChannelSettingsPage.vue';
    import { useRoute } from 'vue-router';
    import pb from '@/main';
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {ChannelData} from '@/store/dataModels'
    

    const{allChannelsData}=storeToRefs(useDataStore())


    const route=useRoute()
    const channelId=route.params.channelId

 

    const subscribed=computed(()=>!!allChannelsData.value.allMessages[channelId].channelRelId)

    provide('subscribed',subscribed)



    if(!allChannelsData.value.allMessages[channelId]){
        // let channelRel
        // try{channelRel=await pb.collection('channelMembers').create({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'})}catch{channelRel=await pb.collection('channelMembers').getFirstListItem({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'})}
        // allChannelsData.value.allMessages[channelId]=new ChannelData(channelRel)

        const channel=await pb.collection('channels').getOne(channelId)
        allChannelsData.value.allMessages[channelId]=new ChannelData(null,channel)
        await allChannelsData.value.allMessages[channelId].init()
    }
    
    </script>
    