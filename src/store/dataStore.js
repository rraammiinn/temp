import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

    export const useDataStore = defineStore('data',{
        state:()=>({
            contacts:[],
            rels:[],
            groupMembers:[],
            channelMembers:[],
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
            async updateAllChatMessages(){for await (const rel of this.rels){
                const index=(rel.follower == useAuthStore().authData.id) ? rel.following : rel.follower
                this.allChatMessages[index] = {lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null,lastVisited:null,isOnline:false}
                try{
                this.allChatMessages[index]['lastMessage'] = JSON.parse(localStorage.getItem(`lastMessage_${index}`)) || await pb.collection('chatMessages').getFirstListItem(`from = "${index}" || to = "${index}"`, {sort:'-created'})
                }catch{}
                this.allChatMessages[index]['other'] = (rel.follower == useAuthStore().authData.id) ? rel.expand.following : rel.expand.follower
                this.allChatMessages[index]['lastSeen'] = rel.lastseen || 0
                this.allChatMessages[index]['unseenCount'] = (await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${index}" && created > ${this.allChatMessages[index]['lastSeen']}`, sort:'-created'})).totalItems
                this.allChatMessages[index]['lastVisited'] = rel.expand.following.lastvisited
            };console.log('all msgs -> ',this.allChatMessages)},
            async updateGroupMembers(){this.groupMembers=await pb.collection('groupMembers').getFullList({
                expand:'group'
            });},
            async updateChannelMembers(){this.channelMembers=await pb.collection('channelMembers').getFullList({
                expand:'channel'
            });},
            async updateAllGroupMessages(){for await (const group of this.groupMembers){this.allGroupMessages[group.group]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null}
            this.allGroupMessages[group.group]['other']=group.expand.group
            this.allGroupMessages[group.group]['lastSeen']=group.lastSeen || 0
            this.allGroupMessages[group.group]['unseenCount']=(await pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && created > ${this.allGroupMessages[group.group]['lastSeen']}`, sort:'-created'})).totalItems
        }},
            async updateAllChannelMessages(){for await (const channel of this.channelMembers){this.allChannelMessages[channel.channel]={lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null}
            this.allChannelMessages[channel.channel]['other']=channel.expand.channel
            this.allChannelMessages[channel.channel]['lastSeen']=channel.lastSeen || 0
            this.allChannelMessages[channel.channel]['unseenCount']=(await pb.collection('channelMessages').getList(1, 1, {filter:`created > ${this.allChannelMessages[channel.channel]['lastSeen']}`, sort:'-created'})).totalItems
        }},
            async updateAllMessages(){this.updateAllChatMessages();this.updateAllGroupMessages();this.updateAllChannelMessages()}
        },
        getters:{
            allMessagesSorted:(state)=>Object.fromEntries(Object.entries({...state.allChatMessages,...state.allGroupMessages,...state.allChannelMessages}).sort((a,b)=>new Date(b[1].lastMessage?.created).getTime()-new Date(a[1].lastMessage?.created).getTime()))
        }
    })