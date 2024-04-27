import Dexie from "dexie";
import {pb} from '@/funcs/pb'

let db;

function createDB(){
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
}




async function replaceAllCacheChatMessages(otherId, messages){
    await removeAllCacheChatMessages(otherId)
    await addOrUpdateAllCacheChatMessages(messages)
}

async function addOrUpdateAllCacheChatMessages(messages){
    await db.chatMessages.bulkPut(messages)
}

async function removeAllCacheChatMessages(otherId){
    if(otherId){
        await db.chatMessages.where({from : otherId}).or('to').equals(otherId).delete()
    }else{
        await db.chatMessages.clear()
    }
}

async function getAllCacheChatMessages(otherId){
        return await db.chatMessages.where({from : otherId}).or('to').equals(otherId).sortBy('created')
}


async function addOrUpdateSingleCacheChatMessage(message){
    await db.chatMessages.put(message)
}

async function removeSingleCacheChatMessage(messageId){
    await db.chatMessages.where({id : messageId}).delete()
}

async function getSingleCacheChatMessage(messageId){
    return await db.chatMessages.get(messageId)
}






async function replaceAllCacheGroupMessages(groupId, messages){
    await removeAllCacheGroupMessages(groupId)
    await addOrUpdateAllCacheGroupMessages(messages)
}

async function addOrUpdateAllCacheGroupMessages(messages){
    await db.groupMessages.bulkPut(messages)
}

async function removeAllCacheGroupMessages(groupId){
    if(groupId){
        await db.groupMessages.where({group : groupId}).delete()
    }else{
        await db.groupMessages.clear()
    }
}

async function getAllCacheGroupMessages(groupId){
        return await db.groupMessages.where({group : groupId}).sortBy('created')
}


async function addOrUpdateSingleCacheGroupMessage(message){
    await db.groupMessages.put(message)
}

async function removeSingleCacheGroupMessage(messageId){
    await db.groupMessages.where({id : messageId}).delete()
}

async function getSingleCacheGroupMessage(messageId){
    return await db.groupMessages.get(messageId)
}










async function replaceAllCacheChannelMessages(channelId, messages){
    await removeAllCacheChannelMessages(channelId)
    await addOrUpdateAllCacheChannelMessages(messages)
}

async function addOrUpdateAllCacheChannelMessages(messages){
    await db.channelMessages.bulkPut(messages)
}

async function removeAllCacheChannelMessages(channelId){
    if(channelId){
        await db.channelMessages.where({channel : channelId}).delete()
    }else{
        await db.channelMessages.clear()
    }
}

async function getAllCacheChannelMessages(channelId){
        return await db.channelMessages.where({channel : channelId}).sortBy('created')
}


async function addOrUpdateSingleCacheChannelMessage(message){
    await db.channelMessages.put(message)
}

async function removeSingleCacheChannelMessage(messageId){
    await db.channelMessages.where({id : messageId}).delete()
}

async function getSingleCacheChannelMessage(messageId){
    return await db.channelMessages.get(messageId)
}





















async function getRels(){
    return await db.rels.toArray()
}
async function getBackRels(){
    return await db.backRels.toArray()
}
async function addOrUpdateRel(rel){
    return await db.rels.put(rel)
}
async function addOrUpdateBackRel(backRel){
    return await db.backRels.put(backRel)
}
async function getRel(otherId){
    return await db.rels.get({follower:pb.authStore.model.id, following:otherId})
}
async function getBackRel(otherId){
    return await db.backRels.get({follower:otherId, following:pb.authStore.model.id})
}
async function getGroupRels(){
    return await db.groupRels.toArray()
}
async function getChannelRels(){
    return await db.channelRels.toArray()
}
async function getChannelRel(channelId){
    return await db.channelRels.get({channel:channelId})
}
async function getGrouplRel(groupId){
    return await db.groupRels.get({group:groupId})
}

async function replaceRels(rels){
    await db.rels.clear()
    await db.rels.bulkPut(rels)
}
async function replaceBackRels(backRels){
    await db.backRels.clear()
    await db.backRels.bulkPut(backRels)
}
async function replaceGroupRels(groupRels){
    await db.groupRels.clear()
    await db.groupRels.bulkPut(groupRels)
}
async function replaceChannelRels(channelRels){
    await db.channelRels.clear()
    await db.channelRels.bulkPut(channelRels)
}

async function getContacts(){
    return await db.contacts.toArray()
}
async function replaceContacts(contacts){
    await db.contacts.clear()
    await db.contacts.bulkPut(contacts)
}
// async function addContact(contact){
//     await db.contacts.put(contact)
// }
// async function deleteContact(contactId){
//     return await db.contacts.delete(contactId)
// }

async function getLastEntry(id){
    return await db.lastEntries.get(id)
}
async function updateLastEntry(entry){
    try{
        await db.lastEntries.update(id, entry)
    }catch{
        await db.lastEntries.put(entry)
    }
}


async function getGroupMembers(groupId){
    return (await db.groupMembers.get(groupId)).members
}
async function replaceGroupMembers(groupMembers){
    await db.groupMembers.put(groupMembers)
}




async function searchUsers(searchTerm){
    return await db.users.filter(user => (user.username.includes(searchTerm) || user.name?.includes?.(searchTerm) || user.email?.includes?.(searchTerm))).toArray()
}

async function searchGroups(searchTerm){
    return await db.groups.filter(group => (group.name.includes(searchTerm))).toArray()
}

async function searchChannels(searchTerm){
    return await db.channels.filter(channel => (channel.name.includes(searchTerm))).toArray()
}

async function saveUsers(users){
    await db.users.bulkPut(users)
}

async function saveGroups(groups){
    await db.groups.bulkPut(groups)
}

async function saveChannels(channels){
    await db.channels.bulkPut(channels)
}

async function searchMessages(searchTerm){
    return (await Promise.allSettled([
        ...((await db.chatMessages.filter(msg => msg.text?.includes?.(searchTerm)).toArray()).map(async(msg) => ({...msg, expand:{from:(msg.from == pb.authStore.model.id ? pb.authStore.model : (await getRel(msg.from)).expand.following), to:(msg.to == pb.authStore.model.id ? pb.authStore.model : (await getRel(msg.to)).expand.following)}}))),
        ...((await db.groupMessages.filter(msg => msg.text?.includes?.(searchTerm)).toArray()).map(async(msg) => ({...msg, expand:{group:(await getGrouplRel(msg.group)).expand.group, from:(msg.from == pb.authStore.model.id ? pb.authStore.model : (await getRel(msg.from)).expand.following)}}))),
        ...((await db.channelMessages.filter(msg => msg.text?.includes?.(searchTerm)).toArray()).map(async(msg) => ({...msg, expand:{channel:(await getChannelRel(msg.channel)).expand.channel}})))])).map(res => res.value)
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