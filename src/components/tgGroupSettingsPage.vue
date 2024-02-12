<template>


    <div class="main">
        <img style="width: 100%;" :src="`/api/files/groups/${props.groupId}/${allGroupsData.allMessages[props.groupId].group.avatar}`" alt="">
        <div style="width: 100%;margin-bottom: 1rem;">
            <v-btn @click="fileInput?.click()" icon="mdi-upload" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
        </div>
        <v-col style="padding: 1rem;">


<input accept="image/*" ref="fileInput" @change="upload_" type="file" hidden>

            <v-text-field
            label="group name"
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
        <v-btn @click="deleteGroup" variant="outlined" color="error" prepend-icon="mdi-delete">delete group</v-btn>
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

const {allGroupsData}=storeToRefs(useDataStore())
const router=useRouter()
const props=defineProps(['groupId'])





const fileInput=ref()

const name =ref(allGroupsData.value.allMessages[props.groupId].group.name)
const about =ref(allGroupsData.value.allMessages[props.groupId].group.about)




async function upload_(){
    var formData = new FormData();
    formData.append('avatar', fileInput.value.files[0]);
    await pb.collection('groups').update(props.groupId, formData);
    await allGroupsData.value.allMessages[props.groupId].updateGroup()

}



async function change(){
    await pb.collection('groups').update(props.groupId, {'name':name.value, 'about':about.value});
    await allGroupsData.value.allMessages[props.groupId].updateGroup()
}

function cancel(){
    name.value=allGroupsData.value.allMessages[props.groupId].group.name
    about.value=allGroupsData.value.allMessages[props.groupId].group.about
}


async function deleteGroup(){
    await pb.collection('groups').delete(props.groupId)
    router.back()
}
</script>