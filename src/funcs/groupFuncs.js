import pb from "@/main";


import {useDataStore} from '@/store/dataStore'




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







async function initializeGroupMessages(groupId,initMessageId){
  var messages=[]

  console.log('(((((',useDataStore().allGroupsData.allMessages[groupId])

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

  console.log(')))))',messages)

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
      if(!previous10Messages.length){console.log('no more <<<');subscribeToNewMessages(this.groupId);return false};
        useDataStore().allGroupsData.allMessages[this.groupId].messages=[...previous10Messages, ...useDataStore().allGroupsData.allMessages[this.groupId].messages]
  
  
      }
      catch{console.log('start errrrror @@@')}
      return true
  }
  async getNextMessages(){
    var new10Messages=[]
    try{
      new10Messages= await getNextGroupMessages(this.groupId,useDataStore().allGroupsData.allMessages[this.groupId].messages.at(-1).created)
      if(!new10Messages.length){console.log('no more >>>');return};
      useDataStore().allGroupsData.allMessages[this.groupId].messages=[...useDataStore().allGroupsData.allMessages[this.groupId].messages, ...new10Messages]
//       if(new10Messages.length<10){
// subscribeToNewMessages()}
    }
    catch{console.log('end errrrror @@@')}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.groupId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastGroupMessages(this.groupId)
    useDataStore().allGroupsData.allMessages[this.groupId].messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allGroupsData.allMessages[this.groupId].lastSeen) < new Date(date)){
      allMessages.value[props.groupId].lastSeen=date;
      pb.collection('groupRels').update(useDataStore().allGroupsData.allMessages[this.groupId].groupRelId,{lastseen:date})
      }
    subscribeToNewMessages(this.groupId)
  }

}




export {GroupMessageGenerator}