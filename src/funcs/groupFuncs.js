import {pb} from '@/funcs/pb';

import {useDataStore} from '@/store/dataStore'
import { GroupData } from "@/store/dataModels";
import {db} from '@/funcs/db'

import {getSingleCacheGroupMessage,getAllCacheGroupMessages,addOrUpdateSingleCacheGroupMessage,addOrUpdateAllCacheGroupMessages,removeSingleCacheGroupMessage,removeAllCacheGroupMessages,replaceAllCacheGroupMessages} from '@/funcs/db'






async function getGroupMessageById(id){
  return await pb.collection('groupMessages').getOne(id);
}

async function getPreviousGroupMessages(groupId,endDate,number=10){
  return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created < "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()
}

async function getNextGroupMessages(groupId,startDate=0,number=10){
  return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created > "${startDate}"`, sort: 'created',$autoCancel:false})).items
}

async function getLastGroupMessages(groupId,endDate,number=10){
  if(endDate){return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created <= "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()}
  else{return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}"`, sort: '-created',$autoCancel:false})).items.reverse()}
}

async function getLastSeenGroupMessages(groupId,endDate,number=10){
  return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created <= "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()
}

async function getGroupMessagesBetween(groupId,startDate,endDate){
  return await pb.collection('groupMessages').getFullList({filter:`group = "${groupId}" && created > "${startDate}" && created < "${endDate}"`, sort: 'created',$autoCancel:false})
}

async function getUpdatedGroupMessagesBetween(groupId, startDate, endDate){
  // console.log('updating.........g...')
  return await pb.collection('groupMessages').getFullList({filter:`group = "${groupId}" && created >= "${startDate}" && created <= "${endDate}" && updated > "${endDate}"`, sort: 'created',$autoCancel:false})
  // console.log('updating.........g...',res)
  // return res
}







async function initializeGroupMessages(groupId,initMessageId){
  let messages=[]

  messages = await getAllCacheGroupMessages(groupId)



    try{
      if(initMessageId && ! await getSingleCacheGroupMessage(initMessageId)){
        messages = []
    
    
        messages.push(await getGroupMessageById(initMessageId))
        messages=[...(await getPreviousGroupMessages(groupId,messages[0].created)),messages[0]]

        await replaceAllCacheGroupMessages(groupId, messages)

    }
    else{
      if(messages.length){
        // console.log('g msgs : ',messages)
        await addOrUpdateAllCacheGroupMessages(await getUpdatedGroupMessagesBetween(groupId, messages[0].created, messages.at(-1).created))
        messages = await getAllCacheGroupMessages(groupId)
//-------chche masseges need to be updated.
      }else{
        messages= await getLastSeenGroupMessages(groupId,useDataStore().allGroupsData.allDatas.get(groupId).lastSeen)
        await addOrUpdateAllCacheGroupMessages(messages)
      }  
    }
  }
  catch{
  }
  if(messages.length<10){
    try{
      const extraMessages= await getNextGroupMessages(groupId,messages.at(-1)?.created ?? 0)
      messages=[...messages, ...extraMessages]
      await addOrUpdateAllCacheGroupMessages(extraMessages)
    }
    catch{}
  }
  
  if(messages.length<10){
    subscribeToNewMessages(groupId)}


  useDataStore().allGroupsData.allDatas.get(groupId).messages=messages
  
  }


  function subscribeToNewMessages(groupId){
   
    useDataStore().allGroupsData.allDatas.get(groupId).cacheNewMessages=true
  }



class GroupMessageGenerator{
  constructor(groupId,initMessageId){
    this.groupId=groupId
    this.initMessageId=initMessageId

  }

  async initializeMessages(){
    await initializeGroupMessages(this.groupId,this.initMessageId);
  }

  subscribeToNewMessages(){
    useDataStore().allGroupsData.allDatas.get(this.groupId).cacheNewMessages=true
  }

