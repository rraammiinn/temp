<template>
        <img style="margin-top: -.5rem;width: 100%;" :src="getUserAvatarUrl(pb.authStore.model.id, pb.authStore.model.avatar)" alt="">
        <!-- <v-list-item :prepend-avatar="getUserAvatarUrl(pb.authStore.model.id, pb.authStore.model.avatar)" :title="pb.authStore.model.name" style="padding-left: .5rem;"></v-list-item> -->
            <v-list-item v-for="account in Object.values(accounts)" :key="account.model.id" @click="async()=>{if(account.model.id == pb.authStore.model.id)return;await changeAccount(account.model.id)}" :title="account.model.name" style="padding-left: .5rem;">
                <template #prepend>
                    <v-badge v-if="account.model.id == pb.authStore.model.id" icon="mdi-check">
                        <v-avatar :image="getUserAvatarUrl(account.model.id, account.model.avatar)"></v-avatar>
                    </v-badge>
                    <v-avatar v-else :image="getUserAvatarUrl(account.model.id, account.model.avatar)"></v-avatar>
                </template>
            </v-list-item>
        <v-list-item @click="$router.push({name:'login', query:{activeAccountId:pb.authStore.model.id}})" prepend-icon="mdi-plus-circle" title="add account" value="add account"></v-list-item>

        <v-divider/>
        <v-list-item @click="$router.push('/contacts');drawer=false" prepend-icon="mdi-contacts" title="contacts" value="contacts"></v-list-item>
        <v-list-item @click="$router.push('/settings');drawer=false" prepend-icon="mdi-tune" title="settings" value="settings"></v-list-item>
        <v-list-item @click="$router.push('/groupsList');drawer=false" prepend-icon="mdi-thumbs-up-down" title="groups" value="groups"></v-list-item>
        <v-list-item @click="$router.push('/channelsList');drawer=false" prepend-icon="mdi-podcast" title="channels" value="channels"></v-list-item>

        <v-divider/>
        <v-list-item title="" value="">
            <div style="display: flex;align-items:center;align-content: center;">
                <v-switch false-value="light" true-value="dark" v-model="theme" label="dark mode" color="primary" inset></v-switch>
            </div>
        </v-list-item>
        
</template>

<style scoped>
*:hover{
    color: var(--tgPrimary)
}
</style>

<script setup>
import {pb} from '@/funcs/pb';
import {inject, watchEffect} from 'vue';

import { useRouter } from 'vue-router';

import { getUserAvatarUrl } from '@/funcs/commonFuncs';

import { useDataStore } from '@/store/dataStore';

const router = useRouter()

const {accounts, setAccount} = useDataStore()
// const dark=inject('dark')
const drawer=inject('drawer')


// function changeTheme(){
//     localStorage.setItem('tgDark',dark.value.toString())
// }


import {storeToRefs} from 'pinia'
import {useSettingsStore} from '@/store/settingsStore'
const {theme}=storeToRefs(useSettingsStore())


async function changeAccount(accountId){
    await setAccount(accountId)
    router.go()
}

watchEffect(()=>{localStorage.setItem('tgTheme',theme.value)})
</script>