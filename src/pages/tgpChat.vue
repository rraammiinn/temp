<template>
    <tg-main>
    <template #main><suspense><tg-chat-page :otherId="otherId" :initMessageId="route.query.initMessageId"></tg-chat-page></suspense></template>
    <template #appBar><tg-chat-app-bar :otherId="otherId"></tg-chat-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import pb from '@/main';
    import { onBeforeUnmount,onUnmounted, ref, provide, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { storeToRefs } from 'pinia';

    import {useDataStore} from '@/store/dataStore'
    import {ChatData} from '@/store/dataModels'
    

    const{allChatsData}=storeToRefs(useDataStore())

    import tgMain from '../components/tgMain.vue';
    import tgChatAppBar from '../components/tgChatAppBar.vue';
    import tgChatPage from '../components/tgChatPage.vue';

    const route=useRoute()
    const otherId=route.params.otherId

    if(!allChatsData.value.allMessages[otherId]){
        var rel,backRel,user
        try{
            rel=await pb.collection('rels').getFirstListItem(`follower = "${pb.authStore.model.id}" && following = "${otherId}"`,{expand:'follower,following'})
            backRel=await pb.collection('rels').getFirstListItem(`follower = "${otherId}" && following = "${pb.authStore.model.id}"`,{expand:'follower,following'})
        }catch{
            user=await pb.collection('users').getOne(otherId)
        }
        finally{
            allChatsData.value.allMessages[otherId]=new ChatData(rel,backRel,user)
            await allChatsData.value.allMessages[otherId].init()
        }
        
    }
    const isInRel=computed(()=>!!allChatsData.value.allMessages[otherId].relId && !!allChatsData.value.allMessages[otherId].backRelId)
    const blocked=computed(()=>!allChatsData.value.allMessages[otherId].active)
    const showUser=ref(route.query.showUser=='true')
    provide('showUser', showUser)
    provide('isInRel',isInRel)
    provide('blocked',blocked)
    
    onBeforeUnmount(()=>{allChatsData.value.allMessages[otherId].updateUnseenCount()})


    </script>
