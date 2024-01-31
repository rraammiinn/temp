<template>



    <v-list v-if="chatSearch" :items="Object.keys(searchChats)"  item-props  lines="three">

<div v-for="searchChat in searchChats" @click="$router.push({name:'chat',params:{otherId:(searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from']).id},query:{initMessageId:searchChat.id,showUser:false}})">
    <v-list-item class="listItem" :class="{online:allMessagesSorted[(searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from']).id]?.isOnline}"
    :prepend-avatar="`/api/files/users/${searchChat[searchChat.from==pb.authStore.model.id ? 'to' : 'from']}/${searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from'].avatar}`"
    :title="searchChat.expand[searchChat.from==pb.authStore.model.id ? 'to' : 'from'].name"
    :subtitle="searchChat.text"
  ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchChat.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchChat.created).toLocaleTimeString([],{ hour12: false }) }}</span></div></template></v-list-item>
  <v-divider></v-divider>
</div>
</v-list>


<v-list v-else :items="Object.keys(allMessagesSorted)"  item-props  lines="three">

<template v-for="messages in allMessagesSorted">
    <v-list-item v-if="messages.lastMessage && messages.messagesType=='chat'" class="listItem" :class="{online:messages.isOnline}" @click="$router.push({name:'chat',params:{otherId:messages.other.id},query:{showUser:false}})"
    :prepend-avatar="`/api/files/users/${messages.other.id}/${messages.other.avatar}`"
    :title="messages.other.name"
    :subtitle="messages.lastMessage.text"
  ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created).toLocaleTimeString([],{ hour12: false }) }}</span><v-chip style="margin-top: .5rem;font-size: .5rem;font-weight: bold;height: 1rem;padding-left: .25rem;padding-right: .25rem;" v-if="messages.unseenCount">{{ messages.unseenCount }}</v-chip></div></template></v-list-item>
  
  <v-list-item v-if="messages.lastMessage && messages.messagesType=='group'" class="listItem" @click="$router.push({name:'group',params:{groupId:messages.group.id},query:{showGroup:false}})"
    :prepend-avatar="`/api/files/groups/${messages.group.id}/${messages.group.avatar}`"
    :title="messages.group.name"
    :subtitle="`${allGroupsData.allMessages[messages.lastMessage.group].groupMems[messages.lastMessage.from]?.name} : ${messages.lastMessage.text}`"
  ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created).toLocaleTimeString([],{ hour12: false }) }}</span><v-chip style="opacity: .65;margin-top: .5rem;font-size: .5rem;font-weight: bold;height: 1rem;padding-left: .25rem;padding-right: .25rem;" v-if="messages.unseenCount">{{ messages.unseenCount }}</v-chip></div></template></v-list-item>

  <v-list-item v-if="messages.lastMessage && messages.messagesType=='channel'" class="listItem" @click="$router.push({name:'channel',params:{channelId:messages.channel.id},query:{showChannel:false}})"
    :prepend-avatar="`/api/files/channels/${messages.channel.id}/${messages.channel.avatar}`"
    :title="messages.channel.name"
    :subtitle="`${messages.lastMessage.text}`"
  ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created).toLocaleTimeString([],{ hour12: false }) }}</span><v-chip style="opacity: .65;margin-top: .5rem;font-size: .5rem;font-weight: bold;height: 1rem;padding-left: .25rem;padding-right: .25rem;" v-if="messages.unseenCount">{{ messages.unseenCount }}</v-chip></div></template></v-list-item>

  
  <v-divider v-if="messages.lastMessage"></v-divider>
