<template>
    <tg-main>
    <template #main><suspense><tg-group-page :groupId="groupId" :initMessageId="route.query.initMessageId"></tg-group-page></suspense></template>
    <template #appBar><tg-group-app-bar :groupId="groupId"></tg-group-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { onBeforeUnmount,onUnmounted, ref, provide, computed, watchEffect } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import pb from '@/main';
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {GroupData} from '@/store/dataModels'
    

    const{allGroupsData}=storeToRefs(useDataStore())

    import tgMain from '../components/tgMain.vue';
    import tgGroupAppBar from '../components/tgGroupAppBar.vue';
    import tgGroupPage from '../components/tgGroupPage.vue';

    const route=useRoute()
    const router=useRouter()
    const groupId=route.params.groupId

    if(!allGroupsData.value.allDatas.get(groupId)){
        try{
            const groupRel=await pb.collection('groupMembers').getFirstListItem(`group = "${groupId}" && mem = "${pb.authStore.model.id}"`,{expand:'mem,group'})
        allGroupsData.value.allDatas.set(groupId, new GroupData(groupRel))
        }catch{
            const group=await pb.collection('groups').getOne(groupId)
        allGroupsData.value.allDatas.set(groupId, new GroupData(null,group))
        }
        await allGroupsData.value.allDatas.get(groupId).init()

    }
    const joined=computed(()=>!!allGroupsData.value.allDatas.get(groupId)?.active)
    const isOwner=computed(()=>allGroupsData.value.allDatas.get(groupId)?.group?.owner==pb.authStore.model.id)  


    const showGroup=ref(route.query.showGroup=='true')
    const showUser=ref(false)
    const scrollableKey=ref(Math.random())
    provide('scrollableKey',scrollableKey)
    provide('showGroup', showGroup)
    provide('showUser', showUser)
    provide('joined',joined)
    provide('isOwner',isOwner)

    
    onBeforeUnmount(()=>{allGroupsData.value.allDatas.get(groupId).updateUnseenCount()})


    </script>
