<template>
        <img style="margin-top: -1rem;width: 100%;" :src="`/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`" alt="">
        <v-divider/>
        <v-list-item @click="$router.push('/contacts');drawer=false" prepend-icon="mdi-contacts" title="contacts" value="contacts"></v-list-item>
        <v-list-item @click="$router.push('/settings');drawer=false" prepend-icon="mdi-tune" title="settings" value="settings"></v-list-item>
        <v-divider/>
        <v-list-item title="" value="">
            <div style="display: flex;align-items:center;align-content: center;">
                <v-switch @change="changeTheme" v-model="dark" label="dark mode" color="primary" inset></v-switch>
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
import {inject} from 'vue';
const dark=inject('dark')
// const currentPage=inject('currentPage')
const drawer=inject('drawer')


function changeTheme(){
    localStorage.setItem('tgDark',dark.value.toString())
}

</script>