import pb from "@/main";


import {useDataStore} from '@/store/dataStore'


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







async function initializeChatMessages(otherId,initMessageId){
  let messages=[]


    try{
    if(initMessageId){
  
   
      messages.push(await getChatMessageById(initMessageId))
      messages=[...(await getPreviousChatMessages(otherId,messages[0].created)),messages[0]]
    }
    else{

  
      messages= await getLastSeenChatMessages(otherId,useDataStore().allChatsData.allMessages[otherId].lastSeen)
  
    }
  }
  catch{
  }
  if(messages.length<10){
    try{
      const extraChats= await getNextChatMessages(otherId,messages.at(-1)?.created ?? 0)
      messages=[...messages, ...extraChats]
    }
    catch{}
  }
  
  if(messages.length<10){
  subscribeToNewMessages(otherId)}


  useDataStore().allChatsData.allMessages[otherId].messages=messages
  
  }


  function subscribeToNewMessages(otherId){
   
    useDataStore().allChatsData.allMessages[otherId].cacheNewMessages=true
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
      const previous10Messages= await getPreviousChatMessages(this.otherId,useDataStore().allChatsData.allMessages[this.otherId].messages[0].created)
      if(!previous10Messages.length){return false};
        useDataStore().allChatsData.allMessages[this.otherId].messages=[...previous10Messages, ...useDataStore().allChatsData.allMessages[this.otherId].messages]
  
  
      }
      catch{}
      return true
  }
  async getNextMessages(){
    let new10Messages=[]
    try{
      new10Messages= await getNextChatMessages(this.otherId,useDataStore().allChatsData.allMessages[this.otherId].messages.at(-1).created)
      if(!new10Messages.length){subscribeToNewMessages(this.otherId);return false;};
      useDataStore().allChatsData.allMessages[this.otherId].messages=[...useDataStore().allChatsData.allMessages[this.otherId].messages, ...new10Messages]
//       if(new10Messages.length<10){
// subscribeToNewMessages()}
    }
    catch{}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.otherId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastChatMessages(this.otherId)
    useDataStore().allChatsData.allMessages[this.otherId].messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allChatsData.allMessages[this.otherId].lastSeen) < new Date(date)){
        useDataStore().allChatsData.allMessages[this.otherId].lastSeen=date;
      pb.collection('rels').update(useDataStore().allChatsData.allMessages[this.otherId].relId,{lastseen:date})
      }
    subscribeToNewMessages(this.otherId)
  }

  async getRepliedMessage(repliedMessageId){
    const repliedMessage = await getChatMessageById(repliedMessageId)
    const startDate = repliedMessage.created
    const endDate = useDataStore().allChatsData.allMessages[this.otherId].messages[0].created
    const betweenMessages = await getChatMessagesBetween(this.otherId,startDate,endDate)
    useDataStore().allChatsData.allMessages[this.otherId].messages = [repliedMessage, ...betweenMessages, ...useDataStore().allChatsData.allMessages[this.otherId].messages]
  }

}


  async function block(userId){
    await pb.collection('rels').update(useDataStore().allChatsData.rels.find(rel=>rel.following==userId).id,{"active":false})
    useDataStore().allChatsData.allMessages[userId].active=false
  }

  async function unblock(userId){
    await pb.collection('rels').update(useDataStore().allChatsData.rels.find(rel=>rel.following==userId).id,{"active":true})
    useDataStore().allChatsData.allMessages[userId].active=true
  }





export {ChatMessageGenerator,block,unblock,subscribeToNewMessages}