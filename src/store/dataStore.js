import { defineStore } from 'pinia'
import {pb} from '@/funcs/pb';
import {useAuthStore} from '@/store/authStore'
import {subscribeToNewMessages, initializeChatMessages} from '@/funcs/chatFuncs'

import {createDB} from '@/funcs/db'

import {
    getSingleCacheChatMessage,
    getAllCacheChatMessages,
    addOrUpdateSingleCacheChatMessage,
    addOrUpdateAllCacheChatMessages,
    removeSingleCacheChatMessage,
    removeAllCacheChatMessages,
    replaceAllCacheChatMessages,


    getSingleCacheGroupMessage,
    getAllCacheGroupMessages,
    addOrUpdateSingleCacheGroupMessage,
    addOrUpdateAllCacheGroupMessages,
    removeSingleCacheGroupMessage,
    removeAllCacheGroupMessages,
    replaceAllCacheGroupMessages,


    getSingleCacheChannelMessage,
    getAllCacheChannelMessages,
    addOrUpdateSingleCacheChannelMessage,
    addOrUpdateAllCacheChannelMessages,
    removeSingleCacheChannelMessage,
    removeAllCacheChannelMessages,
    replaceAllCacheChannelMessages,


    getRels,
    getBackRels,
    addOrUpdateRel,
    addOrUpdateBackRel,
    getGroupRels,
    getChannelRels,
    replaceRels,
    replaceBackRels,
    replaceGroupRels,
    replaceChannelRels,
    getContacts,
    replaceContacts,


    getLastEntry,
    updateLastEntry,

    getGroupMembers,
    replaceGroupMembers

} from '@/funcs/db'

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

        
        accounts:JSON.parse(localStorage.getItem('tgAccounts')) ?? {},


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
        async setAccount(accountId){
            try{
                await pb.collection('users').update(pb.authStore.model.id,{online:false})
            }catch{}finally{
                const account = JSON.parse(localStorage.getItem('tgAccounts'))?.[accountId]
                if(account){
                    localStorage.setItem('pocketbase_auth', JSON.stringify(account))
                }
            }
        },
        saveAccount(){
            const account = JSON.parse(localStorage.getItem('pocketbase_auth'))
            this.accounts[account.model.id] = account
            localStorage.setItem('tgAccounts', JSON.stringify(this.accounts))
        },
        deleteAccount(accountId){
            delete this.accounts[accountId]
            localStorage.setItem('tgAccounts', JSON.stringify(this.accounts))
        },
        // async updateGroups(){await allGroupsData.updateGroups()},
        async updateContacts(){
            try{
                await pb.collection('contacts').getFullList({expand:'following'}).then(res=>{this.contacts.clear();res.forEach(contact=>this.contacts.set(contact.following, {...contact.expand.following,contactId:contact.id}))})
                await replaceContacts(JSON.parse(JSON.stringify(this.contacts)))
            }catch{
                // this.contacts = await getContacts()
            }
        },


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
        // this.saveAccount()
        try{
            createDB()
            this.clearAllDatas()
        }catch{}finally{
            await Promise.allSettled([
                this.updateChatRels(),
                this.updateGroupRels(),
                this.updateChannelRels(),
                this.updateContacts()
            ])
    
    
            await this.updateAllMessages()
        }
    },

    clearAllDatas() {
        this.allChatsData = new AllChatsData();
        this.allGroupsData = new AllGroupsData();
        this.allChannelsData = new AllChannelsData();
    },

    uninitialize(){this.isInitialized=false;},

subscribeContacts(){
    pb.collection('contacts').subscribe('*', this.updateContacts)
},



subscribeUsers(){
    pb.collection('users').subscribe('*',async(e)=>{
        try{
            this.allChatsData.allDatas.get(e.record.id).isOnline = e.record.online;
            this.allChatsData.allDatas.get(e.record.id).lastVisited = e.record.updated;
            this.allChatsData.allDatas.get(e.record.id).updated = e.record.updated;
        }catch{}finally{
            if(Object.keys(this.accounts).includes(e.record.id)){
                this.accounts[e.record.id].model={...this.accounts[e.record.id].model,...e.record}
                localStorage.setItem('tgAccounts', JSON.stringify(this.accounts))
            }
        }
    })
},

