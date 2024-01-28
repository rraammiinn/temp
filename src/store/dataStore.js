import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

import {
    AllChatsData,
    // AllGroupsData,
    // AllChannelsData
} from '@/store/dataModels'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const useDataStore = defineStore('data',{
    state:()=>({
        allChatsData:new AllChatsData(),
        // allGroupsData:new AllGroupsData(),
        // allChannelsData:new AllChannelsData(),
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

        // async updateGroupMems(groupId){await allGroupsData.updateMembers(groupId)},
        // async updateChannelMems(channelId){await allChannelsData.updateMembers(channelId)},

        // async updateGroupRels(){await allGroupsData.updateRels()},
        // async updateChannelRels(){await allChannelsData.updateRels()},

        // async updateGroupUnseenCount(id){await allGroupsData.updateUnseenCount(id)},
        // async updateChannelUnseenCount(id){await allChannelsData.updateUnseenCount(id)},


        async updateChatUnseenCount(id){await this.allChatsData.updateUnseenCount(id)},
        async updateContacts(){await this.allChatsData.updateContacts()},
        async updateChatRels(){await this.allChatsData.updateRels()},
        async updateAllChatMessages(){await this.allChatsData.updateAllMessages()},

        // async updateAllGroupMessages(){await allGroupsData.updateAllMessages()},




        // async updateAllChannelMessages(){await allChannelsData.updateAllMessages()},
        async updateAllMessages(){
            // await this.updateAllChatMessages()
            await Promise.allSettled([
            // new Promise((resolve,reject)=>{this.updateAllChatMessages().then(resolve).catch(reject)})
            this.updateAllChatMessages(),
            // this.updateAllGroupMessages(),
            // this.updateAllChannelMessages()
        ])
    }
    },
    getters:{
        allMessagesSorted:(state)=>Object.fromEntries(Object.entries({
            ...state.allChatsData.allMessages,
            // ...state.allGroupsData.allMessages,
            // ...state.allChannelsData.allMessages
        }).sort((a,b)=>new Date(b[1].lastMessage?.created).getTime()-new Date(a[1].lastMessage?.created).getTime()))
    }
}
)