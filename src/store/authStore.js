import { defineStore } from 'pinia'
import pb from '@/main'

export const useAuthStore = defineStore('auth',{
    state:()=>({isLoggedIn:pb.authStore.isValid, authData:pb.authStore.model}),
    actions:{
        updateLogInState(){this.isLoggedIn=pb.authStore.isValid},
        updateAuthData(){this.authData=pb.authStore.model}
    },
    getters:{
    }
})