import pb from "@/main";


import {useDataStore} from '@/store/dataStore'


async function getChatMessageById(id){
  return await pb.collection('chatMessages').getOne(id);
}

async function getPreviousChatMessages(otherId,endDate,number=10){
  return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created < "${endDate}"`, sort: '-created'})).items.reverse()
}

async function getNextChatMessages(otherId,startDate=0,number=10){
  return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${startDate}"`, sort: 'created'})).items
}

async function getLastChatMessages(otherId,endDate,number=10){
  if(endDate){return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created <= "${endDate}"`, sort: '-created'})).items.reverse()}
  else{return (await pb.collection('chatMessages').getList(1,number,{filter:`from = "${otherId}" || to = "${otherId}"`, sort: '-created'})).items.reverse()}
}

async function getLastSeenChatMessages(otherId,endDate,number=10){
  return (await pb.collection('chatMessages').getList(1,number,{filter:`(from = "${otherId}" || to = "${otherId}") && created <= "${endDate}"`, sort: '-created'})).items.reverse()
}







async function initializeChatMessages(otherId,initMessageId){
  var messages=[]

  console.log('(((((',useDataStore().allChatsData.allMessages[otherId])

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

  console.log(')))))',messages)

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
      if(!previous10Messages.length){console.log('no more <<<');return false};
        useDataStore().allChatsData.allMessages[this.otherId].messages=[...previous10Messages, ...useDataStore().allChatsData.allMessages[this.otherId].messages]
  
  
      }
      catch{console.log('start errrrror @@@')}
      return true
  }
  async getNextMessages(){
    var new10Messages=[]
    try{
      new10Messages= await getNextChatMessages(this.otherId,useDataStore().allChatsData.allMessages[this.otherId].messages.at(-1).created)
      if(!new10Messages.length){console.log('no more >>>');subscribeToNewMessages(this.otherId);return false;};
      useDataStore().allChatsData.allMessages[this.otherId].messages=[...useDataStore().allChatsData.allMessages[this.otherId].messages, ...new10Messages]
//       if(new10Messages.length<10){
// subscribeToNewMessages()}
    }
    catch{console.log('end errrrror @@@')}

    if(new10Messages.length<10){
      subscribeToNewMessages(this.otherId);return false;}
      return true;
  }

  async goToBottom(){
    const last10Messages=await getLastChatMessages(this.otherId)
    useDataStore().allChatsData.allMessages[this.otherId].messages=last10Messages
    const date = last10Messages.at(-1).created
      if(new Date(useDataStore().allChatsData.allMessages[this.otherId].lastSeen) < new Date(date)){
      allMessages.value[props.otherId].lastSeen=date;
      pb.collection('rels').update(useDataStore().allChatsData.allMessages[this.otherId].relId,{lastseen:date})
      }
    subscribeToNewMessages(this.otherId)
  }

}




export {ChatMessageGenerator}