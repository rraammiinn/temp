<template>
    <slot></slot>
</template>

<script setup>
import { ref, provide, onUnmounted } from 'vue';
import pb from './main';

// const other=ref()
const isLoggedIn = ref(pb.authStore?.isValid)
const contacts=ref(await pb.collection('rels').getFullList({
    sort: '-created',
    filter: `follower = "${pb.authStore?.model?.id}"`
}))




const lastChats=ref({})
provide('lastChats', lastChats)

const chats = ref(await pb.collection('chatMessages').getFullList({
    sort: 'created',
}));

// for (const chat of chats.value){
//     lastChats.value[(chat.from == pb.authStore?.model?.id) ? chat.to : chat.from]=chat
// }

pb.collection('chatMessages').subscribe('*', function (e) {
    if(e.action=='create'){
        chats.value.push(e.record)
        lastChats.value[(e.record.from == pb.authStore?.model?.id) ? e.record.to : e.record.from].lastChat=e.record
    }

});


pb.collection('rels').subscribe('*', async function(e){
    if(e.action=='create'){
        var index=(e.record.follower == pb.authStore?.model?.id) ? e.record.following : e.record.follower
        var user=await pb.collection('users').getOne(index)
        lastChats.value[index]={user:user, lastChat:null}
    }
})

provide('chats', chats)



const users=ref([])
users.value=await pb.collection('users').getFullList()
pb.collection('users').subscribe('*', getUsers);
async function getUsers(){
    users.value = await pb.collection('users').getFullList({
    sort: '-created',
});
}

provide('users', users)

await getUsers()


const rels=ref(await pb.collection('rels').getFullList({
    // filter:`follower = "${pb.authStore?.model?.id}" || following = "${pb.authStore?.model?.id}"`
    expand:'follower,following'
}))

console.log('rels : ',rels.value)

for await (const rel of rels.value){
    var index=(rel.follower == pb.authStore?.model?.id) ? rel.following : rel.follower
    lastChats.value[index] = {lastChat:null,user:null}
    try{
    lastChats.value[index]['lastChat'] = await pb.collection('chatMessages').getFirstListItem(`from = "${index}" || to = "${index}"`, {sort:'-created'})
    }catch{}
    lastChats.value[index]['user'] = (rel.follower == pb.authStore?.model?.id) ? rel.expand.following : rel.expand.follower
    lastChats.value[index]['unseen'] = (await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${index}" && seen = false`, sort:'-created'}))
}

// function getUserFromId(id){
//     return users.value.find(u=>u.id==id)
// }
// const userSearch=ref('')
// const chatSearch=ref('')
// const initMessageId=ref('')
const previousPage=ref('')
console.log('last chats : ',lastChats.value)

// provides ----------------------------------------------------------------

// provide('other', other)
provide ('isLoggedIn', isLoggedIn)
provide('contacts', contacts)
provide('rels', rels)
// provide('userSearch', userSearch)
// provide('chatSearch', chatSearch)
// provide('initMessageId', initMessageId)
provide('previousPage', previousPage)


const allMessages=ref({})
for await (const rel of rels.value){
    var index=(rel.follower == pb.authStore?.model?.id) ? rel.following : rel.follower
    allMessages.value[index] = {lastMessage:null,other:null,messages:[],unseenCount:0,cacheNewMessages:false,lastSeen:null}
    try{
    allMessages.value[index]['lastMessage'] = JSON.parse(localStorage.getItem(`lastMessage_${index}`)) || await pb.collection('chatMessages').getFirstListItem(`from = "${index}" || to = "${index}"`, {sort:'-created'})
    }catch{}
    allMessages.value[index]['other'] = (rel.follower == pb.authStore?.model?.id) ? rel.expand.following : rel.expand.follower
    // messages.value[index]['unseen'] = (await pb.collection('chatMessages').getList(1, 1, {filter:`from = "${index}" && seen = false`, sort:'-created'}))
}

provide('allMessages', allMessages)
console.log(allMessages.value)







setInterval(()=>{pb.collection('users').update(pb.authStore?.model?.id,{lastseen:new Date().toISOString().replace('T',' ')})},5000)
</script>