import pb from "@/main";

async function getChatMessages(otherId,startDate=0,endDate){
    // options.startDate ??= 0;
    // options.number ??=10;
    // if(options.initMessageId){
    //     const initMessage=await pb.collection('chatMessages').getOne(options.initMessageId);
    //     return [...(await getChatMessages(otherId,{endDate:initMessage.created})),initMessage]
    // }
    // // else if(options.startDate && options.endDate){return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: 'created'})).items}
    // else if(op.startDate){}
    if(options.endDate){return (await pb.collection('chatMessages').getFullList({filter:`(from = "${otherId}" || to = "${otherId}") && created >= "${startDate}" && created <= "${endDate}"`, sort: '-created'})).items.reverse()}
    else{return (await pb.collection('chatMessages').getFullList({filter:`(from = "${otherId}" || to = "${otherId}") && created >= "${startDate}"`, sort: 'created'})).items}
}



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


export {getChatMessages,getChatMessageById,getPreviousChatMessages,getNextChatMessages,getLastChatMessages}