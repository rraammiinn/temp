import pb from "@/main";

async function getChatMessages(otherId, options={initMessageId, startDate, endDate, number}){
    options.startDate ??= 0;
    options.number ??=10;
    if(options.initMessageId){
        const initMessage=await pb.collection('chatMessages').getOne(options.initMessageId);
        return [...(await getChatMessages(otherId,{endDate:initMessage.created})),initMessage]
    }
    // else if(options.startDate && options.endDate){return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: 'created'})).items}
    // else if(op.startDate){}
    else if(options.endDate){return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: '-created'})).items.reverse()}
    else{return (await pb.collection('chatMessages').getList(1,options.number,{filter:`(from = "${otherId}" || to = "${otherId}") && created > "${options.startDate}"`, sort: 'created'})).items}
}


export {getChatMessages}