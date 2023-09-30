<template>
    <tg-main>
    <template #main><suspense><tg-group-page :groupId="route.params.groupId" :initMessageId="route.query.initMessageId"></tg-group-page></suspense></template>
    <template #appBar><tg-group-app-bar :groupId="route.params.groupId"></tg-group-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';

    import {useDataStore} from '@/store/dataStore'

    const{allGroupMessages}=useDataStore()

    import tgMain from '../components/tgMain.vue';
    import tgGroupAppBar from '../components/tgGroupAppBar.vue';
    import tgGroupPage from '../components/tgGroupPage.vue';

    const route=useRoute()
    if(!allGroupMessages[route.params.groupId])allGroupMessages[route.params.groupId]={lastMessage:null,group:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null}
    console.log(route)
    const showGroup=ref(route.query.showGroup=='true')
    provide('showGroup', showGroup)


    </script>
