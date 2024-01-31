<template>
    <tg-main>
    <template #main><suspense><tg-chat-page :otherId="otherId" :initMessageId="route.query.initMessageId"></tg-chat-page></suspense></template>
    <template #appBar><tg-chat-app-bar :otherId="otherId"></tg-chat-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import pb from '@/main';
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

    if(!allChatsData.allMessages[otherId]){
        var rel,backRel
        try{rel=await pb.collection('rels').create({follower:pb.authStore.model.id, following:otherId, active:true},{expand:'follower,following'})}catch{rel=await pb.collection('rels').getFirstListItem(`follower = "${pb.authStore.model.id}" && following = "${otherId}"`,{expand:'follower,following'})}
        try{backRel=await pb.collection('rels').create({follower:otherId, following:pb.authStore.model.id, active:true},{expand:'follower,following'})}catch{backRel=await pb.collection('rels').getFirstListItem(`follower = "${otherId}" && following = "${pb.authStore.model.id}"`,{expand:'follower,following'})}
        console.log('^^^',rel,backRel)
        allChatsData.allMessages[otherId]=new ChatData(rel,backRel)
    }
    console.log(route)
    const showUser=ref(route.query.showUser=='true')
    provide('showUser', showUser)
    
    onBeforeUnmount(()=>{allChatsData.allMessages[otherId].updateUnseenCount().then(console.log('*****'))})


    </script>
