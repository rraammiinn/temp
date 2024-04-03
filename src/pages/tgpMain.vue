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
import { storeToRefs } from "pinia";
import { useOtherStore } from "@/store/otherStore";

import { useDataStore } from '@/store/dataStore';


const {init,subscribeAll,isInitialized}=useDataStore()

if(!isInitialized){
    await init()
    subscribeAll()
}

const {searchMessage}=storeToRefs(useOtherStore())

const router=useRouter()
const {isLoggedIn,isVerified,authData} = useAuthStore()
// if(!isLoggedIn){router.push('/login')}
// if(!isVerified){router.push('/login')}




// const searchMessage=ref('')
provide('searchMessage', searchMessage)

import tgMain from '../components/tgMain.vue';
import tgMainAppBar from '../components/tgMainAppBar.vue';
import tgMainPage from '../components/tgMainPage.vue';

</script>

