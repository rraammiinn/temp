import Dexie from "dexie";
import {pb} from '@/funcs/pb'

let db;

function createDB(){
    try{
        db = new Dexie(`tg-${pb.authStore.model.username}-db`);
        db.version(1).stores({
            chatMessages : "id, text, from, to, created",
            groupMessages : "id, text, group, created",
            channelMessages : "id, text, channel, created",
            rels : "id, [follower+following]",
            backRels : "id, [following+follower]",
            groupRels : "id, group",
            channelRels : "id, channel",
            contacts : "id",
        
            lastEntries : "id",
            groupMembers : "id",
        
            users: "id",
            groups: "id",
            channels: "id"
        });
    }catch{}
}




async function replaceAllCacheChatMessages(otherId, messages){
    try{
        await removeAllCacheChatMessages(otherId)
        await addOrUpdateAllCacheChatMessages(messages)
    }catch{}
}

async function addOrUpdateAllCacheChatMessages(messages){
    try{
        await db.chatMessages.bulkPut(messages)
    }catch{}
}

async function removeAllCacheChatMessages(otherId){
    try{
        if(otherId){
            await db.chatMessages.where({from : otherId}).or('to').equals(otherId).delete()
        }else{
            await db.chatMessages.clear()
        }
    }catch{}
}

async function getAllCacheChatMessages(otherId){
    try{
        return await db.chatMessages.where({from : otherId}).or('to').equals(otherId).sortBy('created')
    }catch{return []}
}


async function addOrUpdateSingleCacheChatMessage(message){
    try{
        await db.chatMessages.put(message)
    }catch{}
}

async function removeSingleCacheChatMessage(messageId){
    try{
        await db.chatMessages.delete(messageId)
    }catch{}
}

async function getSingleCacheChatMessage(messageId){
    try{
        return await db.chatMessages.get(messageId)
    }catch{}
}






async function replaceAllCacheGroupMessages(groupId, messages){
    try{
        await removeAllCacheGroupMessages(groupId)
        await addOrUpdateAllCacheGroupMessages(messages)
    }catch{}
}

async function addOrUpdateAllCacheGroupMessages(messages){
    try{
        await db.groupMessages.bulkPut(messages)
    }catch{}
}

async function removeAllCacheGroupMessages(groupId){
    try{
        if(groupId){
            await db.groupMessages.where({group : groupId}).delete()
        }else{
            await db.groupMessages.clear()
        }
    }catch{}
}

async function getAllCacheGroupMessages(groupId){
    try{
        return await db.groupMessages.where({group : groupId}).sortBy('created')
    }catch{return []}
}


async function addOrUpdateSingleCacheGroupMessage(message){
    try{
        await db.groupMessages.put(message)
    }catch{}
}

async function removeSingleCacheGroupMessage(messageId){
    try{
        await db.groupMessages.delete(messageId)
    }catch{}
}

async function getSingleCacheGroupMessage(messageId){
    try{
        return await db.groupMessages.get(messageId)
    }catch{}
}










async function replaceAllCacheChannelMessages(channelId, messages){
    try{
        await removeAllCacheChannelMessages(channelId)
        await addOrUpdateAllCacheChannelMessages(messages)
    }catch{}
}

async function addOrUpdateAllCacheChannelMessages(messages){
    try{
        await db.channelMessages.bulkPut(messages)
    }catch{}
}

async function removeAllCacheChannelMessages(channelId){
    try{
        if(channelId){
            await db.channelMessages.where({channel : channelId}).delete()
        }else{
            await db.channelMessages.clear()
        }
    }catch{}
}

async function getAllCacheChannelMessages(channelId){
    try{
        return await db.channelMessages.where({channel : channelId}).sortBy('created')
    }catch{return []}
}


async function addOrUpdateSingleCacheChannelMessage(message){
    try{
        await db.channelMessages.put(message)
    }catch{}
}

async function removeSingleCacheChannelMessage(messageId){
    try{
        await db.channelMessages.delete(messageId)
    }catch{}
}

async function getSingleCacheChannelMessage(messageId){
    try{
        return await db.channelMessages.get(messageId)
    }catch{}
}





















