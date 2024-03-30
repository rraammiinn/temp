<template>
    <v-btn style="margin-right: .5rem;" rounded @click="$router.back();" variant="text" icon="mdi-arrow-left"></v-btn>
<v-avatar :image="getGroupAvatarUrl(props.groupId, allGroupsData.allDatas[props.groupId].group.avatar)"></v-avatar>
    <v-spacer></v-spacer>
    <v-menu transition="slide-x-transition" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn rounded v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-col style="width: fit-content;margin: 0;padding: 0;margin-top: 1rem;">
                <v-btn @click="leave(props.groupId)" v-if="joined" color="error" width="100%" append-icon="mdi-logout">leave</v-btn>
                <v-btn @click="join(props.groupId)" v-else color="primary" width="100%" append-icon="mdi-login">join</v-btn>
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



</script>