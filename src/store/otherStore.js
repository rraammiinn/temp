import { defineStore } from 'pinia'
import {pb} from '@/funcs/pb';
export const useOtherStore = defineStore('other',{
    state:()=>({
        errorVisibility:false,
         errorMessage:'',

         alertVisibility:false,
        alertMessage:'',
        alertType:null,
        alertOnClick:()=>{},

        progressBarVisibility:false,


         userSearch:'',
         groupSearch:'',
         channelSearch:'',

         showUserSearch:'',
         showGroupSearch:'',
         showChannelSearch:'',

         searchMessage:'',
         showMessageSearch:'',





        showShareSheet : false,

        shareSelectedList : [],
        shareType : '',
        shareMessage : '',

        shareId : ''
        }),
    actions:{
        showError(errorMessage){this.errorMessage=errorMessage;this.errorVisibility=true;},
        showAlert(alertMessage, alertType, onClick=()=>{}){this.alertMessage=alertMessage;this.alertType=alertType;this.alertVisibility=true;this.alertOnClick=onClick},

        showProgressBar(){this.progressBarVisibility=true},
        hideProgressBar(){this.progressBarVisibility=false},

        async share(){
            this.showProgressBar()
            try{
              await Promise.allSettled(this.shareSelectedList.map(i=>pb.collection(`${i.receiverType}Messages`).create({from:pb.authStore.model.id, to:i.id, group:i.id, channel:i.id, text:`${this.shareMessage}\ntg-${this.shareType}-link/${this.shareType}/${this.shareId}?showUser=true&showGroup=true&showChannel=true`})))
            }catch{}
            this.hideProgressBar()
          }
    },
    getters:{
    }
})