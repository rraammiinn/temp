import { defineStore } from 'pinia'
import pb from '@/main'

export const useAuthStore = defineStore('auth',{
    state:()=>({isLoggedIn:pb.authStore.isValid,isVerified:pb.authStore?.model?.verified, authData:pb.authStore.model}),
    actions:{
        async refreshAuthStore(){await pb.collection('users').authRefresh();this.updateLogInState();this.updateAuthData();},
        updateLogInState(){this.isLoggedIn=pb.authStore.isValid;this.isVerified=pb.authStore?.model?.verified ?? false;},
        updateAuthData(){this.authData=pb.authStore.model}
    },
    getters:{
    }
})