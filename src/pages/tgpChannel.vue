<template>
    <tg-main>
    <template #main><suspense><tg-channel-page :channelId="route.params.channelId" :initMessageId="route.query.initMessageId"></tg-channel-page></suspense></template>
    <template #appBar><tg-channel-app-bar :channelId="route.params.channelId"></tg-channel-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';

    import {useDataStore} from '@/store/dataStore'

    const{allChannelMessages}=useDataStore()

    import tgMain from '../components/tgMain.vue';
    import tgChannelAppBar from '../components/tgChannelAppBar.vue';
    import tgChannelPage from '../components/tgChannelPage.vue';

    const route=useRoute()
    if(!allChannelMessages[route.params.channelId])allChannelMessages[route.params.channelId]={lastMessage:null,channel:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null}
    console.log(route)
    const showChannel=ref(route.query.showChannel=='true')
    provide('showChannel', showChannel)


    </script>
