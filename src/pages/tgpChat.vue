<template>
    <tg-main>
    <template #main><suspense><tg-chat-page :otherId="otherId" :initMessageId="route.query.initMessageId"></tg-chat-page></suspense></template>
    <template #appBar><tg-chat-app-bar :otherId="otherId"></tg-chat-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount,onUnmounted, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';

    import {useDataStore} from '@/store/dataStore'
    import {ChatData} from '@/store/dataModels'
    

    const{allChatsData}=useDataStore()

    import tgMain from '../components/tgMain.vue';
    import tgChatAppBar from '../components/tgChatAppBar.vue';
    import tgChatPage from '../components/tgChatPage.vue';

    const route=useRoute()
    const otherId=route.params.otherId

    if(!allChatsData.allMessages[otherId])allChatsData.allMessages[otherId]=new ChatData()
    console.log(route)
    const showUser=ref(route.query.showUser=='true')
    provide('showUser', showUser)
    
    onBeforeUnmount(()=>{allChatsData.allMessages[otherId].updateUnseenCount().then(console.log('*****'))})


    </script>
