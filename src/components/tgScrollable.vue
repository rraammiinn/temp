<template>


<div ref="scrollable" id="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 3rem;padding-bottom: 3rem;display: flex;flex-direction: column;container: scrollable / inline-size;">
    <template v-for="message,i in allMessages[props.otherId].messages" :key="message.id">
          <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(allMessages[props.otherId].messages[i-1]?.created).toLocaleDateString()" style="height: fit-content;width: fit-content;margin: auto;margin-bottom: 1rem;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;display: block;min-height: 1.5rem;min-width: 9rem;text-align: center;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>
    
    
    
          <tg-card class="tg-card" @imageSelect="(selectedImage)=>{$emit('imageSelect',selectedImage)}" @userSelect="(selectedUser)=>{$emit('userSelect',selectedUser)}" :message-type="props.messagesType" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :data-time="message.created" :time="message.created" :id="message.id" :user-id="message.from" :name="(allMessages[props.otherId].groupMems?.[message.from])?.name" :text="message.text" :avatar="`/api/files/users/${message.from}/${allMessages[props.otherId].groupMems?.[message.from]?.avatar}`" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(allMessages[props.otherId].otherLastSeen).getTime()"></tg-card>
    
    
        </template>
</div>

<v-btn v-show="showGoToBottom" @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;position: fixed;right: 1.5rem;bottom: 6.9rem;z-index: '555';" color="primary" size="3.5rem" elevation="24"></v-btn>



      </template>
      
      <script setup>
      import tgCard from './tgCard.vue';
      import pb from '@/main';
      import { computed, onUpdated, onMounted, ref } from 'vue';

    
    
      const props = defineProps(['otherId','initMessageId','messageGenerator','messagesType'])
      const emit = defineEmits(['reachedStart', 'reachedEnd'])
      const allMessages=defineModel('allMessages')



      const scrollable = ref()
      var updateCause='both'
      var startScrollTop=0;
      // var firstUpdate=true;
      var startEnabled=true;
      var endEnabled=true;
      var topCard;
      var bottomCard;
      const showGoToBottom=ref(false)


      console.log('props ::: ',props)


      // onMounted(()=>{if(props.initMessageId){document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});}else{scrollable.value?.scrollIntoView({block:'center'});}})

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
            const date = target.dataset.time
            dateObserver.unobserve(target);
            await updateLastSeen(date);
          },
          {root:scrollable.value}
        )

        const startObserver = new IntersectionObserver(
          (e)=>{console.log('intersected --------->>> start',e);if(e[0].isIntersecting){updateCause = updateCause == 'end' ? 'both' : 'start';props.messageGenerator.getPreviousMessages().then((res)=>{startEnabled=res;topCard=e[0].target;});startObserver.unobserve(e[0].target);}},
          {root:scrollable.value}
        )





        const endObserver = new IntersectionObserver(
          (e)=>{console.log('intersected --------->>> end',e);if(e[0].isIntersecting){updateCause = updateCause == 'start' ? 'both' : 'end';props.messageGenerator.getNextMessages().then((res)=>{endEnabled=res;bottomCard=e[0].target;});endObserver.unobserve(e[0].target);}},
          {root:scrollable.value}
        )

        function attachStartObserver(){
          if(updateCause != 'goToBottom' && startEnabled && topCard)topCard.scrollIntoView({block:'nearest'});
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




//   async function getPreviousMessages(){console.log('-----------getPreviousMessages----------->>>>>>>>>>>')
//   try{
//     const previous10Messages= await getPreviousChatMessages(props.otherId,allMessages.value[props.otherId].messages[0].created)
//     if(!previous10Messages.length){console.log('no more <<<');return};
//       allMessages.value[props.otherId].messages=[...previous10Messages, ...allMessages.value[props.otherId].messages]


//     }
//     catch{console.log('start errrrror @@@')}
//     // updateCause=null;
// }
  
//   async function getNextMessages(){console.log('------------getNextMessages---------->>>>>>>>>>>')
//   try{
//       const new10Messages= await getNextChatMessages(props.otherId,allMessages.value[props.otherId].messages.at(-1).created)
//       if(!new10Messages.length){console.log('no more >>>');return};
//       allMessages.value[props.otherId].messages=[...allMessages.value[props.otherId].messages, ...new10Messages]
//       if(!new10Messages.length){
// subscribeToNewMessages()}
//     }
//     catch{console.log('end errrrror @@@')}
//     // updateCause=null;
// }
              


        onUpdated(()=>{if(updateCause=='start')attachStartObserver();else if(updateCause=='end')attachEndObserver();else if(updateCause=='both'){attachStartObserver();attachEndObserver();}else if(updateCause=='goToBottom'){scrollable.value.scrollTop=scrollable.value.scrollHeight;attachStartObserver()};updateCause=null;attachDateObserver();})
    




    async function goToBottom(){
      if(endEnabled){
        updateCause='goToBottom'
        await props.messageGenerator.goToBottom()
      }
      scrollable.value.scrollTop=scrollable.value.scrollHeight;
  }





  onMounted(()=>{document.querySelector(`[data-time="${allMessages.value[props.otherId].lastSeen}"]`)?.scrollIntoView({block:'end',behavior:'smooth'});scrollable.value.addEventListener('scroll',(e)=>{showGoToBottom.value = startScrollTop < e.target.scrollTop;startScrollTop=e.target.scrollTop;},{passive:true});if(scrollable.value.scrollHeight==scrollable.value.clientHeight){updateLastSeen(document.querySelector('.tg-card:last-of-type').dataset.time)}})



  console.log('@@@@@almsg',allMessages.value)
      </script>