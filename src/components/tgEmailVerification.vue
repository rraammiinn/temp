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
import pb from '@/main';
import {useAuthStore} from '@/store/authStore';
import { useRouter } from 'vue-router';

import {useOtherStore} from '@/store/otherStore'

const {showError, showProgressBar, hideProgressBar} = useOtherStore()

const router=useRouter()
const {updateLogInState,updateAuthData}=useAuthStore()
const disabled=ref(false)
const btnText=ref()


if(pb.authStore?.model?.verified)router.replace('/');

try{
    await requestVerification()
}catch{showError('sending verification email failed.\nmake sure your email is valid.')}


pb.collection('users').subscribe(useAuthStore().authData.id,async(e)=>{
        await pb.collection('users').authRefresh();


        if(pb.authStore.model.verified){
            pb.collection('users').unsubscribe(useAuthStore().authData.id)
            updateLogInState()
            updateAuthData()
            router.replace('/')
        }
    })

    
async function requestVerification(){
    try{

    }catch{showError('sending verification email failed.\nmake sure your email is valid.')}
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
    
}
</script>