subscribeRels(){
    pb.collection('rels').subscribe('*',async(e)=>{
        if(e.action=='create' && e.record.follower==useAuthStore().authData.id){
            const rel= await pb.collection('rels').getFirstListItem(`follower = "${e.record.follower}" && following = "${e.record.following}"`, {expand:'follower,following'})
            const backRel= await pb.collection('rels').getFirstListItem(`follower = "${e.record.following}" && following = "${e.record.follower}"`, {expand:'follower,following'})
            this.allChatsData.allDatas.set(e.record.following, new ChatData(rel,backRel));
            await this.allChatsData.allDatas.get(e.record.following).init()
            await initializeChatMessages(e.record.following)
            // this.allChatsData.allDatas.get(e.record.following).cacheNewMessages=true;
            subscribeToNewMessages(e.record.following)
            await addOrUpdateRel(JSON.parse(JSON.stringify(rel)))
            await addOrUpdateBackRel(JSON.parse(JSON.stringify(backRel)))
        }
    if(e.action=='update' && e.record.following == useAuthStore().authData.id)this.allChatsData.allDatas.get(e.record.follower).otherLastSeen=e.record.lastseen
    

    })
},
subscribeChatMessages(){
    pb.collection('chatMessages').subscribe('*',async(e)=>{
        const index=(e.record.from==useAuthStore().authData.id ? e.record.to : e.record.from);
        if(e.action=='create'){
            this.allChatsData.allDatas.get(index).lastMessage=e.record;
            if(this.allChatsData.allDatas.get(index).cacheNewMessages){this.allChatsData.allDatas.get(index).messages.push(e.record);await addOrUpdateSingleCacheChatMessage(JSON.parse(JSON.stringify(e.record)))}
            if(e.record.from != useAuthStore().authData.id){this.allChatsData.allDatas.get(index).unseenCount++;await updateLastEntry({id:index, unseenCount:this.allChatsData.allDatas.get(index).unseenCount})}
        }
        else if(e.action=='update'){
            if(this.allChatsData.allDatas.get(index).lastMessage.id == e.record.id){this.allChatsData.allDatas.get(index).lastMessage=e.record; await updateLastEntry({id:index, message:JSON.parse(JSON.stringify(e.record))})}
            if(new Date(e.record.created) >= new Date(this.allChatsData.allDatas.get(index).messages?.[0]?.created) && new Date(e.record.created) <= new Date(this.allChatsData.allDatas.get(index).messages.at(-1)?.created)){
            this.allChatsData.allDatas.get(index).messages[this.allChatsData.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;
            await addOrUpdateSingleCacheChatMessage(JSON.parse(JSON.stringify(e.record)))
        }
    }
        else if(e.record.action='delete'){
            if(this.allChatsData.allDatas.get(index).lastMessage.id == e.record.id){this.allChatsData.allDatas.get(index).lastMessage.text='deleted message';await updateLastEntry({id:index, message:JSON.parse(JSON.stringify(this.allChatsData.allDatas.get(index).lastMessage))})}
            if(new Date(e.record.created) > new Date(this.allChatsData.allDatas.get(index).lastSeen)){this.allChatsData.allDatas.get(index).unseenCount--;await updateLastEntry({id:index, unseenCount:this.allChatsData.allDatas.get(index).unseenCount})};this.allChatsData.allDatas.get(index).messages=this.allChatsData.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id);await removeSingleCacheChatMessage(e.record.id)}})
},




