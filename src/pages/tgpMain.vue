<template>
<tg-main>
<template #main><suspense><tg-main-page></tg-main-page></suspense></template>
<template #appBar><tg-main-app-bar></tg-main-app-bar></template>
</tg-main>
</template>

<script setup>
import { pb } from '@/funcs/pb';
import { provide } from 'vue';
// import { useRouter, useRoute } from 'vue-router';
// import {useAuthStore} from '@/store/authStore'
import { storeToRefs } from "pinia";
import { useOtherStore } from "@/store/otherStore";

import { useDataStore } from '@/store/dataStore';


// const route = useRoute()

// const reload = route.query?.reload

// if(reload === 'true')router.go()


const {init,subscribeAll,isInitialized}=useDataStore()


if(!isInitialized){
    try{
      subscribeAll()
      await pb.collection('users').update(pb.authStore.model.id,{online:true})
    }catch{}finally{
      await init()
    }
}

const {searchMessage}=storeToRefs(useOtherStore())

// const router=useRouter()
// const {isLoggedIn,isVerified,authData} = useAuthStore()
// // if(!isLoggedIn){router.push('/login')}
// // if(!isVerified){router.push('/login')}




// const searchMessage=ref('')
provide('searchMessage', searchMessage)

import tgMain from '../components/tgMain.vue';
import tgMainAppBar from '../components/tgMainAppBar.vue';
import tgMainPage from '../components/tgMainPage.vue';

</script>

