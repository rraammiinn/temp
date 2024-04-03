import pb from "@/main";


import {useDataStore} from '@/store/dataStore'
import { ChannelData } from "@/store/dataModels";



async function getChannelMessageById(id){
  return await pb.collection('channelMessages').getOne(id);
}

async function getPreviousChannelMessages(channelId,endDate,number=10){
  return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created < "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()
}

async function getNextChannelMessages(channelId,startDate=0,number=10){
  return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created > "${startDate}"`, sort: 'created',$autoCancel:false})).items
}

async function getLastChannelMessages(channelId,endDate,number=10){
  if(endDate){return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created <= "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()}
  else{return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}"`, sort: '-created',$autoCancel:false})).items.reverse()}
}

async function getLastSeenChannelMessages(channelId,endDate,number=10){
  return (await pb.collection('channelMessages').getList(1,number,{filter:`channel = "${channelId}" && created <= "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()
}







async function initializeChannelMessages(channelId,initMessageId){
  let messages=[]


    try{
    if(initMessageId){
  
   
      messages.push(await getChannelMessageById(initMessageId))
      messages=[...(await getPreviousChannelMessages(channelId,messages[0].created)),messages[0]]
    }
    else{

  
      messages= await getLastSeenChannelMessages(channelId,useDataStore().allChannelsData.allDatas.get(channelId).lastSeen)
  
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


  useDataStore().allChannelsData.allDatas.get(channelId).messages=messages
  
  }


  function subscribeToNewMessages(channelId){
   
    useDataStore().allChannelsData.allDatas.get(channelId).cacheNewMessages=true
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
      const previous10Messages= await getPreviousChannelMessages(this.channelId,useDataStore().allChannelsData.allDatas.get(this.channelId).messages[0].created)
      if(!previous10Messages.length){return false};
        useDataStore().allChannelsData.allDatas.get(this.channelId).messages=[...previous10Messages, ...useDataStore().allChannelsData.allDatas.get(this.channelId).messages]
  
  
      }
      catch{}
      return true
  }
  async getNextMessages(){
    let new10Messages=[]
    try{
      new10Messages= await getNextChannelMessages(this.channelId,useDataStore().allChannelsData.allDatas.get(this.channelId).messages.at(-1).created)
      if(!new10Messages.length){subscribeToNewMessages(this.channelId);return false;};
      useDataStore().allChannelsData.allDatas.get(this.channelId).messages=[...useDataStore().allChannelsData.allDatas.get(this.channelId).messages, ...new10Messages]
//       if(new10Messages.length<10){
// subscribeToNewMessages()}
    }
    catch{}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.channelId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastChannelMessages(this.channelId)
    useDataStore().allChannelsData.allDatas.get(this.channelId).messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allChannelsData.allDatas.get(this.channelId).lastSeen) < new Date(date)){
        useDataStore().allChannelsData.allDatas.get(this.channelId).lastSeen=date;
      pb.collection('channelMembers').update(useDataStore().allChannelsData.allDatas.get(this.channelId).channelRelId,{lastseen:date})
      }
    subscribeToNewMessages(this.channelId)
  }

}


async function subscribe(channelId){
  try{
    const channelRel = await pb.collection('channelMembers').create({"mem":pb.authStore.model.id, "channel":channelId},{expand:'mem,channel'});
    // const messages=useDataStore().allChannelsData.allDatas.get(channelId).messages
    useDataStore().allChannelsData.allDatas.set(channelId, new ChannelData(channelRel))
    await useDataStore().allChannelsData.allDatas.get(channelId).init()
    // useDataStore().allChannelsData.allDatas.get(channelId).messages=messages
}
  catch{}
}


  async function unsubscribe(channelId){
    await pb.collection('channelMembers').delete(useDataStore().allChannelsData.allDatas.get(channelId).channelRelId)
    useDataStore().allChannelsData.channelRels = useDataStore().allChannelsData.channelRels.filter(channelRel=>channelRel.channel!=channelId)
    useDataStore().allChannelsData.allDatas.get(channelId).channelRelId=null
    useDataStore().allChannelsData.allDatas.get(channelId).active=false
    useDataStore().allChannelsData.allDatas.get(channelId).cacheNewMessages=false
  
  }
  
  




export {ChannelMessageGenerator,subscribe,unsubscribe,subscribeToNewMessages}