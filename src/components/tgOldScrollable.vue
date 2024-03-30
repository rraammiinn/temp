<template>


<div ref="scrollable" id="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 3rem;padding-bottom: 3rem;display: flex;flex-direction: column;container: scrollable / inline-size;">
    <template v-for="message,i in allDatas[props.otherId].messages" :key="message.id">
          <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(allDatas[props.otherId].messages[i-1]?.created).toLocaleDateString()" style="height: fit-content;width: fit-content;margin: auto;margin-bottom: 1rem;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;display: block;min-height: 1.5rem;min-width: 9rem;text-align: center;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>
    
    
    
          <tg-card @insert="(id)=>{cardInsertHandler(id)}" class="tg-card" @imageSelect="(selectedImage)=>{$emit('imageSelect',selectedImage)}" @userSelect="(selectedUser)=>{$emit('userSelect',selectedUser)}" :is-owner="props.isOwner" :message-type="props.messagesType" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :data-time="message.created" :time="message.created" :id="message.id" :user-id="message.from" :name="(allDatas[props.otherId].groupMems?.[message.from])?.name" :text="message.text" :avatar="getUserAvatarUrl(message.from, allDatas[props.otherId].groupMems?.[message.from]?.avatar)" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(allDatas[props.otherId].otherLastSeen).getTime()"></tg-card>
    
    
        </template>
</div>

<v-btn v-show="showGoToBottom" @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;position: fixed;right: 1.5rem;bottom: 6.9rem;z-index: '555';" color="primary" size="3.5rem" elevation="24"></v-btn>



      </template>
      
      <script setup>
      import tgCard from './tgCard.vue';
      import pb from '@/main';
      import { computed, onUpdated, onMounted, ref, nextTick } from 'vue';

      import {getUserAvatarUrl} from '@/funcs/commonFuncs';


    
    
      const props = defineProps(['otherId','initMessageId','messageGenerator','messagesType','isOwner'])
      const emit = defineEmits(['reachedStart', 'reachedEnd'])
      const allDatas=defineModel('allDatas')



      const scrollable = ref()
      // let updateCause='both'
      let startScrollTop=0;
      let firstUpdate=true;
      let startEnabled=true;
      let endEnabled=true;
      let topCard;
      let bottomCard;
      const showGoToBottom=ref(false)

      if(!allDatas.value[props.otherId].cacheNewMessages && !allDatas.value[props.otherId].messages.length){
        await props.messageGenerator.initializeMessages()
      }







      async function updateLastSeen(date){
        if(new Date(allDatas.value[props.otherId].lastSeen) < new Date(date)){
            allDatas.value[props.otherId].lastSeen=date;
            if(props.messagesType=='chat'){
              pb.collection('rels').update(allDatas.value[props.otherId].relId,{lastseen:date})
            }else if(props.messagesType=='group'){
              pb.collection('groupMembers').update(allDatas.value[props.otherId].groupRelId,{lastseen:date})
            }else if(props.messagesType=='channel'){
              pb.collection('channelMembers').update(allDatas.value[props.otherId].channelRelId,{lastseen:date})
            }
      }
      }
    
    

        const dateObserver = new IntersectionObserver(
          async(e)=>{

            const target=e.filter(i=>i.isIntersecting).at(-1)?.target


            if(!target)return;
            const date = target.getAttribute('created')
            // const date = allDatas.value[props.otherId].messages.find(msg=>msg.id==target.id).created
            dateObserver.unobserve(target);
            await updateLastSeen(date);
          },
          {root:scrollable.value}
        )

        const startObserver = new IntersectionObserver(
          e=>getPreviousMessages(e),
          {root:scrollable.value}
        )





        const endObserver = new IntersectionObserver(
          e=>getNextMessages(e),
          {root:scrollable.value}
        )

        function attachStartObserver(){
          setTimeout(() => {
            startObserver.observe(document.querySelectorAll('.tg-card')[0])
          }, 1000);
        }

        function attachEndObserver(){
          if(bottomCard)bottomCard.scrollIntoView({block:'nearest'});
          setTimeout(() => {
            if(endEnabled){endObserver.observe(Array.from(document.querySelectorAll('.tg-card')).at(-1))}
          }, 1000);
        }

        
        function attachDateObserver(){
          Array.from(document.querySelectorAll('.tg-card')).slice(-10).forEach(i=>dateObserver.observe(i))
        }

        // function attachAllObservers(){
        //   attachStartObserver()
        //   attachEndObserver()
        //   attachDateObserver()
        // }




  async function getPreviousMessages(e){
    if(e[0].isIntersecting){

      startEnabled = await props.messageGenerator.getPreviousMessages()
      // await nextTick();
      // topCard=e[0].target;
      // startObserver.unobserve(e[0].target);
      // attachStartObserver()
      // attachDateObserver()
    }

}
  
  async function getNextMessages(e){
    if(e[0].isIntersecting){

      endEnabled = await props.messageGenerator.getNextMessages()
      // await nextTick();
      // bottomCard=e[0].target;
      // endObserver.unobserve(e[0].target);
      // attachEndObserver()
      // attachDateObserver()
    }

}
              


    




    async function goToBottom(){
      if(endEnabled){
        await props.messageGenerator.goToBottom()
        // await nextTick()
        // attachStartObserver()
        // attachDateObserver()
      }
      scrollable.value.scrollTop=scrollable.value.scrollHeight;
  }

  function cardInsertHandler(id){
    const card=document.getElementById(id)
    if(id == allDatas.value[props.otherId].messages[0].id){
      startObserver.observe(card)
    }else if(id == allDatas.value[props.otherId].messages.at(-1).id){
      endObserver.observe(card)
    }
    dateObserver.observe(card)
  }












  async function init(){
    setTimeout(() => {
            // document.querySelector(`[created="${allDatas.value[props.otherId].lastSeen}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});
 
      // attachAllObservers()

      if(props.initMessageId){
      document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});
      }else{
        // scrollable.value?.scrollIntoView({block:'center'});
        document.querySelector(`[created="${allDatas.value[props.otherId].lastSeen}"]`)?.scrollIntoView({block:'center'});
      }

      scrollable.value.addEventListener('scroll',(e)=>{showGoToBottom.value = startScrollTop < e.target.scrollTop;startScrollTop=e.target.scrollTop;},{passive:true});
      if(scrollable.value.scrollHeight==scrollable.value.clientHeight){updateLastSeen(allDatas.value[props.otherId].messages?.at(-1)?.created)}


    }, 100);
      }

onMounted(init)

      </script>