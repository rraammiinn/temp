<template>
<tg-main>
<template #main><suspense><tg-main-page></tg-main-page></suspense></template>
<template #appBar><tg-main-app-bar></tg-main-app-bar></template>
</tg-main>
</template>

<script setup>
import { inject, provide, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAuthStore} from '@/store/authStore'

const router=useRouter()
const {isLoggedIn} = useAuthStore()
if(!isLoggedIn){router.push('/login')}



const chatSearch=ref('')
provide('chatSearch', chatSearch)

import tgMain from '../components/tgMain.vue';
import tgMainAppBar from '../components/tgMainAppBar.vue';
import tgMainPage from '../components/tgMainPage.vue';

console.log('@@@@@')
onBeforeUnmount(()=>{console.log('mud...')})
onMounted(()=>{console.log('mounted')})
</script>

