<template>
    <v-btn @click="if(!showChannel)$router.back();showChannel=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <!-- <v-badge :content="allChannelsData.allMessages[props.channelId].isOnline ? 'online' : 'offline'" :color="allChannelsData.allMessages[props.channelId].isOnline ? 'primary' : null"><v-avatar @click="showChannel=true;" :image="`/api/files/channels/${props.channelId}/${allChannelsData.allMessages[props.channelId].channel.avatar}`"></v-avatar></v-badge> -->
    <v-spacer></v-spacer>
    <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
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

const {allChannelsData}=storeToRefs(useDataStore())

const props=defineProps(['channelId'])

const showChannel=inject('showChannel')
// const allChannelsData=inject('allChannelsData')

// var lastseen=0;
// const isOnline=ref(false)
// pb.collection('channels').subscribe(props.channelId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>