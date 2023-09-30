import pb from "@/main";

async function getChatMessages(otherId, options={initChatId, startDate, endDate, number}){
    options.startDate ??= 0;
    options.number ??=10;
    if(options.initChatId){
        const initChat=await pb.collection('chatMessages').getOne(options.initChatId);
        return [...(await getChatMessages(otherId,{endDate:initChat.created})),initChat]
    }
    // else if(options.startDate && options.endDate){return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: 'created'})).items}
    // else if(op.startDate){}
    else if(options.endDate){return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: '-created'})).items.reverse()}
    else{return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}"`, sort: 'created'})).items}
}


export {getChatMessages}