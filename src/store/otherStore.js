import { defineStore } from 'pinia'
import pb from '@/main'

export const useOtherStore = defineStore('other',{
    state:()=>({
        errorVisibility:false,
         errorMessage:'',

         userSearch:'',
         groupSearch:'',
         channelSearch:'',

         showUserSearch:'',
         showGroupSearch:'',
         showChannelSearch:'',

         searchMessage:'',
         showMessageSearch:''
        }),
    actions:{
        showError(errorMessage){this.errorMessage=errorMessage;this.errorVisibility=true;}
    },
    getters:{
    }
})