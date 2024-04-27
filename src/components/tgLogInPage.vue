<template>
    <div style="height: 100dvh;width: 100vw;display: flex;justify-content: center;align-items: center;overflow-y: auto;padding-top: 3rem;padding-bottom: 3rem;">
        <v-col>
            <v-row style="width: inherit;margin: auto;">
                <v-text-field :class="{shrinked : (userExists && user)}" @change="checkUserExistence" v-model="email" style="margin-bottom: 1rem;" :rules="[rules.required, rules.validEmail]" prepend-inner-icon="mdi-email" variant="outlined" label="email"></v-text-field>
                <img v-if="userExists && user" :src="getUserAvatarUrl(user.id, user.avatar)" style="border-radius: .25rem;width: 3.5rem;height: 3.5rem;margin-left: 1rem;object-fit: cover;">
            </v-row>
            <v-text-field v-model="password" style="margin-bottom: .25rem;" :rules="[rules.required, rules.min]" @click:append-inner="showPass = !showPass" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" prepend-inner-icon="mdi-key" :type="showPass ? 'text' : 'password'" variant="outlined" label="password"></v-text-field>
            <v-btn v-if="userExists && email" @click="async()=>{await pb.collection('users').requestPasswordReset(email);}" variant="text" color="warning" style="opacity: .85;font-size: .65rem;font-weight: bold;margin-left: -1rem;">change password</v-btn>
            <v-text-field v-if="!userExists" v-model="confirmPassword" style="margin-top: 1rem;" :rules="[rules.required, rules.min, rules.match]" @click:append-inner="showConfPass = !showConfPass" :append-inner-icon="showConfPass ? 'mdi-eye' : 'mdi-eye-off'" prepend-inner-icon="mdi-key" :type="showConfPass ? 'text' : 'password'" variant="outlined" label="confirm password"></v-text-field>

            <v-expansion-panels v-if="!userExists" style="margin-top: 1rem;margin-bottom: 1.5rem;">
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <div style="display: flex;align-items: center;justify-content: space-between; width: 100%;">
                            <span>extra</span>
                            <div style="display: flex;align-items: center;margin-right: 1rem;">
                                <span style="margin-left: 1rem;" v-show="name">name :</span>
                                <span style="font-weight: bold;margin-left: .25rem;" v-show="name">{{ name }}</span>
                                <img v-show="avatar?.[0]" ref="preview" style="border-radius: .25rem;width: 3.5rem;height: 3.5rem;margin-left: 1rem;object-fit: cover;" alt="">
                            </div>
                        </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-text-field dir="auto" v-model="name" label="name" prepend-inner-icon="mdi-account" variant="outlined"></v-text-field>
                        <v-file-input v-model="avatar" label="avatar" accept="image/*" prepend-inner-icon="mdi-image" :prepend-icon="null"  variant="outlined"></v-file-input>
                        <v-textarea v-model="bio" variant="outlined" rows="1" auto-grow label="bio"></v-textarea>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>


            <v-row>
                <v-btn :loading="passwordLogInLoading" @click="passwordLogIn" :disabled="disabled" style="margin-top: 1.5rem; margin-left: .75rem;" prepend-icon="mdi-email" color="primary">{{ userExists ? 'login' : 'signup' }}<template v-slot:loader><v-progress-linear indeterminate></v-progress-linear></template></v-btn>
                <v-btn :loading="googleLogInLoading" @click="googleLogIn" style="margin-top: 1.5rem; margin-left: .75rem;" prepend-icon="mdi-google" color="error">google login<template v-slot:loader><v-progress-linear indeterminate></v-progress-linear></template></v-btn>
            </v-row>
        </v-col>
    </div>
</template>

<style>
.shrinked{
    width: calc(100% - 4.5rem);
}
</style>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import {pb} from '@/funcs/pb';
import { storeToRefs } from 'pinia';

import {useAuthStore} from '@/store/authStore';
import { useRouter } from 'vue-router';

import isEmail from 'validator/lib/isEmail'

import {useOtherStore} from '@/store/otherStore'

import {getUserAvatarUrl} from '@/funcs/commonFuncs';

import { useDataStore } from '@/store/dataStore';

