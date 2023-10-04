import pb from "@/main";

async function getGroupMessages(groupId,startDate=0,endDate){
    // options.startDate ??= 0;
    // options.number ??=10;
    // if(options.initMessageId){
    //     const initMessage=await pb.collection('groupMessages').getOne(options.initMessageId);
    //     return [...(await getGroupMessages(groupId,{endDate:initMessage.created})),initMessage]
    // }
    // else if(options.startDate && options.endDate){return (await pb.collection('groupMessages').getList(1,options.number,{filter:`(from = "${groupId}" || to = "${groupId}") && created > "${options.startDate}" && created < "${options.endDate}"`, sort: 'created'})).items}
    // else if(op.startDate){}
    if(endDate){return await pb.collection('groupMessages').getFullList({filter:`group = "${groupId}" && created >= "${startDate}" && created <= "${endDate}"`, sort: 'created'})}
    else{return await pb.collection('groupMessages').getFullList({filter:`group = "${groupId}" && created >= "${startDate}"`, sort: 'created'})}
}

async function getGroupMessageById(id){
    return await pb.collection('groupMessages').getOne(id);
}

async function getPreviousGroupMessages(groupId,endDate,number=10){
    return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created < "${endDate}"`, sort: '-created'})).items.reverse()
}

async function getNextGroupMessages(groupId,startDate,number=10){
    return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}" && created > "${startDate}"`, sort: 'created'})).items
}

async function getLastGroupMessages(groupId,number=10){
    return (await pb.collection('groupMessages').getList(1,number,{filter:`group = "${groupId}"`, sort: '-created'})).items.reverse()
}


export {getGroupMessages,getGroupMessageById,getPreviousGroupMessages,getNextGroupMessages,getLastGroupMessages}