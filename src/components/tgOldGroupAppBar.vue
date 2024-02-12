<template>
    <v-btn style="margin-right: .5rem;" rounded @click="if(!showGroup)$router.back();showGroup=false;" variant="text" icon="mdi-arrow-left"></v-btn>
<v-avatar @click="showGroup=true;" :image="`/api/files/groups/${props.groupId}/${allGroupMessages[props.groupId].group.avatar}`"></v-avatar>
    <v-spacer></v-spacer>
    <v-btn rounded variant="text" icon="mdi-dots-vertical"></v-btn>
</template>

<style scoped>
.listItem{
    background-color: var(--tgBg);
}
.listItem:hover{
    background-color: var(--tgBg);
}
</style>

<script setup>
import {inject,ref} from 'vue';
import pb from '@/main';
import {storeToRefs} from 'pinia'

import {useDataStore} from '@/store/dataStore'

const {allGroupMessages}=storeToRefs(useDataStore())

const props=defineProps(['groupId'])

const showGroup=inject('showGroup')
// const allGroupMessages=inject('allGroupMessages')

// var lastseen=0;
// const isOnline=ref(false)
// pb.collection('groups').subscribe(props.groupId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>