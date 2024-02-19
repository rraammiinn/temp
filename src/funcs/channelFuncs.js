import pb from "@/main";


import {useDataStore} from '@/store/dataStore'
import { ChannelData } from "@/store/dataModels";



async function getChannelMessageById(id){
  return await pb.collection('channelMessages').getOne(id);
}

async function getPreviousChannelMessages(channelId,endDate,number=10){
  return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created < "${endDate}"`, sort: '-created'})).items.reverse()
}

async function getNextChannelMessages(channelId,startDate=0,number=10){
  return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created > "${startDate}"`, sort: 'created'})).items
}

async function getLastChannelMessages(channelId,endDate,number=10){
  if(endDate){return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created <= "${endDate}"`, sort: '-created'})).items.reverse()}
  else{return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}"`, sort: '-created'})).items.reverse()}
}

async function getLastSeenChannelMessages(channelId,endDate,number=10){
  return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created <= "${endDate}"`, sort: '-created'})).items.reverse()
}







async function initializeChannelMessages(channelId,initMessageId){
  var messages=[]

  console.log('(((((',useDataStore().allChannelsData.allMessages[channelId])

    try{
    if(initMessageId){
  
   
      messages.push(await getChannelMessageById(initMessageId))
      messages=[...(await getPreviousChannelMessages(channelId,messages[0].created)),messages[0]]
    }
    else{

  
      messages= await getLastSeenChannelMessages(channelId,useDataStore().allChannelsData.allMessages[channelId].lastSeen)
  
    }
  }
  catch{
  }
  if(messages.length<10){
    try{
      const extraChannels= await getNextChannelMessages(channelId,messages.at(-1)?.created ?? 0)
      messages=[...messages, ...extraChannels]
    }
    catch{}
  }
  
  if(messages.length<10){
    subscribeToNewMessages(channelId)}

  console.log(')))))',messages)

  useDataStore().allChannelsData.allMessages[channelId].messages=messages
  
  }


  function subscribeToNewMessages(channelId){
   
    useDataStore().allChannelsData.allMessages[channelId].cacheNewMessages=true
  }



class ChannelMessageGenerator{
  constructor(channelId,initMessageId){
    this.channelId=channelId
    this.initMessageId=initMessageId

  }

  async initializeMessages(){
    await initializeChannelMessages(this.channelId,this.initMessageId);
  }

  async getPreviousMessages(){
    try{
      const previous10Messages= await getPreviousChannelMessages(this.channelId,useDataStore().allChannelsData.allMessages[this.channelId].messages[0].created)
      if(!previous10Messages.length){console.log('no more <<<');subscribeToNewMessages(this.channelId);return false};
        useDataStore().allChannelsData.allMessages[this.channelId].messages=[...previous10Messages, ...useDataStore().allChannelsData.allMessages[this.channelId].messages]
  
  
      }
      catch{console.log('start errrrror @@@')}
      return true
  }
  async getNextMessages(){
    var new10Messages=[]
    try{
      new10Messages= await getNextChannelMessages(this.channelId,useDataStore().allChannelsData.allMessages[this.channelId].messages.at(-1).created)
      if(!new10Messages.length){console.log('no more >>>');return};
      useDataStore().allChannelsData.allMessages[this.channelId].messages=[...useDataStore().allChannelsData.allMessages[this.channelId].messages, ...new10Messages]
//       if(new10Messages.length<10){
// subscribeToNewMessages()}
    }
    catch{console.log('end errrrror @@@')}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.channelId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastChannelMessages(this.channelId)
    useDataStore().allChannelsData.allMessages[this.channelId].messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allChannelsData.allMessages[this.channelId].lastSeen) < new Date(date)){
        useDataStore().allChannelsData.allMessages[this.channelId].lastSeen=date;
      pb.collection('channelMembers').update(useDataStore().allChannelsData.allMessages[this.channelId].channelRelId,{lastseen:date})
      }
    subscribeToNewMessages(this.channelId)
  }

}


async function subscribe(channelId){
  try{const channelRel = await pb.collection('channelMembers').create({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'});
  useDataStore().allChannelsData.allMessages[channelId]=new ChannelData(channelRel)
  await useDataStore().allChannelsData.allMessages[channelId].init()
  console.log('#&#', useDataStore().allChannelsData.allMessages[channelId])
}
  catch{}
}


  async function unsubscribe(channelId){
    pb.collection('channelMembers').delete(useDataStore().allChannelsData.allMessages[channelId].channelRelId)
    useDataStore().allChannelsData.channelRels = useDataStore().allChannelsData.channelRels.filter(channelRel=>channelRel.channel!=channelId)
    useDataStore().allChannelsData.allMessages[channelId].channelRelId=null
  }
  
  




export {ChannelMessageGenerator,subscribe,unsubscribe}