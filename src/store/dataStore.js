import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'
import {subscribeToNewMessages} from '@/funcs/chatFuncs'


import {
    AllChatsData,
    AllGroupsData,
    AllChannelsData,
    ChatData
} from '@/store/dataModels'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const useDataStore = defineStore('data',{
    state:()=>({
        allChatsData:new AllChatsData(),
        allGroupsData:new AllGroupsData(),
        allChannelsData:new AllChannelsData(),
        
        contacts:new Map(),


        users:[],
        searchedGroups:[],
        searchedChannels:[],

        searchMessageResults:[],

        isInitialized:false,
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
        async updateContacts(){await pb.collection('contacts').getFullList({expand:'following'}).then(res=>{this.contacts.clear();res.forEach(contact=>this.contacts.set(contact.following, {...contact.expand.following,contactId:contact.id}))})},


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
    },

subscribeContacts(){
    pb.collection('contacts').subscribe('*', this.updateContacts)
},



subscribeUsers(){
    pb.collection('users').subscribe('*',async(e)=>{
        try{
            this.allChatsData.allDatas.get(e.record.id).isOnline = e.record.online;
            this.allChatsData.allDatas.get(e.record.id).lastVisited = e.record.updated;
        }catch{}
    })
},

subscribeRels(){
    pb.collection('rels').subscribe('*',async(e)=>{
        if(e.action=='create' && e.record.follower==useAuthStore().authData.id){
            const rel= await pb.collection('rels').getFirstListItem(`follower = "${e.record.follower}" && following = "${e.record.following}"`, {expand:'follower,following'})
            const backRel= await pb.collection('rels').getFirstListItem(`follower = "${e.record.following}" && following = "${e.record.follower}"`, {expand:'follower,following'})
            this.allChatsData.allDatas.set(e.record.following, new ChatData(rel,backRel));
            subscribeToNewMessages(e.record.following)
            await this.allChatsData.allDatas.get(e.record.following).init()
        }
    if(e.action=='update' && e.record.following == useAuthStore().authData.id)this.allChatsData.allDatas.get(e.record.follower).otherLastSeen=e.record.lastseen
    

    })
},
subscribeChatMessages(){
    pb.collection('chatMessages').subscribe('*',(e)=>{
        const index=(e.record.from==useAuthStore().authData.id ? e.record.to : e.record.from);
        if(e.action=='create'){
            this.allChatsData.allDatas.get(index).lastMessage=e.record;
            if(this.allChatsData.allDatas.get(index).cacheNewMessages)this.allChatsData.allDatas.get(index).messages.push(e.record);
            if(e.record.from != useAuthStore().authData.id)this.allChatsData.allDatas.get(index).unseenCount++;
        }
        else if(e.action=='update' && e.record.created>=this.allChatsData.allDatas.get(index).messages[0].created && e.record.created<=this.allChatsData.allDatas.get(index).messages.at(-1).created)this.allChatsData.allDatas.get(index).messages[this.allChatsData.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
        else if(e.record.action='delete'){if(new Date(e.record.created) > new Date(this.allChatsData.allDatas.get(index).lastSeen)){this.allChatsData.allDatas.get(index).unseenCount--;};this.allChatsData.allDatas.get(index).messages=this.allChatsData.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)}})
},




subscribeGroupMembers(){
    pb.collection('groupMembers').subscribe('*',async(e)=>{


        if(this.allGroupsData.groupRels.find(groupRel=>{groupRel.group==e.record.group}) && e.action=='create'){
                this.allGroupsData.allDatas.get(e.record.group).groupMems.set(e.record.mem, await pb.collection('users').getFirstListItem(`id = "${e.record.mem}"`))
        }
        else if(e.action=='create' && e.record.mem==useAuthStore().authData.id){
            await this.updateGroupRels();
        }

        })
},




subscribeGroupMessages(){
    pb.collection('groupMessages').subscribe('*',async(e)=>{
        const index=e.record.group;
        if(e.action=='create'){
            if(!this.allGroupsData.allDatas.get(index).groupMems.get(e.record.from)){await this.updateGroupMems(e.record.group)}
            if(this.allGroupsData.allDatas.get(index).cacheNewMessages)this.allGroupsData.allDatas.get(index).messages.push(e.record);
            if(e.record.from != useAuthStore().authData.id)this.allGroupsData.allDatas.get(index).unseenCount++;
            this.allGroupsData.allDatas.get(index).lastMessage=e.record;this.allGroupsData.allDatas.get(index).lastMessage['expand']={from:this.allGroupsData.allDatas.get(index).groupMems.get(e.record.from)}}
            else if(e.action=='update' && e.record.created>=this.allGroupsData.allDatas.get(index).messages[0].created && e.record.created<=this.allGroupsData.allDatas.get(index).messages.at(-1).created)this.allGroupsData.allDatas.get(index).messages[this.allGroupsData.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete'){if(new Date(e.record.created) > new Date(this.allGroupsData.allDatas.get(index).lastSeen)){this.allGroupsData.allDatas.get(index).unseenCount--;};this.allGroupsData.allDatas.get(index).messages=this.allGroupsData.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)}})
},

subscribeChannelMessages(){
    pb.collection('channelMessages').subscribe('*',(e)=>{
        const index=e.record.channel;
        if(e.action=='create'){
            if(this.allChannelsData.allDatas.get(index).cacheNewMessages)this.allChannelsData.allDatas.get(index).messages.push(e.record);
            if(e.record.from != useAuthStore().authData.id)this.allChannelsData.allDatas.get(index).unseenCount++;
            this.allChannelsData.allDatas.get(index).lastMessage=e.record;}
            else if(e.action=='update' && e.record.created>=this.allChannelsData.allDatas.get(index).messages[0].created && e.record.created<=this.allChannelsData.allDatas.get(index).messages.at(-1).created)this.allChannelsData.allDatas.get(index).messages[this.allChannelsData.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            else if(e.record.action='delete'){if(new Date(e.record.created) > new Date(this.allChannelsData.allDatas.get(index).lastSeen)){this.allChannelsData.allDatas.get(index).unseenCount--;};this.allChannelsData.allDatas.get(index).messages=this.allChannelsData.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)}})

},

unsubscribeChannelMessages(){
pb.collection('channelMessages').unsubscribe()
},

unsubscribeGroupMessages(){
pb.collection('groupMessages').unsubscribe()
},

unsubscribeChatMessages(){
pb.collection('chatMessages').unsubscribe()
},

unsubscribeGroupMembers(){
pb.collection('groupMembers').unsubscribe()
},

unsubscribeRels(){
pb.collection('rels').unsubscribe()
},

unsubscribeContacts(){
pb.collection('contacts').unsubscribe()
},

unsubscribeUsers(){
pb.collection('users').unsubscribe()
},




subscribeAll(){
    this.subscribeChatMessages()
    this.subscribeUsers()
    this.subscribeChannelMessages()
    this.subscribeGroupMessages()
    this.subscribeGroupMembers()
    this.subscribeRels()
    this.subscribeContacts()
    this.isInitialized=true;
},

unsubscribeAll(){
    this.unsubscribeUsers()
    this.unsubscribeChannelMessages()
    this.unsubscribeGroupMessages()
    this.unsubscribeChatMessages()
    this.unsubscribeGroupMembers()
    this.unsubscribeRels()
    this.unsubscribeContacts()
}





    },
    getters:{
        // allDatasSorted:(state)=>Object.fromEntries(Object.entries({
        //     ...state.allChatsData.allDatas,
        //     ...state.allGroupsData.allDatas,
        //     ...state.allChannelsData.allDatas
        // }).sort((a,b)=>(new Date(b[1].lastMessage?.created).getTime() > new Date(a[1].lastMessage?.created).getTime() ? 1 : -1))),

        allDatasSorted:(state)=>new Map([
            // ...state.allChatsData.allDatas,
            // ...state.allGroupsData.allDatas,
            // ...state.allChannelsData.allDatas

            ...state.allChatsData.allDatas,
            ...state.allGroupsData.allDatas,
            ...state.allChannelsData.allDatas
        ].sort((a,b)=>(new Date(b[1].lastMessage?.created ?? null).getTime() > new Date(a[1].lastMessage?.created ?? null).getTime() ? 1 : -1))),






        allSendables(state){
            const contacts = Array.from(state.contacts.keys()).map(i=>({receiverType:'chat',subject:state.contacts.get(i) , id:i}))
            const chats = Array.from(state.allChatsData.allDatas.values()).filter(i=>!state.contacts.has(i.other.id)).filter(i=>i.backActive).filter(i=>i.other.id != pb.authStore.model.id).map(i=>({receiverType:'chat',subject:i.other , id:i.other.id}))
            const groups = Array.from(state.allGroupsData.allDatas.values()).filter(i=>i.active).map(i=>({receiverType:'group',subject:i.group , id:i.group.id}))
            const channels = Array.from(state.allChannelsData.allDatas.values()).filter(i=>i.channel.owner == pb.authStore.model.id).map(i=>({receiverType:'channel',subject:i.channel , id:i.channel.id}))

            return[...contacts, ...chats, ...groups, ...channels]
        },

        all:(state)=>({...Object.fromEntries(Array.from(state.contacts.keys()).map(i=>([i,{other:state.contacts.get(i), about:state.contacts.get(i).bio}]))), ...Object.fromEntries(state.allChatsData.allDatas.keys().map(i=>([i,{other:state.allChatsData.allDatas.get(i).other, about:state.allChatsData.allDatas.get(i).other.bio}]))), ...Object.fromEntries(state.allGroupsData.allDatas.keys().map(i=>([i,{other:state.allGroupsData.allDatas.get(i).group, about:state.allGroupsData.allDatas.get(i).group.about}]))), ...Object.fromEntries(state.allChannelsData.allDatas.keys().map(i=>([i,{other:state.allChannelsData.allDatas.get(i).channel, about:state.allChannelsData.allDatas.get(i).channel.about}])))})
    }
}
)