<template>
    <tg-main>
    <template #main><suspense><tg-chat-page :otherId="route.params.otherId" :initMessageId="route.query.initMessageId"></tg-chat-page></suspense></template>
    <template #appBar><tg-chat-app-bar :otherId="route.params.otherId"></tg-chat-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';

    import {useDataStore} from '@/store/dataStore'

    const{allChatMessages}=useDataStore()

    import tgMain from '../components/tgMain.vue';
    import tgChatAppBar from '../components/tgChatAppBar.vue';
    import tgChatPage from '../components/tgChatPage.vue';

    const route=useRoute()
    if(!allChatMessages[route.params.otherId])allChatMessages[route.params.otherId]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null,lastVisited:null,isOnline:false,relId:null,backRelId:null,otherLastSeen:null}
    console.log(route)
    const showUser=ref(route.query.showUser=='true')
    provide('showUser', showUser)


    </script>
