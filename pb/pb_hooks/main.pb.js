// note: we listen to the subscribe request and not to the "on connect" 
// because the authentication happens during the subscription submission
onRealtimeAfterSubscribeRequest((e) => {
    const record = e.client.get("authRecord")

    if (record && !record.get("online")) {
        record.set("online", true);
        $app.dao().saveRecord(record);
    }
    console.log('rec : ',record)
})

onRealtimeDisconnectRequest((e) => {
    const record = e.client.get("authRecord")

    if (record && record.get("online")) {
        record.set("online", false);
        $app.dao().saveRecord(record);
    }
    console.log('rec : ',record)
})
