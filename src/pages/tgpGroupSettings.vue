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
    import { useRoute, useRouter } from 'vue-router';
    import {pb} from '@/funcs/pb';
    import {storeToRefs} from 'pinia'

    import {useDataStore} from '@/store/dataStore'
    import {GroupData} from '@/store/dataModels'
    

    const{allGroupsData}=storeToRefs(useDataStore())


    const route=useRoute()
    const router=useRouter()
    const groupId=route.params.groupId

    const joined=computed(()=>!!allGroupsData.value.allDatas.get(groupId)?.active)

    provide('joined',joined)


    if(!allGroupsData.value.allDatas.get(groupId)){
        try{
            const group=await pb.collection('groups').getOne(groupId)
            allGroupsData.value.allDatas.set(groupId, new GroupData(null,group))
        }catch{}finally{
            if(!allGroupsData.value.allDatas.get(groupId)){router.replace('/')}
            else{await allGroupsData.value.allDatas.get(groupId).init()}
        }
    }
    
    </script>
    