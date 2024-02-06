<template>

    <div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4rem;">
        <div class="main">
            <img style="width: 100%;" :src="`/api/files/channels/${props.channel.id}/${props.channel.avatar}`" alt="">
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
                        <v-avatar @click="$router.push({name:'chat', params:{otherId:props.owner.id},query:{initMessageId:'',showUser:true}})" :image="`/api/files/users/${props.owner.id}/${props.owner.avatar}`"></v-avatar>
                    </div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.channel.about}}</h3><h5 style="opacity: .5;">about</h5>
                </div>
            </v-col>
        </div>
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
    
    const props=defineProps(['channel','owner'])
    const showChannel=inject('showChannel')
    
    
    </script>