  async getPreviousMessages(){
    try{
      const previous10Messages= await getPreviousGroupMessages(this.groupId,useDataStore().allGroupsData.allDatas.get(this.groupId).messages[0].created)
      if(!previous10Messages.length){return false};
        useDataStore().allGroupsData.allDatas.get(this.groupId).messages=[...previous10Messages, ...useDataStore().allGroupsData.allDatas.get(this.groupId).messages]
        await addOrUpdateAllCacheGroupMessages(previous10Messages)
      }
      catch{}
      return true
  }
  async getNextMessages(){
    let new10Messages=[]
    try{
      new10Messages= await getNextGroupMessages(this.groupId,useDataStore().allGroupsData.allDatas.get(this.groupId).messages.at(-1).created)
      if(!new10Messages.length){subscribeToNewMessages(this.groupId);return false};
      useDataStore().allGroupsData.allDatas.get(this.groupId).messages=[...useDataStore().allGroupsData.allDatas.get(this.groupId).messages, ...new10Messages]
      await addOrUpdateAllCacheGroupMessages(new10Messages)
    }
    catch{}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.groupId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastGroupMessages(this.groupId)
    useDataStore().allGroupsData.allDatas.get(this.groupId).messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allGroupsData.allDatas.get(this.groupId).lastSeen) < new Date(date)){
        useDataStore().allGroupsData.allDatas.get(this.groupId).lastSeen=date;
      pb.collection('groupMembers').update(useDataStore().allGroupsData.allDatas.get(this.groupId).groupRelId,{lastseen:date})
      }
    subscribeToNewMessages(this.groupId)
    await replaceAllCacheGroupMessages(this.groupId, last10Messages)
  }

  async getRepliedMessage(repliedMessageId){
    const repliedMessage = await getGroupMessageById(repliedMessageId)
    const startDate = repliedMessage.created
    const endDate = useDataStore().allGroupsData.allDatas.get(this.groupId).messages[0].created
    const betweenMessages = await getGroupMessagesBetween(this.groupId,startDate,endDate)
    useDataStore().allGroupsData.allDatas.get(this.groupId).messages = [repliedMessage, ...betweenMessages, ...useDataStore().allGroupsData.allDatas.get(this.groupId).messages]
    await addOrUpdateAllCacheGroupMessages([repliedMessage, ...betweenMessages])
  }

}



async function join(groupId){
  try{
    let groupRel;
    try{
      groupRel = await pb.collection('groupMembers').update(useDataStore().allGroupsData.allDatas.get(groupId).groupRelId,{"active":true})
    }catch{
      groupRel = await pb.collection('groupMembers').create({"mem":pb.authStore.model.id, "group":groupId, "active":true},{expand:'mem,group'});
    }finally{
      if(!useDataStore().allGroupsData.allDatas.get(groupId)){
          useDataStore().allGroupsData.allDatas.set(groupId, new GroupData(groupRel))
      }
      await useDataStore().allGroupsData.allDatas.get(groupId).init()
      useDataStore().allGroupsData.allDatas.get(groupId).active=true
      useDataStore().allGroupsData.allDatas.get(groupId).cacheNewMessages=false
      useDataStore().allGroupsData.allDatas.get(groupId).groupRelId ??= groupRel?.id
      useDataStore().allGroupsData.groupRels.find(groupRel=>groupRel.group==groupId).active=true
    }
  }catch{}
}

async function leave(groupId){
  await pb.collection('groupMembers').update(useDataStore().allGroupsData.allDatas.get(groupId).groupRelId,{"active":false})
  useDataStore().allGroupsData.allDatas.get(groupId).active=false
  useDataStore().allGroupsData.groupRels.find(groupRel=>groupRel.group==groupId).active=false
  useDataStore().allGroupsData.allDatas.get(groupId).cacheNewMessages=false
}

async function blockMember(groupId,memberId){
  let formData = new FormData();
  formData.append("blocklist+", memberId)
  await pb.collection('groups').update(groupId,formData)
}

async function unBlockMember(groupId,memberId){
  let formData = new FormData();
  formData.append("blocklist-", memberId)
  await pb.collection('groups').update(groupId,formData)
}


export {GroupMessageGenerator,join,leave,blockMember,unBlockMember,subscribeToNewMessages}