<template>
        <img style="margin-top: -.5rem;width: 100%;" :src="`/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`" alt="">
        <v-divider/>
        <v-list-item @click="$router.push('/contacts');drawer=false" prepend-icon="mdi-contacts" title="contacts" value="contacts"></v-list-item>
        <v-list-item @click="$router.push('/settings');drawer=false" prepend-icon="mdi-tune" title="settings" value="settings"></v-list-item>
        <v-divider/>
        <v-list-item title="" value="">
            <div style="display: flex;align-items:center;align-content: center;">
                <v-switch v-model="isDark" label="dark mode" color="primary" inset></v-switch>
            </div>
        </v-list-item>
        
</template>

<style scoped>
*:hover{
    color: var(--tgPrimary)
}
</style>

<script setup>
import pb from '@/main';
import {inject, watchEffect} from 'vue';
// const dark=inject('dark')
const drawer=inject('drawer')


// function changeTheme(){
//     localStorage.setItem('tgDark',dark.value.toString())
// }


import {storeToRefs} from 'pinia'
import {useSettingsStore} from '@/store/settingsStore'
const {isDark}=storeToRefs(useSettingsStore())

watchEffect(()=>{localStorage.setItem('tgDark',isDark.value)})
</script>