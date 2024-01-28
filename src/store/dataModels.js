import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class ChatData{
    constructor(rel,backRel){
        this.rel=rel
        this.lastMessage = null
        this.other = null
        this.lastSeen = null
        this.unseenCount = 0
        this.lastVisited = null
        this.relId = null
        this.backRelId = null
        this.otherLastSeen = null
        this.messages=[]
        this.cacheNewMessages=false
        this.isOnline=false
        this.messagesType='chat'
        this.backRel=backRel
    }

    async init(){
        this.other = (this.rel.follower == useAuthStore().authData.id) ? this.rel.expand.following : this.rel.expand.follower
        console.log('init start ----->')
        console.log('other@@@@@',this.other)

        // try{
            this.lastMessage = await pb.collection('chatMessages').getFirstListItem(`from = "${this.other.id}" || to = "${this.other.id}"`, {sort:'-created'})
        // }catch{console.log('errrooooor@@@')}
        this.lastSeen = this.rel.lastseen || 0
        console.log('init 1')
        try{
            this.unseenCount = (await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${this.other.id}" && created > "${this.lastSeen}"`, sort:'-created',$autoCancel:false})).totalItems
        }catch(e){console.log(this.other.id,'-e-r-r-o-r->',e)}
        console.log('init 2')
        this.lastVisited = this.rel.expand.following.lastvisited
        this.relId = this.rel.id
        this.backRelId = this.backRel?.id
        this.otherLastSeen = this.backRel?.lastseen || 0
        console.log('init end ----->')
        console.log('@ ::: ',this.lastMessage)

    }

    async updateUnseenCount(){this.unseenCount=(await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${this.other.id}" && created > "${this.lastSeen}"`, sort:'-created'})).totalItems;}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class AllChatsData{
    constructor(rels=[]){
        this.rels=rels
        this.allMessages={}
        this.backRels=[]
        this.contacts=[]
    }

    async updateContacts(){this.contacts=await pb.collection('contacts').getFullList({expand:'following'});}
    async updateUnseenCount(id){await this.allMessages[id].updateUnseenCount()}
    async updateRels(){this.rels=await pb.collection('rels').getFullList({
        expand:'follower,following'
    });this.backRels=this.rels.filter(rel=>rel.follower != useAuthStore().authData.id);this.rels=this.rels.filter(rel=>rel.follower == useAuthStore().authData.id && rel.active);console.log('relsss -> ',this.rels);console.log('backrelsss -> ',this.backRels)}

    async updateAllMessages(){
        await Promise.allSettled(this.rels.map((rel)=>{
                var index=(rel.follower == useAuthStore().authData.id) ? rel.following : rel.follower
                this.allMessages[index] = new ChatData(rel,this.backRels.find(i=>i.follower == rel.following))
                return this.allMessages[index].init()
        }))



    ;console.log('all msgs -> ',this.allMessages)}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// class GroupData{
//     constructor(group){
//         this.groupMems={}
//         this.lastMessage=null
//         this.group=group
//         this.messages=[]
//         this.unseenCount=0
//         this.cacheNewMessages=false
//         this.lastSeen=group.lastSeen || 0
//         this.relId=group.relId
//         this.messagesType='group'
//     }

//     async init(){


//     }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// class AllGroupsData{
//     constructor(rels=[]){
//         this.rels=rels
//         this.groups={}
//         this.members=[]
//         this.allMessages={}
//     }

//     async updateGroups(){(await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'})).map(rec=>{this.groups[rec.group]=rec.expand.group;this.groups[rec.group]['lastSeen']=rec.lastseen;this.groups[rec.group]['relId']=rec.id});}
//     async updateMembers(groupId){(await pb.collection('groupMembers').getFullList({filter:`group = "${groupId}"`,expand:'mem'})).map(rec=>{this.allGroupMessages[groupId].groupMems[rec.mem]=rec.expand.mem});this.allGroupMessages[groupId].groupMems[useAuthStore().authData.id]=useAuthStore().authData}
//     async updateRels(){this.groupRels=await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'});}
//     async updateUnseenCount(id){this.allGroupMessages[id].unseenCount=(await pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && group = "${id}" && created > "${this.allGroupMessages[id].lastSeen}"`, sort:'-created'})).totalItems;console.log(this.allMessagesSorted[id])}
//     async updateAllMessages(){for (const group of Object.values(this.groups)){this.allGroupMessages[group.id]=new GroupData(group);await this.allGroupMessages[group.id].init();
//     await Promise.allSettled(Object.values(this.groups).map(group=>{new Promise((resolve, reject)=>{
//         Promise.all([
//         pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && created > "${group.lastSeen}"`, sort:'-created'}).then(rec=>this.allGroupMessages[group.id]['unseenCount']=rec.totalItems),
//         pb.collection('groupMessages').getFirstListItem(`group = "${group.id}"`, {sort:'-created',expand:'from'}).then(msg=>{this.allMessages[group.id]['lastMessage']=msg})
//         ]).then(resolve()).catch(reject()).then(resolve())
//     })}))


//     }


//     }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// class ChannelData{
//     constructor(rel){
//         this.channelMems={}
//         this.lastMessage=null
//         this.channel=rel.expand.channel
//         this.messages=[]
//         this.unseenCount=0
//         this.cacheNewMessages=false
//         this.lastSeen=rel.lastseen || 0
//         this.relId=rel.id
//         this.messagesType='channel'
//     }

//     async init(){
//         this.unseenCount=(await pb.collection('channelMessages').getList(1, 1, {filter:`created > "${this.lastSeen}"`, sort:'-created'})).totalItems
//         this.lastMessage=await pb.collection('channelMessages').getFirstListItem(`channel = "${this.channel.id}"`, {sort:'-created'})

//     }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// class AllChannelsData{
//     constructor(rels=[]){
//         this.channels={}
//         this.rels=rels
//         this.allMessages={}
//     }

//     async updatMembers(channelId){this.allChannelMessages[channelId].channelMems=(await pb.collection('channelMembers').getFullList({filter:`channel = "${channelId}"`,expand:'mem'})).map(rec=>{this.allChannelMessages[channelId].channelMems[rec.mem]=rec.expand.mem});}
//     async updatRels(){this.rels=await pb.collection('channelMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'channel'});}
//     async updatUnseenCount(id){this.allChannelMessages[id].unseenCount=(await pb.collection('channelMessages').getList(1, 1, {filter:`channel = "${id}" && created > "${this.allChannelMessages[id].lastSeen}"`, sort:'-created'})).totalItems;console.log(this.allMessagesSorted[id])}
//     async updateAlMessages(){for await (const rel of this.rels){this.allChannelMessages[rel.channel]=new ChannelData(rel)}

//     this.allMessages[rels.channel]['unseenCount']=(await pb.collection('channelMessages').getList(1, 1, {filter:`created > "${this.allChannelMessages[rel.channel]['lastSeen']}"`, sort:'-created'})).totalItems
//     this.allMessages[rels.channel]['lastMessage'] = await pb.collection('channelMessages').getFirstListItem(`channel = "${rel.channel}"`, {sort:'-created'})
// }}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
    AllChatsData,
    ChatData,
    // AllGroupsData,
    // AllChannelsData
}