async function getRels(){
    try{
        return await db.rels.toArray()
    }catch{return []}
}
async function getBackRels(){
    try{
        return await db.backRels.toArray()
    }catch{return []}
}
async function addOrUpdateRel(rel){
    try{
        await db.rels.put(rel)
    }catch{}
}
async function addOrUpdateBackRel(backRel){
    try{
        await db.backRels.put(backRel)
    }catch{}
}
async function getRel(otherId){
    try{
        return await db.rels.get({follower:pb.authStore.model.id, following:otherId})
    }catch{}
}
async function getBackRel(otherId){
    try{
        return await db.backRels.get({follower:otherId, following:pb.authStore.model.id})
    }catch{}
}
async function getGroupRels(){
    try{
        return await db.groupRels.toArray()
    }catch{return []}
}
async function getChannelRels(){
    try{
        return await db.channelRels.toArray()
    }catch{return []}
}
async function getChannelRel(channelId){
    try{
        return await db.channelRels.get({channel:channelId})
    }catch{}
}
async function getGrouplRel(groupId){
    try{
        return await db.groupRels.get({group:groupId})
    }catch{}
}

async function replaceRels(rels){
    try{
        await db.rels.clear()
        await db.rels.bulkPut(rels)
    }catch{}
}
async function replaceBackRels(backRels){
    try{
        await db.backRels.clear()
        await db.backRels.bulkPut(backRels)
    }catch{}
}
async function replaceGroupRels(groupRels){
    try{
        await db.groupRels.clear()
        await db.groupRels.bulkPut(groupRels)
    }catch{}
}
async function replaceChannelRels(channelRels){
    try{
        await db.channelRels.clear()
        await db.channelRels.bulkPut(channelRels)
    }catch{}
}

async function getContacts(){
    try{
        return await db.contacts.toArray()
    }catch{return []}
}
async function replaceContacts(contacts){
    try{
        await db.contacts.clear()
        await db.contacts.bulkPut(contacts)
    }catch{}

}
// async function addContact(contact){
//     await db.contacts.put(contact)
// }
// async function deleteContact(contactId){
//     return await db.contacts.delete(contactId)
// }

async function getLastEntry(id){
    try{
        return await db.lastEntries.get(id)
    }catch{}
}
async function updateLastEntry(entry){
    try{
        try{
            await db.lastEntries.update(id, entry)
        }catch{
            await db.lastEntries.put(entry)
        }
    }catch{}
}


async function getGroupMembers(groupId){
    try{
        return (await db.groupMembers.get(groupId)).members
    }catch{return []}
}
async function replaceGroupMembers(groupMembers){
    try{
        await db.groupMembers.put(groupMembers)
    }catch{}
}




async function searchUsers(searchTerm){
    try{
        return await db.users.filter(user => (user.username.includes(searchTerm) || user.name?.includes?.(searchTerm) || user.email?.includes?.(searchTerm))).toArray()
    }catch{return []}
}

async function searchGroups(searchTerm){
    try{
        return await db.groups.filter(group => (group.name.includes(searchTerm))).toArray()
    }catch{return []}
}

async function searchChannels(searchTerm){
    try{
        return await db.channels.filter(channel => (channel.name.includes(searchTerm))).toArray()
    }catch{return []}
}

async function saveUsers(users){
    try{
        await db.users.bulkPut(users)
    }catch{}
}

async function saveGroups(groups){
    try{
        await db.groups.bulkPut(groups)
    }catch{}
}

async function saveChannels(channels){
    try{
        await db.channels.bulkPut(channels)
    }catch{}
}

async function searchMessages(searchTerm){
    try{
        return (await Promise.allSettled([
            ...((await db.chatMessages.filter(msg => msg.text?.includes?.(searchTerm)).toArray()).map(async(msg) => ({...msg, expand:{from:(msg.from == pb.authStore.model.id ? pb.authStore.model : (await getRel(msg.from)).expand.following), to:(msg.to == pb.authStore.model.id ? pb.authStore.model : (await getRel(msg.to)).expand.following)}}))),
            ...((await db.groupMessages.filter(msg => msg.text?.includes?.(searchTerm)).toArray()).map(async(msg) => ({...msg, expand:{group:(await getGrouplRel(msg.group)).expand.group, from:(msg.from == pb.authStore.model.id ? pb.authStore.model : (await getRel(msg.from)).expand.following)}}))),
            ...((await db.channelMessages.filter(msg => msg.text?.includes?.(searchTerm)).toArray()).map(async(msg) => ({...msg, expand:{channel:(await getChannelRel(msg.channel)).expand.channel}})))])).map(res => res.value)
    }catch{return []}
}

export {
    db,
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
    getRel,
    getBackRel,
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
    getGrouplRel,
    getChannelRel,
    // addContact,
    // deleteContact,



    getLastEntry,
    updateLastEntry,

    getGroupMembers,
    replaceGroupMembers,


    searchUsers,
    searchGroups,
    searchChannels,
    saveUsers,
    saveGroups,
    saveChannels,
    
    searchMessages,


    createDB
}