import { defineStore } from 'pinia'
import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

    export const useDataStore = defineStore('data',{
        state:()=>({
            groups:{},


            groupRels:[],
            channelRels:[],

            contacts:[],
            rels:[],
            backRels:[],
            groupMembers:[],
            channelMembers:[],
            allChatMessages:{},
            allGroupMessages:{},
            allChannelMessages:{}
        }),
        actions:{
            async updateGroups(){(await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'})).map(rec=>{this.groups[rec.group]=rec.expand.group;this.groups[rec.group]['lastSeen']=rec.lastseen;this.groups[rec.group]['relId']=rec.id});},

            async updateGroupMems(groupId){(await pb.collection('groupMembers').getFullList({filter:`group = "${groupId}"`,expand:'mem'})).map(rec=>{this.allGroupMessages[groupId].groupMems[rec.mem]=rec.expand.mem});this.allGroupMessages[groupId].groupMems[useAuthStore().authData.id]=useAuthStore().authData},
            async updateChannelMems(channelId){this.allChannelMessages[channelId].channelMems=(await pb.collection('channelMembers').getFullList({filter:`channel = "${channelId}"`,expand:'mem'})).map(rec=>{this.allChannelMessages[channelId].channelMems[rec.mem]=rec.expand.mem});},

            async updateGroupRels(){this.groupRels=await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'});},
            async updateChannelRels(){this.channelRels=await pb.collection('channelMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'channel'});},

            async updateGroupUnseenCount(id){this.allGroupMessages[id].unseenCount=(await pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && group = "${id}" && created > "${this.allGroupMessages[id].lastSeen}"`, sort:'-created'})).totalItems;console.log(this.allMessagesSorted[id])},
            async updateChannelUnseenCount(id){this.allChannelMessages[id].unseenCount=(await pb.collection('channelMessages').getList(1, 1, {filter:`channel = "${id}" && created > "${this.allChannelMessages[id].lastSeen}"`, sort:'-created'})).totalItems;console.log(this.allMessagesSorted[id])},


            async updateUnseenCount(id){this.allChatMessages[id].unseenCount=(await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${id}" && created > "${this.allChatMessages[id].lastSeen}"`, sort:'-created'})).totalItems;console.log(this.allMessagesSorted[id])},
            async updateContacts(){this.contacts=await pb.collection('contacts').getFullList({expand:'following'});},
            async updateRels(){this.rels=await pb.collection('rels').getFullList({
                expand:'follower,following'
            });this.backRels=this.rels.filter(rel=>rel.follower != useAuthStore().authData.id);this.rels=this.rels.filter(rel=>rel.follower == useAuthStore().authData.id);console.log('relsss -> ',this.rels);console.log('backrelsss -> ',this.backRels)},
            async updateAllChatMessages(){for await (const rel of this.rels){
                const index=(rel.follower == useAuthStore().authData.id) ? rel.following : rel.follower
                this.allChatMessages[index] = {lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null,lastVisited:null,isOnline:false,relId:null,backRelId:null,otherLastSeen:null,messagesType:'chat'}
                try{
                this.allChatMessages[index]['lastMessage'] = await pb.collection('chatMessages').getFirstListItem(`from = "${index}" || to = "${index}"`, {sort:'-created'})
                }catch{}
                this.allChatMessages[index]['other'] = (rel.follower == useAuthStore().authData.id) ? rel.expand.following : rel.expand.follower
                this.allChatMessages[index]['lastSeen'] = rel.lastseen || 0
                this.allChatMessages[index]['unseenCount'] = (await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${index}" && created > "${this.allChatMessages[index]['lastSeen']}"`, sort:'-created'})).totalItems
                this.allChatMessages[index]['lastVisited'] = rel.expand.following.lastvisited
                this.allChatMessages[index]['relId'] = rel.id
                this.allChatMessages[index]['backRelId'] = this.backRels.find(i=>i.follower == rel.following)?.id
                this.allChatMessages[index]['otherLastSeen'] = this.backRels.find(i=>i.follower == rel.following)?.lastseen || 0

            };console.log('all msgs -> ',this.allChatMessages)},
            // async updateGroupMembers(){this.groupMembers=await pb.collection('groupMembers').getFullList({
            //     expand:'group'
            // });},
            // async updateChannelMembers(){this.channelMembers=await pb.collection('channelMembers').getFullList({
            //     expand:'channel'
            // });},
            async updateAllGroupMessages(){for (const group of Object.values(this.groups)){this.allGroupMessages[group.id]={groupMems:{},lastMessage:null,group:group,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:group.lastSeen || 0,relId:group.relId,messagesType:'group'}
            // this.allGroupMessages[group.group]['other']=group.expand.group
            // this.allGroupMessages[group.group]['lastSeen']=group.lastSeen || 0
            // this.allGroupMessages[group]['unseenCount']=(await pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && created > "${this.allGroupMessages[group]['lastSeen']}"`, sort:'-created'})).totalItems
            // pb.collection('groupMessages').getFirstListItem(`group = "${group}"`, {sort:'-created',expand:'from'}).then(msg=>{this.allGroupMessages[group]['lastMessage']=msg})
        }
        await Promise.allSettled(Object.values(this.groups).map(group=>{new Promise((resolve, reject)=>{
            Promise.all([
            pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && created > "${group.lastSeen}"`, sort:'-created'}).then(rec=>this.allGroupMessages[group.id]['unseenCount']=rec.totalItems),
            pb.collection('groupMessages').getFirstListItem(`group = "${group.id}"`, {sort:'-created',expand:'from'}).then(msg=>{this.allGroupMessages[group.id]['lastMessage']=msg})
            ]).then(resolve()).catch(reject()).then(resolve())
        })}))

    },
            async updateAllChannelMessages(){for await (const channelRel of this.channelRels){this.allChannelMessages[channelRel.channel]={channelMems:{},lastMessage:null,channel:channelRel.expand.channel,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:channelRel.lastseen || 0,relId:channelRel.id,messagesType:'channel'}
            // this.allChannelMessages[channel.channel]['other']=channel.expand.channel
            // this.allChannelMessages[channel.channel]['lastSeen']=channel.lastSeen || 0
            this.allChannelMessages[channelRel.channel]['unseenCount']=(await pb.collection('channelMessages').getList(1, 1, {filter:`created > "${this.allChannelMessages[channelRel.channel]['lastSeen']}"`, sort:'-created'})).totalItems
            this.allChannelMessages[channelRel.channel]['lastMessage'] = await pb.collection('channelMessages').getFirstListItem(`channel = "${channelRel.channel}"`, {sort:'-created'})
        }},
            async updateAllMessages(){await this.updateAllChatMessages();await this.updateAllGroupMessages();await this.updateAllChannelMessages()}
        },
        getters:{
            allMessagesSorted:(state)=>Object.fromEntries(Object.entries({...state.allChatMessages,...state.allGroupMessages,...state.allChannelMessages}).sort((a,b)=>new Date(b[1].lastMessage?.created).getTime()-new Date(a[1].lastMessage?.created).getTime()))
        }
    })