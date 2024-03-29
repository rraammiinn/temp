<template>
    <div id="tg-main" style="width: 100%;height: 100%;overflow-y: scroll;">
  
      <v-list v-if="searchMessage" :items="Object.keys(searchMessageResults)"  item-props  lines="three">
  
  <div v-for="searchMessageResult in searchMessageResults">
      <v-list-item @click="$router.push({name:'chat',params:{otherId:(searchMessageResult.expand[searchMessageResult.from==pb.authStore.model.id ? 'to' : 'from']).id},query:{initMessageId:searchMessageResult.id,showUser:false}})" v-if="searchMessageResult.to" class="listItem" :class="{online:allMessagesSorted[(searchMessageResult.expand[searchMessageResult.from==pb.authStore.model.id ? 'to' : 'from']).id]?.isOnline}"
      :prepend-avatar="getUserAvatarUrl(searchMessageResult[searchMessageResult.from==pb.authStore.model.id ? 'to' : 'from'], searchMessageResult.expand[searchMessageResult.from==pb.authStore.model.id ? 'to' : 'from'].avatar)"
      :title="searchMessageResult.expand[searchMessageResult.from==pb.authStore.model.id ? 'to' : 'from'].name"
      :subtitle="searchMessageResult.text"
    ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchMessageResult.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchMessageResult.created).toLocaleTimeString([],{ hour12: false }) }}</span></div></template></v-list-item>
  
  
    <v-list-item @click="$router.push({name:'group',params:{groupId:searchMessageResult.group},query:{initMessageId:searchMessageResult.id,showGroup:false}})" v-if="searchMessageResult.group" class="listItem"
      :prepend-avatar="getGroupAvatarUrl(searchMessageResult.group, searchMessageResult.expand.group.avatar)"
      :title="searchMessageResult.expand.group.name"
      :subtitle="`${searchMessageResult.expand.from.name} : ${searchMessageResult.text}`"
    ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchMessageResult.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchMessageResult.created).toLocaleTimeString([],{ hour12: false }) }}</span></div></template></v-list-item>
  
  
    <v-list-item @click="$router.push({name:'channel',params:{channelId:searchMessageResult.channel},query:{initMessageId:searchMessageResult.id,showChannel:false}})" v-if="searchMessageResult.channel" class="listItem"
      :prepend-avatar="getChannelAvatarUrl(searchMessageResult.channel, searchMessageResult.expand.channel.avatar)"
      :title="searchMessageResult.expand.channel.name"
      :subtitle="searchMessageResult.text"
    ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchMessageResult.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(searchMessageResult.created).toLocaleTimeString([],{ hour12: false }) }}</span></div></template></v-list-item>
    <v-divider></v-divider>
  </div>
  </v-list>
  
  
  <v-list v-else :items="Object.keys(allMessagesSorted)"  item-props  lines="three">
  
  <template v-for="messages in allMessagesSorted">
      <v-list-item @contextmenu.prevent="sheetId=messages.other.id;chatSheet=true;" v-if="messages.lastMessage && messages.messagesType=='chat' && messages.active && messages.other.id != pb.authStore.model.id" class="listItem" :class="{online:messages.isOnline}" @click="$router.push({name:'chat',params:{otherId:messages.other.id},query:{showUser:false}})"
      :prepend-avatar="getUserAvatarUrl(messages.other.id, messages.other.avatar)"
      :title="messages.other.name"
      :subtitle="messages.lastMessage.text"
    ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created).toLocaleTimeString([],{ hour12: false }) }}</span><v-chip style="margin-top: .5rem;font-size: .5rem;font-weight: bold;height: 1rem;padding-left: .25rem;padding-right: .25rem;" v-if="messages.unseenCount">{{ messages.unseenCount }}</v-chip></div></template></v-list-item>
    
    <v-list-item @contextmenu.prevent="sheetId=messages.group.id;groupSheet=true;" v-if="messages.lastMessage && messages.messagesType=='group' && messages.active" class="listItem" @click="$router.push({name:'group',params:{groupId:messages.group.id},query:{showGroup:false}})"
      :prepend-avatar="getGroupAvatarUrl(messages.group.id, messages.group.avatar)"
      :title="messages.group.name"
      :subtitle="`${allGroupsData.allMessages[messages.lastMessage.group].groupMems[messages.lastMessage.from]?.name} : ${messages.lastMessage.text}`"
    ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created).toLocaleTimeString([],{ hour12: false }) }}</span><v-chip style="opacity: .65;margin-top: .5rem;font-size: .5rem;font-weight: bold;height: 1rem;padding-left: .25rem;padding-right: .25rem;" v-if="messages.unseenCount">{{ messages.unseenCount }}</v-chip></div></template></v-list-item>
  
    <v-list-item @contextmenu.prevent="sheetId=messages.channel.id;channelSheet=true;" v-if="messages.lastMessage && messages.messagesType=='channel' && messages.active" class="listItem" @click="$router.push({name:'channel',params:{channelId:messages.channel.id},query:{showChannel:false}})"
      :prepend-avatar="getChannelAvatarUrl(messages.channel.id, messages.channel.avatar)"
      :title="messages.channel.name"
      :subtitle="`${messages.lastMessage.text}`"
    ><template v-slot:append><div style="display: flex;flex-direction: column;align-items: flex-end;justify-content: space-between;"><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created.slice(0,10)).toLocaleDateString() }}</span><span style="padding-right: .1rem;opacity: .5;font-size: .5rem;font-weight: bold;">{{ new Date(messages.lastMessage.created).toLocaleTimeString([],{ hour12: false }) }}</span><v-chip style="opacity: .65;margin-top: .5rem;font-size: .5rem;font-weight: bold;height: 1rem;padding-left: .25rem;padding-right: .25rem;" v-if="messages.unseenCount">{{ messages.unseenCount }}</v-chip></div></template></v-list-item>
  
    
    <v-divider v-if="messages.lastMessage && (messages.messagesType =='channel' || messages.active)"></v-divider>
  </template>
  </v-list>
  
  
  <Transition name="pop" >
    <div style="position: fixed;bottom: 1.5rem;right: 1.5rem;display: flex;flex-direction: column;align-items: flex-end;" v-show="showActionButton">
          <div>
              <div style="display: flex;justify-content: flex-end;gap: 1rem;align-items: center;padding: .5rem;padding-top: 0;"><Transition name="delayed-scale"><v-chip v-show="showActionButtonItems" color="primary">add channel</v-chip></Transition><Transition name="fade-second-button"><v-btn v-show="showActionButtonItems" @click="showChannelCreationForm=true" style="border-radius: 50%;" color="primary" icon="mdi-podcast" rounded size="2.5rem" elevation="24"></v-btn></Transition></div>
              <div style="display: flex;justify-content: flex-end;gap: 1rem;align-items: center;padding: .5rem;padding-top: 0;"><Transition name="delayed-scale"><v-chip v-show="showActionButtonItems" color="primary">add group</v-chip></Transition><Transition name="fade-first-button"><v-btn v-show="showActionButtonItems" @click="showGroupCreationForm=true" style="border-radius: 50%;" color="primary" icon="mdi-thumbs-up-down" rounded size="2.5rem" elevation="24"></v-btn></Transition></div>
          </div>
            <v-btn @click="showActionButtonItems=!showActionButtonItems" :icon="showActionButtonItems ? 'mdi-close' : 'mdi-plus'" style="border-radius: 50%;margin-top: 1rem;" :color="showActionButtonItems ? 'error' : 'primary'" size="3.5rem" elevation="24"></v-btn>
        </div>  
  </Transition>
  
  
            <v-dialog persistent transition="dialog-bottom-transition" v-model="showGroupCreationForm">
              <tg-create-group-form v-model="newGroup" @click:create="createNewGroup" @click:cancel="showGroupCreationForm=false;newGroup={};"></tg-create-group-form>
            </v-dialog>
  
            <v-dialog persistent transition="dialog-bottom-transition" v-model="showChannelCreationForm">
              <tg-create-channel-form v-model="newChannel" @click:create="createNewChannel" @click:cancel="showChannelCreationForm=false;newChannel={};"></tg-create-channel-form>
            </v-dialog>
  
    </div>
  
  
  
  
  
  
  
  
    <v-bottom-sheet v-model="chatSheet">
          <div style="width: 100%;">
            <v-btn @click="block(sheetId);chatSheet=false;" width="100%" height="3rem" color="error" style="border-radius: 0;border-top-left-radius: .25rem;border-top-right-radius: .25rem;display: flex;justify-content: space-between;" prepend-icon="mdi-power-off">block</v-btn>
          <v-btn style="border-radius: 0;" width="100%" prepend-icon="mdi-close" @click="chatSheet=false">close</v-btn>
          </div>
    </v-bottom-sheet>
  
    <v-bottom-sheet v-model="groupSheet">
          <div style="width: 100%;">
            <v-btn @click="leave(sheetId);groupSheet=false;" width="100%" height="3rem" color="error" style="border-radius: 0;border-top-left-radius: .25rem;border-top-right-radius: .25rem;display: flex;justify-content: space-between;" prepend-icon="mdi-logout">leave</v-btn>
          <v-btn style="border-radius: 0;" width="100%" prepend-icon="mdi-close" @click="groupSheet=false">close</v-btn>
          </div>
    </v-bottom-sheet>
  
    <v-bottom-sheet v-model="channelSheet">
          <div style="width: 100%;">
            <v-btn @click="unsubscribe(sheetId);channelSheet=false;" width="100%" height="3rem" color="error" style="border-radius: 0;border-top-left-radius: .25rem;border-top-right-radius: .25rem;display: flex;justify-content: space-between;" prepend-icon="mdi-logout">unsubscribe</v-btn>
          <v-btn style="border-radius: 0;" width="100%" prepend-icon="mdi-close" @click="channelSheet=false">close</v-btn>
          </div>
    </v-bottom-sheet>
  
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
    import pb from '@/main';
    import { join, leave } from '@/funcs/groupFuncs';
    import { subscribe, unsubscribe } from '@/funcs/channelFuncs';
    import { block } from '@/funcs/chatFuncs';
  
    import { ref, inject, watchEffect, onMounted, onBeforeUnmount, onUpdated, onBeforeMount } from 'vue';
    import tgCreateGroupForm from './tgCreateGroupForm.vue';
    import tgCreateChannelForm from './tgCreateChannelForm.vue'
    import {storeToRefs} from 'pinia'
    import {useDataStore} from '@/store/dataStore'
  
    import {useOtherStore} from '@/store/otherStore'
  
    import {getUserAvatarUrl, getGroupAvatarUrl, getChannelAvatarUrl} from '@/funcs/commonFuncs';
  
  
    const chatSheet = ref(false)
    const groupSheet = ref(false)
    const channelSheet = ref(false)
  
    const sheetId = ref()
  
  
    const {showError, showAlert, showProgressBar, hideProgressBar} = useOtherStore()
  
  
  
    const{allGroupsData,allMessagesSorted,searchMessageResults}=storeToRefs(useDataStore())
  
  
    const searchMessage=inject('searchMessage')
    // const searchMessageResults=ref([])
  
    const newGroup=ref({})
    const newChannel=ref({})
  
  
  
  const showGroupCreationForm=ref(false)
  const showChannelCreationForm=ref(false)
  
  
    let startScrollTop=0
  
  // watchEffect(async ()=>{
  //   if(searchMessage.value){
  //     searchMessageResults.value=[...await pb.collection('chatMessages').getFullList({filter:`text ~ "${searchMessage.value}"`,expand:'from,to'}),
  //     ...await pb.collection('groupMessages').getFullList({filter:`text ~ "${searchMessage.value}"`,expand:'from,group'}),
  //     ...await pb.collection('channelMessages').getFullList({filter:`text ~ "${searchMessage.value}"`,expand:'channel'})].sort((a,b)=>new Date(b.created).getTime()-new Date(a.created).getTime())
  //   }
  // })
  
  const showActionButton=ref(true)
  const showActionButtonItems=ref(false)
  
  
  async function createNewGroup(){
    showProgressBar()
    try{
      if(!newGroup.value.name)return;
  
  let formData = new FormData();
  formData.append('owner',pb.authStore.model.id)
  formData.append('name',newGroup.value.name)
  formData.append('about',newGroup.value.about || '')
  if(newGroup.value.avatar?.[0])formData.append('avatar',newGroup.value.avatar[0])
  
  const record = await pb.collection('groups').create(formData);
  
  // await pb.collection('groupMembers').create({mem:pb.authStore.model.id,group:record.id})
  await join(record.id)
  newGroup.value={}
  showGroupCreationForm.value=false
  showAlert('group created successfully', 'success')
    }catch{showError('group creation failed.')}
  
  hideProgressBar()
  }
  
  
  async function createNewChannel(){
    showProgressBar()
    try{
      if(!newChannel.value.name)return;
  
  let formData = new FormData();
  formData.append('owner',pb.authStore.model.id)
  formData.append('name',newChannel.value.name)
  formData.append('about',newChannel.value.about || '')
  if(newChannel.value.avatar?.[0])formData.append('avatar',newChannel.value.avatar[0])
  
  const record = await pb.collection('channels').create(formData);
  await subscribe(record.id)
  
  newChannel.value={}
  showChannelCreationForm.value=false
  showAlert('channel created successfully', 'success')
    }catch{showError('channel creation failed.')}
  
  hideProgressBar()
  }
  
  
  // const allMessagesSorted=inject('allMessagesSorted')
  
  function changeActionButtonVisibility(e){
    showActionButton.value = startScrollTop > e.target.scrollTop;startScrollTop=e.target.scrollTop;showActionButtonItems.value=false;
  }
  
  onMounted(()=>{
    document.getElementById('tg-main').addEventListener('scroll',changeActionButtonVisibility,{passive:true})
  })
  
  
    </script>