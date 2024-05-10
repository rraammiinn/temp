<template>
    <div style="height: 100dvh;width: 100vw;display: flex;justify-content: center;align-items: center;">
        <v-col v-if="pb.authStore.isValid">
            <h5 style="font-weight: bold;opacity: .85;text-align: center;margin-bottom: 3rem;">a verification link has been sent to your email.</h5>
            <v-row style="width: fit-content;margin: auto;">
                <v-btn @click="$router.replace('/login')" style="margin-right: 1rem;" prepend-icon="mdi-arrow-left">change</v-btn>
                <v-btn @click="requestVerification" :disabled="disabled" color="primary" prepend-icon="mdi-refresh">{{ btnText }}</v-btn>
            </v-row>
        </v-col>
    </div>
</template>



<script setup>
import { ref } from 'vue';
import {pb} from '@/funcs/pb';
import {useAuthStore} from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { useRouter, useRoute } from 'vue-router';

import {useOtherStore} from '@/store/otherStore'


const {showError, showProgressBar, hideProgressBar} = useOtherStore()


const {saveAccount, setAccount} = useDataStore()
const route=useRoute()
const activeAccountId=route.query.activeAccountId
const router=useRouter()
const {updateLogInState,updateAuthData,refreshAuthStore}=useAuthStore()
const disabled=ref(false)
const btnText=ref('resend')

await refreshAuthStore();

if(pb.authStore?.model?.verified){
    saveAccount()
    if(activeAccountId){
        await setAccount(activeAccountId)
        await refreshAuthStore();
        router.replace('/')
    }else{router.replace('/')}
};

pb.collection('users').subscribe(pb.authStore.model.id,async(e)=>{
        await pb.collection('users').authRefresh();


        if(pb.authStore.model.verified){
            pb.collection('users').unsubscribe(pb.authStore.model.id)
            await refreshAuthStore();
            saveAccount()
            if(activeAccountId){
                await setAccount(activeAccountId)
                await refreshAuthStore();
                router.replace('/')
                return
            }else{router.replace('/')}
        }
    })

try{
    await requestVerification()
}catch{showError('sending verification email failed.\nmake sure your email is valid.')}


    
async function requestVerification(){
    try{
        disabled.value=true
    await pb.collection('users').requestVerification(useAuthStore().authData.email);
    btnText.value=149
    const counter = setInterval(() => {
        btnText.value--;
    }, 1000);
    setTimeout(() => {
        disabled.value=false
        clearInterval(counter)
        btnText.value='resend'
    }, 150000);
    }catch{disabled.value=false;showError('sending verification email failed.\nmake sure your email is valid.')}
    
}
</script>