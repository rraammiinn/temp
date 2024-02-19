<template>
    <v-btn style="margin-right: .5rem;" rounded @click="if(!showUser)$router.back();showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
    <v-badge :content="allChatsData.allMessages[props.otherId].isOnline ? 'online' : 'offline'" :color="allChatsData.allMessages[props.otherId].isOnline ? 'primary' : null"><v-avatar @click="showUser=true;" :image="`/api/files/users/${props.otherId}/${allChatsData.allMessages[props.otherId].other.avatar}`"></v-avatar></v-badge>
    <div v-show="!allChatsData.allMessages[props.otherId].isOnline" style="font-size: .65rem;font-weight: bold;margin-top: 3rem;margin-left: -.4rem;opacity: .85;">
        <span>last seen : {{ allChatsData.allMessages[props.otherId].lastVisited.slice(0,10) }}</span><span style="margin-left: .5rem;">{{ allChatsData.allMessages[props.otherId].lastVisited.slice(10,16) }}</span>
    </div>
    <v-spacer></v-spacer>
    <v-menu transition="slide-x-transition" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn rounded v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-col style="width: fit-content;margin: 0;padding: 0;margin-top: 1rem;">
                <v-btn v-if="!Object.keys(contacts).includes(props.otherId)" @click="addContact(props.otherId)" color="primary" variant="outlined" style="background-color: var(--tgBg);border-bottom-left-radius: 0;border-bottom-right-radius: 0;" width="100%" append-icon="mdi-plus">follow</v-btn>
                <v-btn v-if="isInRel && !blocked" @click="block(props.otherId)" color="error" style="border-top-left-radius: 0;border-top-right-radius: 0;" width="100%" append-icon="mdi-power-off">block</v-btn>
                <v-btn v-if="isInRel && blocked" @click="unblock(props.otherId)" color="primary" style="border-top-left-radius: 0;border-top-right-radius: 0;" width="100%" append-icon="mdi-power">unblock</v-btn>
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
import { block,unblock } from '@/funcs/chatFuncs';
import { addContact } from '@/funcs/contactFunc';

const {allChatsData,contacts}=storeToRefs(useDataStore())

const props=defineProps(['otherId'])

const showUser=inject('showUser')
const isInRel=inject('isInRel')
const blocked=inject('blocked')
// const allChatsData=inject('allChatsData')

// var lastseen=0;
// const isOnline=ref(false)
// pb.collection('users').subscribe(props.otherId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>