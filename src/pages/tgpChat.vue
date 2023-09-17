<template>
    <tg-main>
    <template #main><suspense><tg-chat-page :other="route.params.other" :initChatId="route.query.initChatId"></tg-chat-page></suspense></template>
    <template #appBar><tg-chat-app-bar :other="route.params.other"></tg-chat-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';

    import tgMain from '../components/tgMain.vue';
    import tgChatAppBar from '../components/tgChatAppBar.vue';
    import tgChatPage from '../components/tgChatPage.vue';

    // const props=defineProps(['other', 'initChatId', 'showUser'])
    const route=useRoute()
    console.log(route)
    const showUser=ref(route.query.showUser=='true')
    // const chatSearch=ref('')
    provide('showUser', showUser)
    // provide('chatSearch', chatSearch)


    </script>
