<template>


    <TransitionGroup name="list" tag="div" ref="scrollable" id="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 3rem;padding-bottom: 3rem;display: flex;flex-direction: column;container: scrollable / inline-size;">
        <div style="display: flex;flex-direction: column;width: 100%;" v-for="message,i in allMessages[props.otherId].messages" :key="message.id+message.updated">
              <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(allMessages[props.otherId].messages[i-1]?.created).toLocaleDateString()" style="height: fit-content;width: fit-content;margin: auto;margin-bottom: 1rem;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;display: block;min-height: 1.5rem;min-width: 9rem;text-align: center;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>
        
              <suspense>
                <tg-card @goToMessage="goToMessage" @insert="(id)=>{cardInsertHandler(id)}" class="tg-card" @reply="(messageId,userAvatarUrl,messageText)=>{$emit('reply',messageId,userAvatarUrl,messageText)}" @imageSelect="(selectedImage)=>{$emit('imageSelect',selectedImage)}" @userSelect="(selectedUser)=>{$emit('userSelect',selectedUser)}" :replied-message-id="message.replyto" :is-owner="props.isOwner" :message-type="props.messagesType" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :data-time="message.created" :time="message.created" :id="message.id" :user-id="message.from" :name="(allMessages[props.otherId].groupMems?.[message.from])?.name" :text="message.text" :avatar="getUserAvatarUrl(message.from, allMessages[props.otherId].groupMems?.[message.from]?.avatar)" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(allMessages[props.otherId].otherLastSeen).getTime()"></tg-card>
              </suspense>
        
        
            </div>
    </TransitionGroup>
    
    <v-btn v-show="showGoToBottom" @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;position: fixed;right: 1.5rem;bottom: 6.9rem;z-index: '555';" color="primary" size="3.5rem" elevation="24"></v-btn>
    
    
    
          </template>
          
          <style scoped>
          .list-enter-active{
            animation: enter 2s ease;
          }
          .list-leave-active {
            animation: leave 1s ease;
          }


