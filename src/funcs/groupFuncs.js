import pb from "@/main";

async function getGroupMessages(groupId, options={initMessageId, startDate, endDate, number}){
    options.startDate ??= 0;
    options.number ??=10;
    if(options.initMessageId){
        const initMessage=await pb.collection('groupMessages').getOne(options.initMessageId);
        return [...(await getGroupMessages(groupId,{endDate:initMessage.created})),initMessage]
    }
    // else if(options.startDate && options.endDate){return (await pb.collection('groupMessages').getList(1,options.number,{filter:`(from = "${groupId}" || to = "${groupId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: 'created'})).items}
    // else if(op.startDate){}
    else if(options.endDate){return (await pb.collection('groupMessages').getList(1,options.number,{filter:`(from = "${groupId}" || to = "${groupId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: '-created'})).items.reverse()}
    else{return (await pb.collection('groupMessages').getList(1,options.number,{filter:`(from = "${groupId}" || to = "${groupId}") && created > "${options.startDate}"`, sort: 'created'})).items}
}


export {getGroupMessages}