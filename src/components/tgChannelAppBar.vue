<template>
    <v-btn style="margin-right: .5rem;" rounded @click="if(!showChannel)$router.back();showChannel=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-avatar @click="showChannel=true;" :image="getChannelAvatarUrl(props.channelId, allChannelsData.allDatas[props.channelId].channel.avatar)"></v-avatar>
    <v-spacer></v-spacer>
    <v-menu transition="slide-x-transition" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn rounded v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-col style="width: fit-content;margin: 0;padding: 0;margin-top: 1rem;">
                <v-btn @click="$router.push({name:'channelSettings', params:{channelId:props.channelId}})" v-if="isOwner" variant="outlined" style="background-color: var(--tgBg);border-bottom-left-radius: 0;border-bottom-right-radius: 0;" width="100%" append-icon="mdi-tune">settings</v-btn>
                <v-btn @click="unsubscribe(props.channelId)" v-if="subscribed" color="error" style="border-top-left-radius: 0;border-top-right-radius: 0;" width="100%" append-icon="mdi-logout">unsubscribe</v-btn>
                <v-btn @click="subscribe(props.channelId)" v-else color="primary" style="border-top-left-radius: 0;border-top-right-radius: 0;" width="100%" append-icon="mdi-login">subscribe</v-btn>
        </v-col>
    </v-menu>
    <!-- <v-btn rounded variant="text" icon="mdi-dots-vertical"></v-btn> -->
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
import { subscribe, unsubscribe } from '@/funcs/channelFuncs';

import {getChannelAvatarUrl} from '@/funcs/commonFuncs';


const {allChannelsData}=storeToRefs(useDataStore())

const props=defineProps(['channelId'])

const showChannel=inject('showChannel')
const subscribed=inject('subscribed')
const isOwner=inject('isOwner')

// const allChannelsData=inject('allChannelsData')

// let lastseen=0;
// const isOnline=ref(false)
// pb.collection('channels').subscribe(props.channelId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>