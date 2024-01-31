import pb from '@/main'
import {useAuthStore} from '@/store/authStore'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class ChatData{
    constructor(rel,backRel){
        this.rel=rel
        this.backRel=backRel
        this.lastMessage = null
        this.other = (this.rel.follower == useAuthStore().authData.id) ? this.rel.expand.following : this.rel.expand.follower
        this.lastSeen = this.rel.lastseen || 0
        this.unseenCount = 0
        this.lastVisited = this.rel.expand.following.lastvisited
        this.relId = this.rel.id
        this.backRelId = this.backRel?.id
        this.otherLastSeen = this.backRel?.lastseen || 0
        this.messages=[]
        this.cacheNewMessages=false
        this.isOnline=false
        this.messagesType='chat'
    }

    async init(){
        this.other = (this.rel.follower == useAuthStore().authData.id) ? this.rel.expand.following : this.rel.expand.follower

        this.lastMessage = await pb.collection('chatMessages').getFirstListItem(`from = "${this.other.id}" || to = "${this.other.id}"`, {sort:'-created'})

        await this.updateUnseenCount()



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

class GroupData{
    constructor(groupRel){
        this.groupMems={}
        this.lastMessage=null
        this.group=groupRel.expand.group
        this.messages=[]
        this.unseenCount=0
        this.cacheNewMessages=false
        this.lastSeen=groupRel.lastSeen || 0
        this.groupRelId=groupRel.id
        this.messagesType='group'
    }

    async init(){
        this.lastMessage = await pb.collection('groupMessages').getFirstListItem(`group = "${this.group.id}"`, {sort:'-created',expand:'from'})
        try{
            await this.updateUnseenCount()
        }catch{}
        await this.updateMembers()
        console.log('###',this.groupMems)

    }
    
    async updateMembers(){await (pb.collection('groupMembers').getFullList({filter:`group = "${this.group.id}"`,expand:'mem'})).then(res=>{console.log('+++',res);res.forEach(groupRel=>this.groupMems[groupRel.mem]=groupRel.expand.mem);console.log('###',this.groupMems)})}

    async updateUnseenCount(){this.unseenCount=(await pb.collection('groupMessages').getList(1, 1, {filter:`from != "${useAuthStore().authData.id}" && group = "${this.group.id}" && created > "${this.lastSeen}"`, sort:'-created'})).totalItems;console.log(this.allMessagesSorted[this.group.id])}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class AllGroupsData{
    constructor(groupRels=[]){
        this.groupRels=groupRels
        // this.groups={}
        this.allMessages={}
    }

    // async updateGroups(){(await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'})).map(rec=>{this.groups[rec.group]=rec.expand.group;this.groups[rec.group]['lastSeen']=rec.lastseen;this.groups[rec.group]['groupRelId']=rec.id});}
    // async updateGroupRels(){this.groupRels = await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'})}
    async updateMembers(groupId){await this.allMessages[groupId].updateMembers()}
    async updateRels(){this.groupRels=await pb.collection('groupMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'group'});}
    async updateUnseenCount(groupId){await this.allMessages[groupId].updateUnseenCount()}
    async updateAllMessages(){
  await Promise.allSettled(this.groupRels.map((groupRel)=>{
        var index=groupRel.group
        this.allMessages[index] = new GroupData(groupRel)
        return this.allMessages[index].init()
}))

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ChannelData{
    constructor(channelRel){
        this.channelMems={}
        this.lastMessage=null
        this.channel=channelRel.expand.channel
        this.messages=[]
        this.unseenCount=0
        this.cacheNewMessages=false
        this.lastSeen=channelRel.lastseen || 0
        this.channelRelId=channelRel.id
        this.messagesType='channel'
    }

    async init(){
        this.lastMessage=await pb.collection('channelMessages').getFirstListItem(`channel = "${this.channel.id}"`, {sort:'-created'})
        await this.updateUnseenCount()

    }

    async updateMembers(){this.channelMems=(await pb.collection('channelMembers').getFullList({filter:`channel = "${this.channel.id}"`,expand:'mem'})).map(rec=>{this.channelMems[rec.mem]=rec.expand.mem});}

    async updateUnseenCount(){this.unseenCount=(await pb.collection('channelMessages').getList(1, 1, {filter:`channel = "${this.channel.id}" && created > "${this.lastSeen}"`, sort:'-created'})).totalItems;}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class AllChannelsData{
    constructor(channelRels=[]){
        // this.channels={}
        this.channelRels=channelRels
        this.allMessages={}
    }

    async updateMembers(channelId){await this.allMessages[channelId].updateMembers()}
    async updateRels(){this.channelRels=await pb.collection('channelMembers').getFullList({filter:`mem = "${useAuthStore().authData.id}"`,expand:'channel'});}
    async updateUnseenCount(channelId){await this.allMessages[channelId].updateUnseenCount()}
    async updateAllMessages(){
        await Promise.allSettled(this.channelRels.map((channelRel)=>{
              var index=channelRel.channel
              this.allMessages[index] = new ChannelData(channelRel)
              return this.allMessages[index].init()
      }))
      
          }
    
}






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export {
    AllChatsData,
    ChatData,
    AllGroupsData,
    GroupData,
    AllChannelsData,
    ChannelData
}
