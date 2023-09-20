import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

    export const useDataStore = defineStore('data',{
        state:()=>({
            contacts,
            rels,
            allMessages
        }),
        actions:{
            updateContacts:async()=>{this.contacts=await pb.collection('contacts').getFullList({
                sort: '-created',
                filter: `follower = "${useAuthStore().authData.id}"`
            })},
            updateRels:async()=>{this.rels=await pb.collection('rels').getFullList({
                expand:'follower,following'
            })},
            updateAllMessages:async()=>{for await (const rel of this.rels){
                const index=(rel.follower == useAuthStore().authData.id) ? rel.following : rel.follower
                allMessages.value[index] = {lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null}
                try{
                allMessages.value[index]['lastMessage'] = JSON.parse(localStorage.getItem(`lastMessage_${index}`)) || await pb.collection('messages').getFirstListItem(`from = "${index}" || to = "${index}"`, {sort:'-created'})
                }catch{}
                allMessages.value[index]['other'] = (rel.follower == useAuthStore().authData.id) ? rel.expand.following : rel.expand.follower
            }}
        }
    })