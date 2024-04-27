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
    import { useRoute, useRouter } from 'vue-router';
    import {pb} from '@/funcs/pb';
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {ChannelData} from '@/store/dataModels'
    

    const{allChannelsData}=storeToRefs(useDataStore())


    const route=useRoute()
    const router=useRouter()
    const channelId=route.params.channelId

 

    const subscribed=computed(()=>!!allChannelsData.value.allDatas.get(channelId).channelRelId)

    provide('subscribed',subscribed)



    if(!allChannelsData.value.allDatas.get(channelId)){
        try{
            const channel=await pb.collection('channels').getOne(channelId)
            allChannelsData.value.allDatas.set(channelId, new ChannelData(null,channel))
        }finally{
            if(!allChannelsData.value.allDatas.get(channelId)){router.replace('/')}
            else{await allChannelsData.value.allDatas.get(channelId).init()}
        }
    }
    
    </script>
    