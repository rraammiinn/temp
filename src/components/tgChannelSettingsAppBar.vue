<template>
    <v-btn style="margin-right: .5rem;" rounded @click="$router.back();" variant="text" icon="mdi-arrow-left"></v-btn>
<v-avatar :image="`/api/files/channels/${props.channelId}/${allChannelsData.allMessages[props.channelId].channel.avatar}`"></v-avatar>
    <v-spacer></v-spacer>
    <v-menu transition="slide-x-transition" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn rounded v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-col style="width: fit-content;margin: 0;padding: 0;margin-top: 1rem;">
                <v-btn @click="unsubscribe(props.channelId)" v-if="subscribed" color="error" width="100%" append-icon="mdi-logout">unsubscribe</v-btn>
                <v-btn @click="subscribe(props.channelId)" v-else color="primary" width="100%" append-icon="mdi-login">subscribe</v-btn>
        </v-col>
    </v-menu>
    <!-- <v-btn variant="text" icon="mdi-dots-vertical"></v-btn> -->
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

const {allChannelsData}=storeToRefs(useDataStore())

const props=defineProps(['channelId'])

const showChannel=inject('showChannel')
const showUser =inject('showUser')
const subscribed=inject('subscribed')
const isOwner=inject('isOwner')



</script>