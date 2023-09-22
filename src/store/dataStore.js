import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

    export const useDataStore = defineStore('data',{
        state:()=>({
            contacts:[],
            rels:[],
            allChatMessages:{},
            allGroupMessages:{},
            allChannelMessages:{}
        }),
        actions:{
            async updateContacts(){this.contacts=await pb.collection('contacts').getFullList({
                sort: '-created',
                filter: `follower = "${useAuthStore().authData.id}"`
            })},
            async updateRels(){this.rels=await pb.collection('rels').getFullList({
                expand:'follower,following'
            });console.log('relsss -> ',this.rels)},
            async updateAllMessages(){for await (const rel of this.rels){
                const index=(rel.follower == useAuthStore().authData.id) ? rel.following : rel.follower
                this.allChatMessages[index] = {lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null,lastVisited:null,isOnline:false}
                try{
                this.allChatMessages[index]['lastMessage'] = JSON.parse(localStorage.getItem(`lastMessage_${index}`)) || await pb.collection('chatMessages').getFirstListItem(`from = "${index}" || to = "${index}"`, {sort:'-created'})
                }catch{}
                this.allChatMessages[index]['other'] = (rel.follower == useAuthStore().authData.id) ? rel.expand.following : rel.expand.follower
            };console.log('all msgs -> ',this.allChatMessages)}
        },
        getters:{
            allMessagesSorted:(state)=>Object.fromEntries(Object.entries({...state.allChatMessages,...state.allGroupMessages,...state.allChannelMessages}).sort((a,b)=>new Date(b[1].lastMessage?.created).getTime()-new Date(a[1].lastMessage?.created).getTime()))
        }
    })