@keyframes enter {
  0% {
    visibility: hidden;
    opacity: 0;
    transform: translateX(-10rem);
  }
  50% {
    visibility: visible;
    opacity: 0;
    transform: translateX(-10rem);

  }
  100% {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes leave {
  0% {
    opacity: 1;
    transform: translateX(0);

  }

  100% {
    opacity: 0;
    transform: translateX(10rem);
  }
}

          </style>
          
          <script setup>
          import tgCard from './tgCard.vue';
          import pb from '@/main';
          import { computed, onUpdated, onMounted, ref, nextTick } from 'vue';
    
          import {getUserAvatarUrl} from '@/funcs/commonFuncs';
    
    
        
        
          const props = defineProps(['otherId','initMessageId','messageGenerator','messagesType','isOwner'])
          const emit = defineEmits(['reachedStart', 'reachedEnd'])
          const allMessages=defineModel('allMessages')
    
    
    
          const scrollable = ref()
          // var updateCause='both'
          var initialized=false;
          var startScrollTop=0;
          var firstUpdate=true;
          var startEnabled=true;
          var endEnabled=true;
          var topCard;
          var bottomCard;
          const showGoToBottom=ref(false)
    
          if(!allMessages.value[props.otherId].cacheNewMessages && !allMessages.value[props.otherId].messages.length){
            await props.messageGenerator.initializeMessages()
          }
    
    
    
    
    
    
    
          async function updateLastSeen(date){
            if(new Date(allMessages.value[props.otherId].lastSeen) < new Date(date)){
                allMessages.value[props.otherId].lastSeen=date;
                if(props.messagesType=='chat'){
                  pb.collection('rels').update(allMessages.value[props.otherId].relId,{lastseen:date})
                }else if(props.messagesType=='group'){
                  pb.collection('groupMembers').update(allMessages.value[props.otherId].groupRelId,{lastseen:date})
                }else if(props.messagesType=='channel'){
                  pb.collection('channelMembers').update(allMessages.value[props.otherId].channelRelId,{lastseen:date})
                }
          }
          }
        
        
    
            const dateObserver = new IntersectionObserver(
              async(e)=>{
    
                const target=e.filter(i=>i.isIntersecting).at(-1)?.target
    
    
                if(!target)return;
                const date = target.getAttribute('created')
                // const date = allMessages.value[props.otherId].messages.find(msg=>msg.id==target.id).created
                dateObserver.unobserve(target);
                await updateLastSeen(date);
              },
              {root:document.getElementById('scrollable')}
            )
    
            const startObserver = new IntersectionObserver(
              e=>getPreviousMessages(e),
              {root:document.getElementById('scrollable')}
            )
    
    
    
    
    
            const endObserver = new IntersectionObserver(
              e=>getNextMessages(e),
              {root:document.getElementById('scrollable')}
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
        if(!initialized)return;
        // disableScroll()
        // setTimeout(() => {
        //   enableScroll()
        // }, 10);
        if(e[0].isIntersecting && e[0].target.id == allMessages.value[props.otherId].messages[0].id){
    
          startEnabled = await props.messageGenerator.getPreviousMessages()
          // await nextTick();
          // topCard=e[0].target;
          // startObserver.unobserve(e[0].target);
          // attachStartObserver()
          // attachDateObserver()
        }
    
    }
      
      async function getNextMessages(e){
        if(!initialized)return;
        // disableScroll()
        // setTimeout(() => {
        //   enableScroll()
        // }, 10);
        if(e[0].isIntersecting && e[0].target.id == allMessages.value[props.otherId].messages.at(-1).id){
    
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
          document.getElementById('scrollable').scrollTop=document.getElementById('scrollable').scrollHeight;
      }
    
      function cardInsertHandler(id){
        const card=document.getElementById(id)
        if(id == allMessages.value[props.otherId].messages[0].id){
          startObserver.observe(card)
        }else if(id == allMessages.value[props.otherId].messages.at(-1).id){
          endObserver.observe(card)
        }
        dateObserver.observe(card)
      }
    
    
    
    
    
    
      async function goToMessage(messageId){
        console.log('>--->>>',messageId);
        var card=document.getElementById(messageId)
        if(!card){
          console.log('???')
          await props.messageGenerator.getRepliedMessage(messageId)
          await nextTick()
          card=document.getElementById(messageId)
          // if(props.messagesType=='chat'){

          // }else if(props.messagesType=='group'){

          // }else if(props.messagesType=='channel'){

          // }
        }
        card.scrollIntoView({block:'center',behavior:'smooth'})
      }
    
    
    
    
    
    
      async function init(){
        setTimeout(() => {
                // document.querySelector(`[created="${allMessages.value[props.otherId].lastSeen}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});
     
          // attachAllObservers()
    
          if(props.initMessageId){
          document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});
          }else{
            // document.getElementById('scrollable')?.scrollIntoView({block:'center'});
            document.querySelector(`[created="${allMessages.value[props.otherId].lastSeen}"]`)?.scrollIntoView({block:'center'});
          }
    
          document.getElementById('scrollable').addEventListener('scroll',(e)=>{showGoToBottom.value = startScrollTop < e.target.scrollTop && (e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) > e.target.clientHeight;startScrollTop=e.target.scrollTop;},{passive:true});
          if(document.getElementById('scrollable').scrollHeight==document.getElementById('scrollable').clientHeight){updateLastSeen(allMessages.value[props.otherId].messages?.at(-1)?.created)}

          initialized=true;
    
    
        }, 100);
          }


// function preventScroll(e){
//     e.preventDefault();
//     e.stopPropagation();

//     return false;
// }

// function disableScroll(){
//   // document.querySelector('#scrollable').addEventListener('wheel', preventScroll);
//     document.querySelector('#scrollable').style.overflowY='hidden'
// }

// function enableScroll(){
//     // document.querySelector('#scrollable').removeEventListener('wheel', preventScroll);
//       document.querySelector('#scrollable').style.overflowY='auto'
// }
    
    onMounted(init)
    // onUpdated(()=>{if(firstUpdate)init()})
    
          </script>