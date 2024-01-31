<template>
    <tg-main>
    <template #main><suspense><tg-group-page :groupId="route.params.groupId" :initMessageId="route.query.initMessageId"></tg-group-page></suspense></template>
    <template #appBar><tg-group-app-bar :groupId="route.params.groupId"></tg-group-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount, ref, provide } from 'vue';
    import { useRoute } from 'vue-router';
    import pb from "@/main";
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {useAuthStore} from '@/store/authStore'
    const {authData} = useAuthStore()

    const{allGroupMessages}=storeToRefs(useDataStore())

    import tgMain from '../components/tgMain.vue';
    import tgGroupAppBar from '../components/tgGroupAppBar.vue';
    import tgGroupPage from '../components/tgGroupPage.vue';

    const route=useRoute()
    if(!(allGroupMessages.value[route.params.groupId]?.group?.id || allGroupMessages.value[route.params.groupId]?.relId)){
        allGroupMessages.value[route.params.groupId]={lastMessage:null,group:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:0,groupMems:{},relId:null,messagesType:'group'}
        const group = await pb.collection('groups').getOne(route.params.groupId)
        allGroupMessages.value[route.params.groupId].group=group
        allGroupMessages.value[route.params.groupId].groupMems[authData.id]=authData
        // pb.collection('groupMembers').getFullList({filter:`group = "${route.params.groupId}"`, expand:'mem'}).then(rels=>{rels.map(rel=>{allGroupMessages.value[route.params.groupId].groupMems[rel.mem]=rel.expand.mem})})

        console.log('gmsg', allGroupMessages.value)
    }
    console.log(route)
    const showGroup=ref(route.query.showGroup=='true')
    provide('showGroup', showGroup)


    </script>
