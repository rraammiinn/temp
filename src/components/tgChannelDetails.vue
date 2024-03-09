<template>

    <div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4.1rem;">
        <div class="main">
            <img style="width: 100%;" :src="getChannelAvatarUrl(props.channel.id, props.channel.avatar)" alt="">
            <div style="width: 100%;margin-bottom: 1rem;">
                <v-btn @click="showChannel=false;" icon="mdi-message" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
            </div>
            <v-col style="padding: 1rem;">
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.channel.name}}</h3><h5 style="opacity: .5;">channel name</h5>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex;justify-content: space-between;">
                        <h3>{{props.owner.name}}</h3>
                        <v-avatar @click="$router.push({name:'chat', params:{otherId:props.owner.id},query:{initMessageId:'',showUser:true}})" :image="getUserAvatarUrl(props.owner.id, props.owner.avatar)"></v-avatar>
                    </div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.channel.about}}</h3><h5 style="opacity: .5;">about</h5>
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
    import {subscribe,unsubscribe} from '@/funcs/channelFuncs'

    import {getChannelAvatarUrl, getUserAvatarUrl} from '@/funcs/commonFuncs';

    
    const props=defineProps(['channel','owner','subscribed'])
    const showChannel=inject('showChannel')
    
    
    </script>