subscribeGroupMembers(){
    pb.collection('groupMembers').subscribe('*',async(e)=>{


        if(this.allGroupsData.groupRels.find(groupRel=>{groupRel.group==e.record.group}) && e.action=='create'){
                this.allGroupsData.allDatas.get(e.record.group).groupMems.set(e.record.mem, await pb.collection('users').getFirstListItem(`id = "${e.record.mem}"`))
                await replaceGroupMembers({id:e.record.group, members:JSON.parse(JSON.stringify(Object.fromEntries(this.allGroupsData.allDatas.get(e.record.group).groupMems)))})
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
            if(this.allGroupsData.allDatas.get(index).cacheNewMessages){this.allGroupsData.allDatas.get(index).messages.push(e.record);await addOrUpdateSingleCacheGroupMessage(JSON.parse(JSON.stringify(e.record)))}
            if(e.record.from != useAuthStore().authData.id){this.allGroupsData.allDatas.get(index).unseenCount++;await updateLastEntry({id:index,unseenCount:this.allGroupsData.allDatas.get(index).unseenCount})}
            this.allGroupsData.allDatas.get(index).lastMessage=e.record;this.allGroupsData.allDatas.get(index).lastMessage['expand']={from:this.allGroupsData.allDatas.get(index).groupMems.get(e.record.from)}
            await updateLastEntry({id:index, message:JSON.parse(JSON.stringify(this.allGroupsData.allDatas.get(index).lastMessage))})
        }
            else if(e.action=='update'){
                if(this.allGroupsData.allDatas.get(index).lastMessage.id == e.record.id){this.allGroupsData.allDatas.get(index).lastMessage=e.record;await updateLastEntry({id:index, message:JSON.parse(JSON.stringify(e.record))})}
                if(new Date(e.record.created) >= new Date(this.allGroupsData.allDatas.get(index).messages?.[0]?.created) && new Date(e.record.created) <= new Date(this.allGroupsData.allDatas.get(index).messages.at(-1)?.created)){this.allGroupsData.allDatas.get(index).messages[this.allGroupsData.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;await addOrUpdateSingleCacheGroupMessage(JSON.parse(JSON.stringify(e.record)))}
            }
            else if(e.record.action='delete'){
                if(this.allGroupsData.allDatas.get(index).lastMessage.id == e.record.id){this.allGroupsData.allDatas.get(index).lastMessage.text='deleted message';await updateLastEntry({id:index, message:JSON.parse(JSON.stringify(this.allGroupsData.allDatas.get(index).lastMessage))})}
                if(new Date(e.record.created) > new Date(this.allGroupsData.allDatas.get(index).lastSeen)){this.allGroupsData.allDatas.get(index).unseenCount--;await updateLastEntry({id:index, unseenCount:this.allGroupsData.allDatas.get(index).unseenCount})}
                this.allGroupsData.allDatas.get(index).messages=this.allGroupsData.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)
                await removeSingleCacheGroupMessage(e.record.id)
            }
            })
},

subscribeChannelMessages(){
    pb.collection('channelMessages').subscribe('*',async(e)=>{
        const index=e.record.channel;
        if(e.action=='create'){
            if(this.allChannelsData.allDatas.get(index).cacheNewMessages){this.allChannelsData.allDatas.get(index).messages.push(e.record);await addOrUpdateSingleCacheChannelMessage(JSON.parse(JSON.stringify(e.record)))}
            this.allChannelsData.allDatas.get(index).unseenCount++;
            this.allChannelsData.allDatas.get(index).lastMessage=e.record;
            await updateLastEntry({id:index, unseenCount:this.allChannelsData.allDatas.get(index).unseenCount, message:JSON.parse(JSON.stringify(e.record))})
        }
            else if(e.action=='update'){
                if(this.allChannelsData.allDatas.get(index).lastMessage.id == e.record.id){this.allChannelsData.allDatas.get(index).lastMessage=e.record;await updateLastEntry({id:index, message:e.record})}
                if(new Date(e.record.created) >= new Date(this.allChannelsData.allDatas.get(index).messages?.[0]?.created) && new Date(e.record.created) <= new Date(this.allChannelsData.allDatas.get(index).messages.at(-1)?.created)){this.allChannelsData.allDatas.get(index).messages[this.allChannelsData.allDatas.get(index).messages.findIndex(msg=>msg.id==e.record.id)]=e.record;await addOrUpdateSingleCacheChannelMessage(JSON.parse(JSON.stringify(e.record)))}
            }
            else if(e.record.action='delete'){
                if(this.allChannelsData.allDatas.get(index).lastMessage.id == e.record.id){this.allChannelsData.allDatas.get(index).lastMessage.text='deleted message';await updateLastEntry({id:index, message:JSON.parse(JSON.stringify(this.allChannelsData.allDatas.get(index).lastMessage))})}
                if(new Date(e.record.created) > new Date(this.allChannelsData.allDatas.get(index).lastSeen)){this.allChannelsData.allDatas.get(index).unseenCount--;await updateLastEntry({id:index, unseenCount:this.allChannelsData.allDatas.get(index).unseenCount})}
                this.allChannelsData.allDatas.get(index).messages=this.allChannelsData.allDatas.get(index).messages.filter(msg=>msg.id != e.record.id)
                await removeSingleCacheChannelMessage(e.record.id)
            }
        })

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