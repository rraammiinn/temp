<template>

    <div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4.1rem;">
        <div class="main">
            <img style="width: 100%;" :src="getChannelAvatarUrl(props.channel.id, props.channel.avatar)" alt="">
            <div style="width: 100%;margin-bottom: 1rem;display: flex;justify-content: space-between;padding: 1rem;margin-top: -3rem;align-items: center;">
            <div style="display: flex;justify-content: space-between;gap: 1rem;align-items: center;">
                <v-btn @click="shareType='channel';shareId=props.channel.id;showShareSheet=true;" icon="mdi-share-all" style="width: 1.5rem;height: 1.5rem;font-size: .5rem"></v-btn>
                <v-btn @click="copyLink" :color="copied ? 'success' : 'default'" :icon=" copied ? 'mdi-check' : 'mdi-content-copy'" style="width: 1.5rem;height: 1.5rem;font-size: .5rem"></v-btn>
            </div>
            <v-btn @click="showChannel=false;" icon="mdi-message"></v-btn>
        </div>
            <v-col style="padding: 1rem;">
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.channel.name}}</h3><h5 style="opacity: .5;">channel name</h5>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex;justify-content: space-between;">
                        <div>
                            <h3>{{props.owner.name}}</h3>
                            <h5 style="opacity: .5;">channel owner</h5>
                        </div>
                        <v-avatar @click="()=>{if(pb.authStore.model.id==props.owner.id)return;$router.push({name:'chat', params:{otherId:props.owner.id},query:{initMessageId:'',showUser:true}})}" :image="getUserAvatarUrl(props.owner.id, props.owner.avatar)"></v-avatar>
                    </div>
                </div>
                <div v-if="props.channel.about" style="margin-bottom: 1.5rem;">
                  <h5 v-for="line in props.channel.about.split('\n')">{{line}}</h5><h5 style="opacity: .5;">about</h5>
                </div>
            </v-col>
        </div>

        <div style="height: 3.25rem;"></div>

<v-btn @click="unsubscribe(props.channel.id)" v-if="props.subscribed" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="error">unsubscribe</v-btn>
<v-btn @click="subscribe(props.channel.id)" v-else style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="primary">subscribe</v-btn>

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
    import pb from '@/main';
    import {subscribe,unsubscribe} from '@/funcs/channelFuncs'

    import {getChannelAvatarUrl, getUserAvatarUrl} from '@/funcs/commonFuncs';


    import {storeToRefs} from 'pinia'

    import {useOtherStore} from '@/store/otherStore'

    const {showShareSheet, shareId, shareType} = storeToRefs(useOtherStore())


    
    const props=defineProps(['channel','owner','subscribed'])
    const showChannel=inject('showChannel')

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