<template>
    <tg-main>
    <template #main><suspense><tg-group-page :groupId="groupId" :initMessageId="route.query.initMessageId"></tg-group-page></suspense></template>
    <template #appBar><tg-group-app-bar :groupId="groupId"></tg-group-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount,onUnmounted, ref, provide, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import pb from '@/main';
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {GroupData} from '@/store/dataModels'
    

    const{allGroupsData}=storeToRefs(useDataStore())

    import tgMain from '../components/tgMain.vue';
    import tgGroupAppBar from '../components/tgGroupAppBar.vue';
    import tgGroupPage from '../components/tgGroupPage.vue';

    const route=useRoute()
    const groupId=route.params.groupId

    if(!allGroupsData.value.allMessages[groupId]){
        // var groupRel
        // try{groupRel=await pb.collection('groupMembers').create({"mem":pb.authStore.model.id, "group":groupId},{expand:'mem,group'})}catch{groupRel=await pb.collection('groupMembers').getFirstListItem({"mem":pb.authStore.model.id, "group":groupId},{expand:'mem,group'})}
        // allGroupsData.value.allMessages[groupId]=new GroupData(groupRel)

        const group=await pb.collection('groups').getOne(groupId)
        allGroupsData.value.allMessages[groupId]=new GroupData(null,group)
        await allGroupsData.value.allMessages[groupId].init()
    }
    console.log(route)
    const joined=computed(()=>!!allGroupsData.value.allMessages[groupId]?.active)
    const isOwner=computed(()=>allGroupsData.value.allMessages[groupId]?.group?.owner==pb.authStore.model.id)  


    const showGroup=ref(route.query.showGroup=='true')
    const showUser=ref(false)
    provide('showGroup', showGroup)
    provide('showUser', showUser)
    provide('joined',joined)
    provide('isOwner',isOwner)

    
    onBeforeUnmount(()=>{allGroupsData.value.allMessages[groupId].updateUnseenCount().then(console.log('*****'))})


    </script>
