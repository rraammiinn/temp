<template>
        <img style="margin-top: -.5rem;width: 100%;" :src="getUserAvatarUrl(pb.authStore.model.id, pb.authStore.model.avatar)" alt="">
        <!-- <v-list-item :prepend-avatar="getUserAvatarUrl(pb.authStore.model.id, pb.authStore.model.avatar)" :title="pb.authStore.model.name" style="padding-left: .5rem;"></v-list-item> -->
            <!-- <v-list-item v-for="account in Object.values(accounts)" :key="account.model.id" @click="async()=>{if(account.model.id == pb.authStore.model.id)return;await changeAccount(account.model.id)}" :title="account.model.name" style="padding-left: .5rem;">
                <template #prepend>
                    <v-badge v-if="account.model.id == pb.authStore.model.id" icon="mdi-check">
                        <v-avatar :image="getUserAvatarUrl(account.model.id, account.model.avatar)"></v-avatar>
                    </v-badge>
                    <v-avatar v-else :image="getUserAvatarUrl(account.model.id, account.model.avatar)"></v-avatar>
                </template>
                <template v-slot:append><v-btn variant="text" icon="mdi-close"></v-btn><v-btn variant="text" color="error" icon="mdi-delete"></v-btn></template>
            </v-list-item> -->

            <tg-account-item v-for="account in Object.values(accounts)" :key="account.model.id" :account="account" :is-current-account="account.model.id == pb.authStore.model.id" @deleteAccount="async(accountId)=>{accountIdToDelete=accountId;showDeleteAccountDialog=true}" @changeAccount="async(accountId)=>{await changeAccount(accountId)}"></tg-account-item>
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


        <v-dialog v-model="showDeleteAccountDialog" transition="dialog-bottom-transition">
                <v-card title="delete account">
                <v-card-text>
                    are you sure you wana delete this account ?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="accountIdToDelete='';showDeleteAccountDialog=false;" variant="outlined">
                        cancel
                    </v-btn>
                    <v-btn @click="async()=>{deleteAccount(accountIdToDelete);if(accountIdToDelete == pb.authStore.model.id && Object.keys(accounts)[0])await changeAccount(Object.keys(accounts)[0]);}" color="error" variant="elevated">
                        delete
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
        
</template>

<style scoped>
*:hover{
    color: var(--tgPrimary)
}
</style>

<script setup>
import {pb} from '@/funcs/pb';
import {inject, watchEffect} from 'vue';
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { getUserAvatarUrl } from '@/funcs/commonFuncs';

import { useDataStore } from '@/store/dataStore';

const accountIdToDelete = ref('')

const showDeleteAccountDialog = ref(false)

const router = useRouter()

const {accounts, setAccount, deleteAccount} = useDataStore()
// const dark=inject('dark')
const drawer=inject('drawer')


// function changeTheme(){
//     localStorage.setItem('tgDark',dark.value.toString())
// }


import {storeToRefs} from 'pinia'
import {useSettingsStore} from '@/store/settingsStore'

import tgAccountItem from '@/components/tgAccountItem'
const {theme}=storeToRefs(useSettingsStore())


async function changeAccount(accountId){
    await setAccount(accountId)
    router.go()
}

watchEffect(()=>{localStorage.setItem('tgTheme',theme.value)})
</script>