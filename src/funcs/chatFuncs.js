import {pb} from '@/funcs/pb';

import {useDataStore} from '@/store/dataStore'

import {getSingleCacheChatMessage,getAllCacheChatMessages,addOrUpdateSingleCacheChatMessage,addOrUpdateAllCacheChatMessages,removeSingleCacheChatMessage,removeAllCacheChatMessages,replaceAllCacheChatMessages} from '@/funcs/db'


async function getChatMessageById(id){
  return await pb.collection('chatMessages').getOne(id);
}

async function getPreviousChatMessages(otherId,endDate,number=10){
  return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created < "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()
}

async function getNextChatMessages(otherId,startDate=0,number=10){
  return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${startDate}"`, sort: 'created',$autoCancel:false})).items
}

async function getLastChatMessages(otherId,endDate,number=10){
  if(endDate){return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created <= "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()}
  else{return (await pb.collection('chatMessages').getList(1,number,{filter:`from = "${otherId}" || to = "${otherId}"`, sort: '-created',$autoCancel:false})).items.reverse()}
}

async function getLastSeenChatMessages(otherId,endDate,number=10){
  return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created <= "${endDate}"`, sort: '-created',$autoCancel:false})).items.reverse()
}

async function getChatMessagesBetween(otherId,startDate,endDate){
  return await pb.collection('chatMessages').getFullList({filter:`(from = "${otherId}" || to = "${otherId}") && created > "${startDate}" && created < "${endDate}"`, sort: 'created',$autoCancel:false})
}

async function getUpdatedChatMessagesBetween(otherId, startDate, endDate){
  return await pb.collection('chatMessages').getFullList({filter:`(from = "${otherId}" || to = "${otherId}") && created >= "${startDate}" && created <= "${endDate}" && updated > "${endDate}"`, sort: 'created',$autoCancel:false})
}







async function initializeChatMessages(otherId,initMessageId){
  let messages=[]

  messages = await getAllCacheChatMessages(otherId)


    try{
    if(initMessageId && ! await getSingleCacheChatMessage(initMessageId)){
      messages = []
  
   
      messages.push(await getChatMessageById(initMessageId))
      messages=[...(await getPreviousChatMessages(otherId,messages[0].created)),messages[0]]

      await replaceAllCacheChatMessages(otherId, messages)
    }
    else{
      if(messages.length){
        await addOrUpdateAllCacheChatMessages(await getUpdatedChatMessagesBetween(otherId, messages[0].created), messages.at(-1).created)
        messages = await getAllCacheChatMessages(otherId)
//-------chche masseges need to be updated.
      }else{
        messages= await getLastSeenChatMessages(otherId,useDataStore().allChatsData.allDatas.get(otherId).lastSeen)
        await addOrUpdateAllCacheChatMessages(messages)
      }  
    }
  }
  catch{
  }
  if(messages.length<10){
    try{
      const extraMessages= await getNextChatMessages(otherId,messages.at(-1)?.created ?? 0)
      messages=[...messages, ...extraMessages]
      await addOrUpdateAllCacheChatMessages(extraMessages)
    }
    catch{}
  }
  
  if(messages.length<10){
  subscribeToNewMessages(otherId)}


  useDataStore().allChatsData.allDatas.get(otherId).messages=messages
  
  }


  function subscribeToNewMessages(otherId){
   
    useDataStore().allChatsData.allDatas.get(otherId).cacheNewMessages=true
  }



class ChatMessageGenerator{
  constructor(otherId,initMessageId){
    this.otherId=otherId
    this.initMessageId=initMessageId

  }

  async initializeMessages(){
    await initializeChatMessages(this.otherId,this.initMessageId);
  }

  async getPreviousMessages(){
    try{
      const previous10Messages= await getPreviousChatMessages(this.otherId,useDataStore().allChatsData.allDatas.get(this.otherId).messages[0].created)
      if(!previous10Messages.length){return false};
        useDataStore().allChatsData.allDatas.get(this.otherId).messages=[...previous10Messages, ...useDataStore().allChatsData.allDatas.get(this.otherId).messages]
        await addOrUpdateAllCacheChatMessages(previous10Messages)
      }
      catch{}
      return true
  }
  async getNextMessages(){
    let new10Messages=[]
    try{
      new10Messages= await getNextChatMessages(this.otherId,useDataStore().allChatsData.allDatas.get(this.otherId).messages.at(-1).created)
      if(!new10Messages.length){subscribeToNewMessages(this.otherId);return false;};
      useDataStore().allChatsData.allDatas.get(this.otherId).messages=[...useDataStore().allChatsData.allDatas.get(this.otherId).messages, ...new10Messages]
      await addOrUpdateAllCacheChatMessages(new10Messages)
    }
    catch{}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.otherId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastChatMessages(this.otherId)
    useDataStore().allChatsData.allDatas.get(this.otherId).messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allChatsData.allDatas.get(this.otherId).lastSeen) < new Date(date)){
        useDataStore().allChatsData.allDatas.get(this.otherId).lastSeen=date;
      pb.collection('rels').update(useDataStore().allChatsData.allDatas.get(this.otherId).relId,{lastseen:date})
      }
    subscribeToNewMessages(this.otherId)
    await replaceAllCacheChatMessages(this.otherId, last10Messages)
  }

  async getRepliedMessage(repliedMessageId){
    const repliedMessage = await getChatMessageById(repliedMessageId)
    const startDate = repliedMessage.created
    const endDate = useDataStore().allChatsData.allDatas.get(this.otherId).messages[0].created
    const betweenMessages = await getChatMessagesBetween(this.otherId,startDate,endDate)
    useDataStore().allChatsData.allDatas.get(this.otherId).messages = [repliedMessage, ...betweenMessages, ...useDataStore().allChatsData.allDatas.get(this.otherId).messages]
    await addOrUpdateAllCacheChatMessages([repliedMessage, ...betweenMessages])
  }

}


  async function block(userId){
    await pb.collection('rels').update(useDataStore().allChatsData.rels.find(rel=>rel.following==userId).id,{"active":false})
    useDataStore().allChatsData.allDatas.get(userId).active=false
  }

  async function unblock(userId){
    await pb.collection('rels').update(useDataStore().allChatsData.rels.find(rel=>rel.following==userId).id,{"active":true})
    useDataStore().allChatsData.allDatas.get(userId).active=true
  }





export {ChatMessageGenerator,block,unblock,subscribeToNewMessages,initializeChatMessages}