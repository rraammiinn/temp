import pb from "@/main";


import {useDataStore} from '@/store/dataStore'
import { GroupData } from "@/store/dataModels";




async function getGroupMessageById(id){
  return await pb.collection('groupMessages').getOne(id);
}

async function getPreviousGroupMessages(groupId,endDate,number=10){
  return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created < "${endDate}"`, sort: '-created'})).items.reverse()
}

async function getNextGroupMessages(groupId,startDate=0,number=10){
  return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created > "${startDate}"`, sort: 'created'})).items
}

async function getLastGroupMessages(groupId,endDate,number=10){
  if(endDate){return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created <= "${endDate}"`, sort: '-created'})).items.reverse()}
  else{return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}"`, sort: '-created'})).items.reverse()}
}

async function getLastSeenGroupMessages(groupId,endDate,number=10){
  return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created <= "${endDate}"`, sort: '-created'})).items.reverse()
}

async function getGroupMessagesBetween(groupId,startDate,endDate){
  return await pb.collection('groupMessages').getFullList({filter:`group = "${groupId}" && created > "${startDate}" && created < "${endDate}"`, sort: 'created'})
}







async function initializeGroupMessages(groupId,initMessageId){
  var messages=[]


    try{
    if(initMessageId){
  
   
      messages.push(await getGroupMessageById(initMessageId))
      messages=[...(await getPreviousGroupMessages(groupId,messages[0].created)),messages[0]]
    }
    else{

  
      messages= await getLastSeenGroupMessages(groupId,useDataStore().allGroupsData.allMessages[groupId].lastSeen)
  
    }
  }
  catch{
  }
  if(messages.length<10){
    try{
      const extraGroups= await getNextGroupMessages(groupId,messages.at(-1)?.created ?? 0)
      messages=[...messages, ...extraGroups]
    }
    catch{}
  }
  
  if(messages.length<10){
    subscribeToNewMessages(groupId)}


  useDataStore().allGroupsData.allMessages[groupId].messages=messages
  
  }


  function subscribeToNewMessages(groupId){
   
    useDataStore().allGroupsData.allMessages[groupId].cacheNewMessages=true
  }



class GroupMessageGenerator{
  constructor(groupId,initMessageId){
    this.groupId=groupId
    this.initMessageId=initMessageId

  }

  async initializeMessages(){
    await initializeGroupMessages(this.groupId,this.initMessageId);
  }

  async getPreviousMessages(){
    try{
      const previous10Messages= await getPreviousGroupMessages(this.groupId,useDataStore().allGroupsData.allMessages[this.groupId].messages[0].created)
      if(!previous10Messages.length){return false};
        useDataStore().allGroupsData.allMessages[this.groupId].messages=[...previous10Messages, ...useDataStore().allGroupsData.allMessages[this.groupId].messages]
  
  
      }
      catch{}
      return true
  }
  async getNextMessages(){
    var new10Messages=[]
    try{
      new10Messages= await getNextGroupMessages(this.groupId,useDataStore().allGroupsData.allMessages[this.groupId].messages.at(-1).created)
      if(!new10Messages.length){subscribeToNewMessages(this.groupId);return false};
      useDataStore().allGroupsData.allMessages[this.groupId].messages=[...useDataStore().allGroupsData.allMessages[this.groupId].messages, ...new10Messages]
//       if(new10Messages.length<10){
// subscribeToNewMessages()}
    }
    catch{}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.groupId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastGroupMessages(this.groupId)
    useDataStore().allGroupsData.allMessages[this.groupId].messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allGroupsData.allMessages[this.groupId].lastSeen) < new Date(date)){
        useDataStore().allGroupsData.allMessages[this.groupId].lastSeen=date;
      pb.collection('groupMembers').update(useDataStore().allGroupsData.allMessages[this.groupId].groupRelId,{lastseen:date})
      }
    subscribeToNewMessages(this.groupId)
  }

  async getRepliedMessage(repliedMessageId){
    const repliedMessage = await getGroupMessageById(repliedMessageId)
    const startDate = repliedMessage.created
    const endDate = useDataStore().allChatsData.allMessages[this.groupId].messages[0].created
    const betweenMessages = await getChatMessagesBetween(this.groupId,startDate,endDate)
    useDataStore().allChatsData.allMessages[this.groupId].messages = [repliedMessage, ...betweenMessages, ...useDataStore().allChatsData.allMessages[this.groupId].messages]
  }

}



async function join(groupId){
  try{
    await pb.collection('groupMembers').update(useDataStore().allGroupsData.allMessages[groupId].groupRelId,{"active":true})
    useDataStore().allGroupsData.allMessages[groupId].active=true
    useDataStore().allGroupsData.groupRels.find(groupRel=>groupRel.group==groupId).active=true
  }catch{}
  try{const groupRel = await pb.collection('groupMembers').create({"mem":pb.authStore.model.id, "group":groupId, "active":true},{expand:'mem,group'});
  const messages=useDataStore().allGroupsData.allMessages[groupId].messages
  const cacheNewMessages=useDataStore().allGroupsData.allMessages[groupId].cacheNewMessages
  useDataStore().allGroupsData.allMessages[groupId]=new GroupData(groupRel)
  try{
    await useDataStore().allGroupsData.allMessages[groupId].init()
  }catch{}
  useDataStore().allGroupsData.allMessages[groupId].messages=messages
  useDataStore().allGroupsData.allMessages[groupId].cacheNewMessages=cacheNewMessages
}
  catch{}}

async function leave(groupId){
  await pb.collection('groupMembers').update(useDataStore().allGroupsData.allMessages[groupId].groupRelId,{"active":false})
  useDataStore().allGroupsData.allMessages[groupId].active=false
  useDataStore().allGroupsData.groupRels.find(groupRel=>groupRel.group==groupId).active=false
}

async function blockMember(groupId,memberId){
  var formData = new FormData();
  formData.append("blocklist+", memberId)
  pb.collection('groups').update(groupId,formData)
}

async function unBlockMember(groupId,memberId){
  var formData = new FormData();
  formData.append("blocklist-", memberId)
  pb.collection('groups').update(groupId,formData)
}


export {GroupMessageGenerator,join,leave,blockMember,unBlockMember,subscribeToNewMessages}