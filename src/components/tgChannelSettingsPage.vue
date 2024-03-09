<template>


    <div class="main">
        <img style="width: 100%;" :src="getChannelAvatarUrl(props.channelId, allChannelsData.allMessages[props.channelId].channel.avatar)" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="fileInput?.click()" icon="mdi-upload" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">


<input accept="image/*" ref="fileInput" @change="upload_" type="file" hidden>

            <v-text-field
            label="channel name"
            persistent-hint
            variant="outlined"
            v-model="name"
            
          ></v-text-field>
          <v-textarea
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
                    <v-btn @click="deleteChannel" color="error" variant="elevated">
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
import pb from '@/main';
import { inject, ref, defineProps } from 'vue';
import {storeToRefs} from 'pinia'

import {useAuthStore} from '@/store/authStore'
import { useDataStore } from '@/store/dataStore';
import { useRouter } from 'vue-router';

import {useOtherStore} from '@/store/otherStore'

import {getChannelAvatarUrl} from '@/funcs/commonFuncs';


const {showError} = useOtherStore()

const {allChannelsData}=storeToRefs(useDataStore())
const router=useRouter()
const props=defineProps(['channelId'])





const fileInput=ref()

const name =ref(allChannelsData.value.allMessages[props.channelId].channel.name)
const about =ref(allChannelsData.value.allMessages[props.channelId].channel.about)




async function upload_(){
    try{
        var formData = new FormData();
    formData.append('avatar', fileInput.value.files[0]);
    await pb.collection('channels').update(props.channelId, formData);
    await allChannelsData.value.allMessages[props.channelId].updateChannel()
    }catch{showError('uploading avatar failed.')}


}



async function change(){
    try{
        await pb.collection('channels').update(props.channelId, {'name':name.value, 'about':about.value});
    await allChannelsData.value.allMessages[props.channelId].updateChannel()
    }catch{showError('changing channel name and about failed.')}

}

function cancel(){
    name.value=allChannelsData.value.allMessages[props.channelId].channel.name
    about.value=allChannelsData.value.allMessages[props.channelId].channel.about
}


async function deleteChannel(){
    try{
        await pb.collection('channels').delete(props.channelId)
    router.back()
    }catch{showError('deleting channel failed.')}

}
</script>