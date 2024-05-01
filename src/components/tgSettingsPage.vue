<template>


    <div v-if="isLoggedIn" class="main">
        <img style="width: 100%;" :src="getUserAvatarUrl(authData.id, authData.avatar)" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="fileInput?.click()" icon="mdi-upload" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">


<input accept="image/*" ref="fileInput" @change="upload_" type="file" hidden>

            <v-text-field
            dir="auto"
            label="name"
            persistent-hint
            variant="outlined"
            v-model="name"
            
          ></v-text-field>
          <v-textarea
          dir="auto"
          label="bio"
          auto-grow
          variant="outlined"
          rows="3"
          row-height="25"
          shaped
          v-model="bio"
        ></v-textarea>
        <div style="margin-left: auto;width: fit-content;">
            <v-btn @click="cancel" prepend-icon="mdi-cancel" style="margin-right: 1rem;">cancel</v-btn>
            <v-btn @click="change" prepend-icon="mdi-check">change</v-btn>
        </div>
        <v-divider style="margin-top: 3rem;margin-bottom: 3rem;"/>
        <v-btn @click="logOut" color="error" prepend-icon="mdi-logout">log out</v-btn>
        </v-col>
    </div>

    <div v-else style="position: fixed;bottom: 0;width: 100%;">
        <div class="main">
        <v-col style="padding: 1rem;">
            <v-divider style="margin-top: 3rem;margin-bottom: 3rem;"/>
            <v-btn @click="logIn" color="primary" prepend-icon="mdi-login">log in</v-btn>
        </v-col>
    </div>
    </div>



</template>

<style scoped>
.main{
    max-width: 50rem;
    margin: auto;
}
</style>

<script setup>
import {pb} from '@/funcs/pb';
import { inject, ref } from 'vue';
import {storeToRefs} from 'pinia'

import {useAuthStore} from '@/store/authStore'
import { useRouter } from 'vue-router';

import {useOtherStore} from '@/store/otherStore'

import { useDataStore } from '@/store/dataStore';

import {getUserAvatarUrl} from '@/funcs/commonFuncs';


const {showError, showProgressBar, hideProgressBar} = useOtherStore()


const router=useRouter()


const {updateLogInState,updateAuthData} = useAuthStore()
const {isLoggedIn,authData}=storeToRefs(useAuthStore())

const {unsubscribeAll}=useDataStore()


async function logIn(){
    router.push('/login')
}
async function logOut(){
    try{
        await pb.collection('users').update(authData.value.id,{online:false})
    }finally{
        unsubscribeAll()
        pb.authStore.clear();
        updateLogInState()
    }
}




const fileInput=ref()

const name =ref(authData.value?.name)
const bio =ref(authData.value?.bio)




async function upload_(){
    showProgressBar()
    try{
        let formData = new FormData();
        formData.append('avatar', fileInput.value.files[0]);
        await pb.collection('users').update(authData.value.id, formData);
        updateAuthData()
    }catch{showError('uploading avatar failed.')}
    hideProgressBar()

}



async function change(){
    showProgressBar()
    try{
        await pb.collection('users').update(authData.value.id, {'name':name.value, 'bio':bio.value});
        updateAuthData()
    }catch{showError('changing name and bio failed.')}
    hideProgressBar()
}

function cancel(){
    name.value=authData.value?.name
    bio.value=authData.value?.bio
}
</script>