</template>
</v-list>



      <div v-show="showActionButton" style="position: fixed;bottom: 1.5rem;right: 1.5rem;display: flex;flex-direction: column;align-items: flex-end;">
        <div v-show="showActionButtonItems">
          <div style="display: flex;justify-content: flex-end;gap: 1rem;align-items: center;padding: .5rem;padding-top: 0;"><v-chip color="primary">add channel</v-chip><v-btn @click="showChannelCreationForm=true" style="border-radius: 50%;" color="primary" icon="mdi-podcast" rounded size="2.5rem" elevation="24"></v-btn></div>
          <div style="display: flex;justify-content: flex-end;gap: 1rem;align-items: center;padding: .5rem;padding-top: 0;"><v-chip color="primary">add group</v-chip><v-btn @click="showGroupCreationForm=true" style="border-radius: 50%;" color="primary" icon="mdi-thumbs-up-down" rounded size="2.5rem" elevation="24"></v-btn></div>
        </div>
        <v-btn @click="showActionButtonItems=!showActionButtonItems" :icon="showActionButtonItems ? 'mdi-close' : 'mdi-plus'" style="border-radius: 50%;margin-top: 1rem;" :color="showActionButtonItems ? 'error' : 'primary'" size="3.5rem" elevation="24"></v-btn>
      </div>

          <v-dialog persistent transition="dialog-bottom-transition" v-model="showGroupCreationForm">
            <tg-create-group-form v-model="newGroup" @click:create="createNewGroup" @click:cancel="showGroupCreationForm=false;newGroup={};"></tg-create-group-form>
          </v-dialog>

          <v-dialog persistent transition="dialog-bottom-transition" v-model="showChannelCreationForm">
            <tg-create-channel-form v-model="newChannel" @click:create="createNewChannel" @click:cancel="showChannelCreationForm=false;newChannel={};"></tg-create-channel-form>
          </v-dialog>

  </template>

<style scoped>
.listItem{
  padding-left: 1rem;
}
.listItem:hover{
    color: var(--tgPrimary);
    background-color:var(--tgPrimaryHover);
}
.online{
  border-left: solid;
  padding-left: .75rem;
  border-color: var(--tgPrimary);
  border-left-width: .25rem;
}
.v-list-item-subtitle{
  display: block !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
.v-list-item-title{
  display: block !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

  <script setup>
  import { ref, inject, watchEffect, onMounted } from 'vue';
  import tgCreateGroupForm from './tgCreateGroupForm.vue';
  import tgCreateChannelForm from './tgCreateChannelForm.vue'
  import {storeToRefs} from 'pinia'
  import {useDataStore} from '@/store/dataStore'



  const{allGroupsData,allMessagesSorted}=storeToRefs(useDataStore())


  const chatSearch=inject('chatSearch')
  const searchChats=ref([])

  const newGroup=ref({})
  const newChannel=ref({})



const showGroupCreationForm=ref(false)
const showChannelCreationForm=ref(false)


  var startScrollTop=0
  onMounted(()=>{document.querySelector('.v-layout>.v-main').addEventListener('scroll',(e)=>{showActionButton.value = startScrollTop > e.target.scrollTop;startScrollTop=e.target.scrollTop;showActionButtonItems.value=false;},{passive:true})})
  import pb from '@/main';

watchEffect(async ()=>{
  if(chatSearch.value){
    searchChats.value=await pb.collection('chatMessages').getFullList({filter:`text ~ "${chatSearch.value}"`,expand:'from,to'})
  }
})

const showActionButton=ref(true)
const showActionButtonItems=ref(false)


async function createNewGroup(){
  if(!newGroup.value.name)return;

  var formData = new FormData();
  formData.append('owner',pb.authStore.model.id)
  formData.append('name',newGroup.value.name)
  formData.append('about',newGroup.value.about || '')
  if(newGroup.value.avatar?.[0])formData.append('avatar',newGroup.value.avatar[0])

  const record = await pb.collection('groups').create(formData);
  
  await pb.collection('groupMembers').create({mem:pb.authStore.model.id,group:record.id})
  newGroup.value={}
  showGroupCreationForm.value=false

}


async function createNewChannel(){
  if(!newChannel.value.name)return;

  var formData = new FormData();
  formData.append('owner',pb.authStore.model.id)
  formData.append('name',newChannel.value.name)
  formData.append('about',newChannel.value.about || '')
  if(newChannel.value.avatar?.[0])formData.append('avatar',newChannel.value.avatar[0])

  const record = await pb.collection('channels').create(formData);
  newChannel.value={}
  showChannelCreationForm.value=false

}


// const allMessagesSorted=inject('allMessagesSorted')


  </script>