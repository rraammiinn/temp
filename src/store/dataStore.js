import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

import {
    AllChatsData,
    AllGroupsData,
    AllChannelsData
} from '@/store/dataModels'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const useDataStore = defineStore('data',{
    state:()=>({
        allChatsData:new AllChatsData(),
        allGroupsData:new AllGroupsData(),
        allChannelsData:new AllChannelsData(),
        
        contacts:{},


        users:[],
        searchedGroups:[],
        searchedChannels:[],

        searchMessageResults:[]
        // groups:{},


        // groupRels:[],
        // channelRels:[],

        // contacts:[],
        // rels:[],
        // backRels:[],
        // groupMembers:[],
        // channelMembers:[],
        // allChatMessages:{},
        // allGroupMessages:{},
        // allChannelMessages:{}
    }),
    actions:{
        // async updateGroups(){await allGroupsData.updateGroups()},
        async updateContacts(){await pb.collection('contacts').getFullList({expand:'following'}).then(res=>{this.contacts={};res.forEach(contact=>this.contacts[contact.following]={...contact.expand.following,contactId:contact.id})})},


        async updateGroupMems(groupId){await this.allGroupsData.updateMembers(groupId)},
        async updateChannelMems(channelId){await this.allChannelsData.updateMembers(channelId)},

        async updateGroupRels(){await this.allGroupsData.updateRels()},
        async updateChannelRels(){await this.allChannelsData.updateRels()},

        async updateGroupUnseenCount(id){await this.allGroupsData.updateUnseenCount(id)},
        async updateChannelUnseenCount(id){await this.allChannelsData.updateUnseenCount(id)},


        async updateChatUnseenCount(id){await this.allChatsData.updateUnseenCount(id)},
        // async updateContacts(){await this.allChatsData.updateContacts()},
        async updateChatRels(){await this.allChatsData.updateRels()},

        async updateAllChatMessages(){await this.allChatsData.updateAllMessages()},
        async updateAllGroupMessages(){await this.allGroupsData.updateAllMessages()},
        async updateAllChannelMessages(){await this.allChannelsData.updateAllMessages()},

        async updateAllMessages(){
            // await this.updateAllChatMessages()
            await Promise.allSettled([
            // new Promise((resolve,reject)=>{this.updateAllChatMessages().then(resolve).catch(reject)})
            this.updateAllChatMessages(),
            this.updateAllGroupMessages(),
            this.updateAllChannelMessages()
        ])
    },
    async init(){
        await Promise.allSettled([
            this.updateChatRels(),
            this.updateGroupRels(),
            this.updateChannelRels(),
            this.updateContacts()
        ])

        await this.updateAllMessages()
    }
    },
    getters:{
        // allDatasSorted:(state)=>Object.fromEntries(Object.entries({
        //     ...state.allChatsData.allDatas,
        //     ...state.allGroupsData.allDatas,
        //     ...state.allChannelsData.allDatas
        // }).sort((a,b)=>(new Date(b[1].lastMessage?.created).getTime() > new Date(a[1].lastMessage?.created).getTime() ? 1 : -1))),

        allDatasSorted:(state)=>new Map(Object.entries({
            ...state.allChatsData.allDatas,
            ...state.allGroupsData.allDatas,
            ...state.allChannelsData.allDatas
        }).sort((a,b)=>(new Date(b[1].lastMessage?.created).getTime() > new Date(a[1].lastMessage?.created).getTime() ? 1 : -1))),






        allSendables(state){
            const contacts = Object.keys(state.contacts).map(i=>({receiverType:'chat',subject:state.contacts[i] , id:i}))
            const chats = Object.values(state.allChatsData.allDatas).filter(i=>!Object.keys(state.contacts).includes(i.other.id)).filter(i=>i.backActive).filter(i=>i.other.id != pb.authStore.model.id).map(i=>({receiverType:'chat',subject:i.other , id:i.other.id}))
            const groups = Object.values(state.allGroupsData.allDatas).filter(i=>i.active).map(i=>({receiverType:'group',subject:i.group , id:i.group.id}))
            const channels = Object.values(state.allChannelsData.allDatas).filter(i=>i.channel.owner == pb.authStore.model.id).map(i=>({receiverType:'channel',subject:i.channel , id:i.channel.id}))

            return[...contacts, ...chats, ...groups, ...channels]
        },

        all:(state)=>({...Object.fromEntries(Object.keys(state.contacts).map(i=>([i,{other:state.contacts[i], about:state.contacts[i].bio}]))), ...Object.fromEntries(Object.keys(state.allChatsData.allDatas).map(i=>([i,{other:state.allChatsData.allDatas[i].other, about:state.allChatsData.allDatas[i].other.bio}]))), ...Object.fromEntries(Object.keys(state.allGroupsData.allDatas).map(i=>([i,{other:state.allGroupsData.allDatas[i].group, about:state.allGroupsData.allDatas[i].group.about}]))), ...Object.fromEntries(Object.keys(state.allChannelsData.allDatas).map(i=>([i,{other:state.allChannelsData.allDatas[i].channel, about:state.allChannelsData.allDatas[i].channel.about}])))})
    }
}
)