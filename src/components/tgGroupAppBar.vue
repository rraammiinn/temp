<template>
    <v-btn style="margin-right: .5rem;" rounded @click="if(!showGroup && !showUser)$router.back();if(!showUser)showGroup=false;showUser=false;" variant="text" icon="mdi-arrow-left"></v-btn>
<v-avatar @click="showGroup=true;" :image="getGroupAvatarUrl(props.groupId, allGroupsData.allMessages[props.groupId].group.avatar)"></v-avatar>
    <v-spacer></v-spacer>
    <v-menu transition="slide-x-transition" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn rounded v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-col style="width: fit-content;margin: 0;padding: 0;margin-top: 1rem;">
                <v-btn @click="$router.push({name:'groupSettings', params:{groupId:props.groupId}})" v-if="isOwner" variant="outlined" style="background-color: var(--tgBg);border-bottom-left-radius: 0;border-bottom-right-radius: 0;" width="100%" append-icon="mdi-tune">settings</v-btn>
                <v-btn @click="leave(props.groupId)" v-if="joined" color="error" style="border-top-left-radius: 0;border-top-right-radius: 0;" width="100%" append-icon="mdi-logout">leave</v-btn>
                <v-btn @click="join(props.groupId)" v-else color="primary" style="border-top-left-radius: 0;border-top-right-radius: 0;" width="100%" append-icon="mdi-login">join</v-btn>
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
import { join, leave } from '@/funcs/groupFuncs';

import {getGroupAvatarUrl} from '@/funcs/commonFuncs';


const {allGroupsData}=storeToRefs(useDataStore())

const props=defineProps(['groupId'])

const showGroup=inject('showGroup')
const showUser =inject('showUser')
const joined=inject('joined')
const isOwner=inject('isOwner')



// const allGroupsData=inject('allGroupsData')

// var lastseen=0;
// const isOnline=ref(false)
// pb.collection('groups').subscribe(props.groupId, (e)=>{isOnline.value = true ;lastseen=e.record.lastseen;})
// setInterval(()=>{isOnline.value = new Date().getTime() - new Date(lastseen).getTime() < 6000},1000)
</script>