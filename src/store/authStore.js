import { defineStore } from 'pinia'
import {pb} from '@/funcs/pb';

import { useDataStore } from '@/store/dataStore';


export const useAuthStore = defineStore('auth',{
    state:()=>({isLoggedIn:pb.authStore.isValid,isVerified:pb.authStore?.model?.verified, authData:pb.authStore.model}),
    actions:{
        async refreshAuthStore(){await pb.collection('users').authRefresh();this.updateLogInState();this.updateAuthData();},
        updateLogInState(){this.isLoggedIn=pb.authStore.isValid;this.isVerified=pb.authStore?.model?.verified ?? false;},
        updateAuthData(){this.authData=pb.authStore.model},

        async logOut(){
            try{
                await pb.collection('users').update(this.authData.value.id,{online:false})
            }catch{}finally{
                useDataStore().unsubscribeAll()
                pb.authStore.clear();
                this.updateLogInState()
            }
        },
        async reset(){
            try{
                // clearAllDatas();
                useDataStore().unsubscribeAll()
                // if(activeAccountId)return
                await pb.collection('users').update(pb.authStore.model.id,{online:false})
            }catch{}finally{
                useDataStore().uninitialize();
                this.isLoggedIn=false;
                this.isVerified=false;
                pb.authStore.clear()
            }
        }
    },
    getters:{
    }
})