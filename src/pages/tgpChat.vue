<template>
    <tg-main>
    <template #main><suspense><tg-chat-page></tg-chat-page></suspense></template>
    <template #appBar><tg-chat-app-bar></tg-chat-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount } from 'vue';

    import tgMain from '../components/tgMain.vue';
    import tgChatAppBar from '../components/tgChatAppBar.vue';
    import tgChatPage from '../components/tgChatPage.vue';

    onBeforeUnmount(()=>{setTimeout(() => {
        console.log('unmounted...')
    }, 5000);})
    </script>