const {isInitialized} = storeToRefs(useDataStore())

const {clearAllDatas} = useDataStore()

const {showError, showProgressBar, hideProgressBar} = useOtherStore()


const {isLoggedIn, isVerified} = storeToRefs(useAuthStore())

const router=useRouter()

// if(isLoggedIn){router.push('/emailVerification')}


const {updateLogInState,updateAuthData,refreshAuthStore}=useAuthStore()

const passwordLogInLoading=ref(false)
const googleLogInLoading=ref(false)

let authData;

// const expanded=ref(false)
const name=ref('')
const bio=ref('')
const avatar=ref()
const preview=ref()

const user=ref()
const userExists=ref(true)
const email=ref('')
const password=ref('')
const confirmPassword=ref('')
const showPass=ref(false)
const showConfPass=ref(false)
const rules=ref({
    required: value => !!value || 'required',
    validEmail: value => isEmail(value) || 'this is not a valid email',
    min: value => value.length >= 8 || 'password should be at least 8 character long',
    match: value => (userExists.value || password.value == confirmPassword.value) || "confirm password doesn't match password"
})


clearAllDatas();

async function passwordLogIn(){
    passwordLogInLoading.value=true
    reset()

    try{
    if(!email.value || password.value.length < 8) return;
    if(userExists.value){
    authData = await pb.collection('users').authWithPassword(
    email.value,
    password.value)}
    else if(password.value==confirmPassword.value){
        // authData = await pb.collection('users').create({"username":`"${email.value}"`, "email":`"${email.value}"`, "password":`"${password.value}"`, "passwordConfirm":`"${confirmPassword.value}"`, "emailVisibility": "true"});
        const formData = new FormData();
        formData.append('name', name.value || email.value.substring(0, email.value.indexOf('@')))
        // formData.append('username', email.value.substring(0, email.value.indexOf('@')))
        formData.append('email', email.value)
        formData.append('password', password.value)
        formData.append('passwordConfirm', confirmPassword.value)
        formData.append('emailVisibility', true)
        formData.append('bio', bio.value)
        if(avatar.value?.[0]){
            formData.append('avatar', avatar.value[0])
        }
        await pb.collection('users').create(formData)
        authData = await pb.collection('users').authWithPassword(
            email.value,
            password.value)
    }
    if(authData) {router.replace('/emailVerification')}
    }catch{
        if(userExists.value){showError('email or password is wrong.')}
        else{
            showError('something went wrong.')
        }
}
    passwordLogInLoading.value=false
}
async function googleLogIn(){
    googleLogInLoading.value=true
    reset()

    try{
    authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    if(authData) {
        await refreshAuthStore();
        router.replace('/')
    }
    }catch{showError('some thing went wrong.')}

    googleLogInLoading.value=false
}

async function checkUserExistence(){
    try{
    user.value = await pb.collection('users').getFirstListItem(`email = "${email.value}"`)
    userExists.value=true
    }
    catch{userExists.value=false}}

    
    // function changePreviewAvatar(){
    //     // img.value.srcObject=avatar.value?.[0]
    // }

    // const imgUrl=computed(()=>{URL.createObjectURL(avatar.value?.[0])})

    // watchEffect(()=>{
    //     const reader = new FileReader()
    //     reader.onloadend=()=>{img.value.src = reader.result}
    //     reader.readAsDataURL(avatar?.[0])
    // })


    // const input = document.getElementById('file-input');
const previewAvatar = () => {
    // const file = input.files;
    if (avatar.value?.[0]) {
        const fileReader = new FileReader();
        // const preview = document.getElementById('file-preview');
fileReader.onload = function (event) {
            preview.value.setAttribute('src', event.target.result);
        }
        fileReader.readAsDataURL(avatar.value[0]);
    }
}
// input.addEventListener("change", previewAvatar);

function reset(){
    isInitialized.value=false;

    pb.authStore.clear()
    isLoggedIn.value=false;
    isVerified.value=false;

}



watchEffect(previewAvatar)

const disabled = computed(()=>!(isEmail(email.value) && password.value.length >= 8 && (userExists.value || password.value == confirmPassword.value)))
</script>