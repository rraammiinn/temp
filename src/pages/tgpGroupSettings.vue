<template>
    <tg-main>
    <template #main><suspense><tg-group-settings-page :group-id="groupId"></tg-group-settings-page></suspense></template>
    <template #appBar><tg-group-settings-app-bar :group-id="groupId"></tg-group-settings-app-bar></template>
    </tg-main>
    </template>
    
    <script setup>
    import { computed, provide } from 'vue';
    import tgMain from '../components/tgMain.vue';
    import tgGroupSettingsAppBar from '../components/tgGroupSettingsAppBar.vue';
    import tgGroupSettingsPage from '../components/tgGroupSettingsPage.vue';
    import { useRoute } from 'vue-router';
    import pb from '@/main';
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {GroupData} from '@/store/dataModels'
    

    const{allGroupsData}=storeToRefs(useDataStore())


    const route=useRoute()
    const groupId=route.params.groupId

    const joined=computed(()=>!!allGroupsData.value.allDatas[groupId]?.active)

    provide('joined',joined)


    if(!allGroupsData.value.allDatas[groupId]){
        // let groupRel
        // try{groupRel=await pb.collection('groupMembers').create({"mem":pb.authStore.model.id, "group":groupId},{expand:'mem,group'})}catch{groupRel=await pb.collection('groupMembers').getFirstListItem({"mem":pb.authStore.model.id, "group":groupId},{expand:'mem,group'})}
        // allGroupsData.value.allDatas[groupId]=new GroupData(groupRel)

        const group=await pb.collection('groups').getOne(groupId)
        allGroupsData.value.allDatas[groupId]=new GroupData(null,group)
        await allGroupsData.value.allDatas[groupId].init()
    }
    
    </script>
    