<template>

<div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4.1rem;">
    <div class="main">
        <img style="width: 100%;" :src="getUserAvatarUrl(props.user.id, props.user.avatar)" alt="">
        <div style="width: 100%;margin-bottom: 1rem;display: flex;justify-content: space-between;padding: 1rem;margin-top: -3rem;align-items: center;">
            <div style="display: flex;justify-content: space-between;gap: 1rem;align-items: center;">
                <v-btn @click="shareType='chat';shareId=props.user.id;showShareSheet=true;" icon="mdi-share-all" style="width: 1.5rem;height: 1.5rem;font-size: .5rem"></v-btn>
                <v-btn @click="copyLink" :color="copied ? 'success' : 'default'" :icon=" copied ? 'mdi-check' : 'mdi-content-copy'" style="width: 1.5rem;height: 1.5rem;font-size: .5rem"></v-btn>
            </div>
            <v-btn @click="showUser=false;if($route.name=='group')$router.push({name:'chat',params:{otherId:props.user.id},query:{showUser:false}})" icon="mdi-message"></v-btn>
        </div>
        <v-col style="padding: 1rem;">
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.user.name}}</h3><h5 style="opacity: .5;">name</h5>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.user.username}}</h3><h5 style="opacity: .5;">username</h5>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h3>{{props.user.bio}}</h3><h5 style="opacity: .5;">bio</h5>
            </div>
        </v-col>
    </div>

    <div style="height: 3.25rem;"></div>

<v-btn @click="block(props.user.id)" v-if="props.isInRel && !props.blocked" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="error">block</v-btn>
<v-btn @click="unblock(props.user.id)" v-if="props.isInRel && props.blocked" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="primary">unblock</v-btn>

</div>

</template>

<style scoped>
.main{
    max-width: 50rem;
    margin: auto;
}
</style>

<script setup>
import { inject, ref } from 'vue';
import { block,unblock } from '@/funcs/chatFuncs';

import {getUserAvatarUrl} from '@/funcs/commonFuncs';


import {storeToRefs} from 'pinia'

import {useOtherStore} from '@/store/otherStore'

const {showShareSheet, shareId, shareType} = storeToRefs(useOtherStore())



const props=defineProps(['user','isInRel','blocked'])
const showUser=inject('showUser')

const copied = ref(false)

async function copyLink(){
      try{
        await navigator.clipboard.writeText(window.location);
        copied.value=true;
        setTimeout(() => {
          copied.value=false;
        }, 3000);
      }catch{}
    }

</script>