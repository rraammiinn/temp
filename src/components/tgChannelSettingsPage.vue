<template>


    <div class="main">
        <img style="width: 100%;" :src="getChannelAvatarUrl(props.channelId, allChannelsData.allDatas.get(props.channelId).channel.avatar)" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="fileInput?.click()" icon="mdi-upload" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">


<input accept="image/*" ref="fileInput" @change="upload_" type="file" hidden>

            <v-text-field
            dir="auto"
            label="channel name"
            persistent-hint
            variant="outlined"
            v-model="name"
            
          ></v-text-field>
          <v-textarea
          dir="auto"
          label="about"
          auto-grow
          variant="outlined"
          rows="3"
          row-height="25"
          shaped
          v-model="about"
        ></v-textarea>
        <div style="margin-left: auto;width: fit-content;">
            <v-btn @click="cancel" prepend-icon="mdi-cancel" style="margin-right: 1rem;">cancel</v-btn>
            <v-btn @click="change" prepend-icon="mdi-check">change</v-btn>
        </div>
        <v-divider style="margin-top: 3rem;margin-bottom: 3rem;"/>




        <v-dialog transition="dialog-bottom-transition">
            <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="outlined" color="error" prepend-icon="mdi-delete">delete channel</v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card title="delete channel">
                <v-card-text>
                    are you sure you wana delete this channel ?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn @click="isActive.value = false" variant="outlined">
                        cancel
                    </v-btn>
                    <v-btn @click="async()=>{await deleteChannel();isActive.value = false;}" color="error" variant="elevated">
                        delete
                    </v-btn>
                </v-card-actions>
                </v-card>
            </template>
            </v-dialog>
        </v-col>
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
import { inject, ref, defineProps } from 'vue';
import {storeToRefs} from 'pinia'

import {useAuthStore} from '@/store/authStore'
import { useDataStore } from '@/store/dataStore';
import { useRouter } from 'vue-router';

import {useOtherStore} from '@/store/otherStore'

import {getChannelAvatarUrl} from '@/funcs/commonFuncs';

const {channelSearch}=storeToRefs(useOtherStore())


const {showError, showAlert, showProgressBar, hideProgressBar} = useOtherStore()

const {allChannelsData}=storeToRefs(useDataStore())
const router=useRouter()
const props=defineProps(['channelId'])





const fileInput=ref()

const name =ref(allChannelsData.value.allDatas.get(props.channelId).channel.name)
const about =ref(allChannelsData.value.allDatas.get(props.channelId).channel.about)

const historyLengthOffset = inject('historyLengthOffset')




async function upload_(){
    showProgressBar()
    try{
        let formData = new FormData();
        formData.append('avatar', fileInput.value.files[0]);
        await pb.collection('channels').update(props.channelId, formData);
        await allChannelsData.value.allDatas.get(props.channelId).updateChannel()
        showAlert('new avatar uploaded successfully', 'success')
    }catch{showError('uploading avatar failed.')}
    hideProgressBar()


}



async function change(){
    showProgressBar()
    try{
        await pb.collection('channels').update(props.channelId, {'name':name.value, 'about':about.value});
        await allChannelsData.value.allDatas.get(props.channelId).updateChannel()
        showAlert('changes applied successfully', 'success')
    }catch{showError('changing channel name and about failed.')}
    hideProgressBar()

}

function cancel(){
    name.value=allChannelsData.value.allDatas.get(props.channelId).channel.name
    about.value=allChannelsData.value.allDatas.get(props.channelId).channel.about
}


async function deleteChannel(){
    showProgressBar()
    try{
        await pb.collection('channels').delete(props.channelId)
        showAlert('channel deleted successfully', 'success')
        const historyLength = -(router.options.history.state.position - historyLengthOffset);
        const searchTerm=channelSearch.value;
        channelSearch.value='';
        channelSearch.value=searchTerm;
        router.go(historyLength)
        if(navigator.standalone || window.matchMedia('(display-mode: standalone)').matches){
            router.back();
        }
    }catch{showError('deleting channel failed.')}
    hideProgressBar()

}
</script>