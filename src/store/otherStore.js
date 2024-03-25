import { defineStore } from 'pinia'
import pb from '@/main'

export const useOtherStore = defineStore('other',{
    state:()=>({
        errorVisibility:false,
         errorMessage:'',

         alertVisibility:false,
        alertMessage:'',
        alertType:null,

        progressBarVisibility:false,


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
        showError(errorMessage){this.errorMessage=errorMessage;this.errorVisibility=true;},
        showAlert(alertMessage, alertType){this.alertMessage=alertMessage;this.alertType=alertType;this.alertVisibility=true;},

        showProgressBar(){this.progressBarVisibility=true},
        hideProgressBar(){this.progressBarVisibility=false}
    },
    getters:{
    }
})