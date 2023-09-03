<template>
    <div style="height: 100vh;width: 100vw;display: flex;justify-content: center;align-items: center;">
        <v-col>
            <v-text-field @change="checkUserExistence" v-model="email" style="margin-bottom: 1rem;" :rules="[rules.required]" prepend-inner-icon="mdi-email" variant="outlined" label="email"></v-text-field>
            <v-text-field v-model="password" style="margin-bottom: 1rem;" :rules="[rules.required, rules.min]" @click:append-inner="showPass = !showPass" :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" prepend-inner-icon="mdi-key" :type="showPass ? 'text' : 'password'" variant="outlined" label="password"></v-text-field>
            <v-text-field v-if="!userExists" v-model="confirmPassword" style="margin-bottom: 1rem;" :rules="[rules.required, rules.min, rules.match]" @click:append-inner="showConfPass = !showConfPass" :append-inner-icon="showConfPass ? 'mdi-eye' : 'mdi-eye-off'" prepend-inner-icon="mdi-key" :type="showConfPass ? 'text' : 'password'" variant="outlined" label="confirm password"></v-text-field>
            <v-row>
                <v-btn :loading="passwordLogInLoading" @click="passwordLogIn" style="margin-top: .5rem; margin-left: .75rem;" prepend-icon="mdi-email" color="primary">{{ userExists ? 'login' : 'signup' }}<template v-slot:loader><v-progress-linear indeterminate></v-progress-linear></template></v-btn>
                <v-btn :loading="googleLogInLoading" @click="googleLogIn" style="margin-top: .5rem; margin-left: .75rem;" prepend-icon="mdi-google" color="error">google login<template v-slot:loader><v-progress-linear indeterminate></v-progress-linear></template></v-btn>
            </v-row>
        </v-col>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import pb from '@/main';

const currentPage=inject('currentPage')

const passwordLogInLoading=ref(false)
const googleLogInLoading=ref(false)

var authData;

const userExists=ref(true)
const email=ref('')
const password=ref('')
const confirmPassword=ref('')
const showPass=ref(false)
const showConfPass=ref(false)
const rules=ref({
    required: value => !!value || 'required',
    min: value => value.length >= 8 || 'password should be at least 8 character long',
    match: value => (userExists.value || password.value == confirmPassword.value) || "confirm password doesn't match password"
})

async function passwordLogIn(){
    if(!email.value || password.value.length < 8) return;
    passwordLogInLoading.value=true
    if(userExists.value){
    authData = await pb.collection('users').authWithPassword(
    email.value,
    password.value)}
    else if(password.value==confirmPassword.value){
        // authData = await pb.collection('users').create({"username":`"${email.value}"`, "email":`"${email.value}"`, "password":`"${password.value}"`, "passwordConfirm":`"${confirmPassword.value}"`, "emailVisibility": "true"});
        const formData = new FormData();
        formData.append('name', email.value.substring(0, email.value.indexOf('@')))














        
        formData.append('username', email.value.substring(0, email.value.indexOf('@')))
        formData.append('email', email.value)
        formData.append('password', password.value)
        formData.append('passwordConfirm', confirmPassword.value)
        formData.append('emailVisibility', true)
        await pb.collection('users').create(formData)
        authData = await pb.collection('users').authWithPassword(
            email.value,
            password.value)
    }
    if(authData) currentPage.value='main';
}
async function googleLogIn(){
    googleLogInLoading.value=true
    authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    if(authData) currentPage.value='main';
}

async function checkUserExistence(){
    try{
    const user = await pb.collection('users').getFirstListItem(`email = "${email.value}"`)
    userExists.value=true
    }
    catch{userExists.value=false}}
</script>