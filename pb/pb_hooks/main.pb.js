// note: we listen to the subscribe request and not to the "on connect" 
// because the authentication happens during the subscription submission
onRealtimeAfterSubscribeRequest((e) => {
    const record = e.client.get("authRecord")

    if (record && !record.get("online")) {
        record.set("online", true);
        $app.dao().saveRecord(record);
    }
})

onRealtimeDisconnectRequest((e) => {
    const record = e.client.get("authRecord")

    if (record && record.get("online")) {
        record.set("online", false);
        $app.dao().saveRecord(record);
    }
})


onRecordBeforeCreateRequest((e) => {
    try{
        if(e.record.get("active")){
            const record = $app.dao().findRecordById("groups", e.record.get("group"))
            record.set("members", [...record.get("members"), e.record.get("mem")])
            $app.dao().saveRecord(record)
        }
    }catch{}
}, "groupMembers")

onRecordBeforeCreateRequest((e) => {
    try{
        const record = $app.dao().findRecordById("channels", e.record.get("channel"))
        record.set("members", [...record.get("members"), e.record.get("mem")])
        $app.dao().saveRecord(record)
    }catch{}
}, "channelMembers")

onRecordBeforeDeleteRequest((e) => {
    try{
        const record = $app.dao().findRecordById("channels", e.record.get("channel"))
        record.set("members", record.get("members").filter(member => member != e.record.get("mem")))
        $app.dao().saveRecord(record)
    }catch{}
}, "channelMembers")

onRecordBeforeUpdateRequest((e) => {
    try{    
        const record = $app.dao().findRecordById("groups", e.record.get("group"))
        if(e.record.get("active")){
            record.set("members", [...record.get("members"), e.record.get("mem")])
        }else{
            record.set("members", record.get("members").filter(member => member != e.record.get("mem")))
        }
        $app.dao().saveRecord(record)
    }catch{}
}, "groupMembers")





onAfterBootstrap((e) => {
    const records = $app.dao().findRecordsByFilter(
        "users",
        "online = true",
    )
    records.forEach(record => {record.set('online', false);$app.dao().saveRecord(record);})
})
