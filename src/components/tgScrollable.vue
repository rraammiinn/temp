<template>
  <div style="position: fixed;top: 4rem;z-index: 1;width: 90vw;">
    <v-chip v-if="topChipDate" :style="{visibility: (showDateChips ? 'visible' : 'hidden')}" style="height: fit-content;width: fit-content;margin: auto;margin-bottom: 1rem;opacity: 1;background-color: var(--tgBg);border-bottom: solid;font-weight: bold;display: block;min-height: 1.5rem;min-width: 9rem;text-align: center;border-top-left-radius: 0;border-top-right-radius: 0;" color="var(--tgBrown)">{{ topChipDate }}</v-chip>
  </div>

    <TransitionGroup name="list" tag="div" ref="scrollable" id="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 5rem;padding-bottom: 5rem;display: flex;flex-direction: column;container: scrollable / inline-size;">
        <div style="display: flex;flex-direction: column;width: 100%;" v-for="message,i in allDatas.get(props.otherId).messages" :key="message.id+message.updated">
              <v-chip :id="new Date(message.created).toLocaleDateString()" :data-date="formatDate(message.created)" @vnode-mounted="attachDateChipObserver(new Date(message.created).toLocaleDateString())" :style="{visibility: (showDateChips ? 'visible' : 'hidden')}" class="tg-date-chip" v-if="new Date(message.created).toLocaleDateString() != new Date(allDatas.get(props.otherId).messages[i-1]?.created).toLocaleDateString()" style="height: fit-content;width: fit-content;margin: auto;margin-bottom: 1rem;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-bottom: solid;font-weight: bold;display: block;min-height: 1.5rem;min-width: 9rem;text-align: center;" color="var(--tgBrown)">{{ formatDate(message.created) }}</v-chip>
        
              <suspense>
                <tg-card @goToMessage="goToMessage" @insert="(id)=>{cardInsertHandler(id)}" :glow="message.id == glowingMessageId" class="tg-card" @reply="(messageId,userAvatarUrl,messageText)=>{$emit('reply',messageId,userAvatarUrl,messageText)}" @imageSelect="(selected)=>{sheet = !sheet;selectedImages=selected;clickedImageId=selected.clickedImage;selectedImageUrl=selected.clickedImage}" @userSelect="(selectedUser)=>{$emit('userSelect',selectedUser)}" :replied-message-id="message.replyto" :is-owner="props.isOwner" :message-type="props.messagesType" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :data-time="message.created" :time="message.created" :id="message.id" :user-id="message.from" :name="(allDatas.get(props.otherId).groupMems?.get(message.from))?.name" :text="message.text" :avatar="getUserAvatarUrl(message.from, allDatas.get(props.otherId).groupMems?.get(message.from)?.avatar)" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(allDatas.get(props.otherId).otherLastSeen).getTime()" :edited="message.created != message.updated"></tg-card>
              </suspense>
        
        
            </div>
    </TransitionGroup>
    
    <Teleport v-if="showGoToBottom" to="#goToBottomBtn">
      <v-btn @click="goToBottom" icon="mdi-arrow-down" style="border-radius: 50%;" color="primary" size="3.5rem" elevation="24"></v-btn>
    </Teleport>


      <v-bottom-sheet @vnode-updated="()=>{if(sheet == false)imageObserver.disconnect()}" v-model="sheet">
        <div id="imagesScrollable" style="display: flex;overflow-x: scroll;scroll-snap-type:x mandatory;align-items: flex-end;margin-bottom: -1rem;">
          <div :id="`/api/files/${props.messagesType}Messages/${selectedImages.id}/${selectedImage}`" v-for="selectedImage in selectedImages.images" style="scroll-snap-align: center;width: 100%;min-width: 100%;display: flex;justify-content: center;align-items: end;">
          <v-img @vnode-mounted="attachImageObserver(`/api/files/${props.messagesType}Messages/${selectedImages.id}/${selectedImage}`)" style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;max-width: 100vw;max-height: 80dvh;object-fit: contain;margin: auto;" :src="`/api/files/${props.messagesType}Messages/${selectedImages.id}/${selectedImage}`" :style="{visibility : (imageVisibility ? 'visible' : 'hidden')}"></v-img>
        </div>
        </div>
        <div style="width: 100%;">
        <v-btn style="border-radius: 0;" color="error" width="50%" prepend-icon="mdi-close" @click="sheet=false;">close</v-btn>
        <a download style="text-decoration: none;" :href="selectedImageUrl"><v-btn style="border-radius: 0;" width="50%" color="primary" prepend-icon="mdi-download">download</v-btn></a>
        </div>
  
      </v-bottom-sheet>
    
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
          import {pb} from '@/funcs/pb';
          import { computed, onUpdated, onMounted, ref, nextTick } from 'vue';
    
          import {getUserAvatarUrl, formatDate} from '@/funcs/commonFuncs';

          import { useOtherStore } from '@/store/otherStore';

          const {showProgressBar, hideProgressBar} = useOtherStore()
    
    
        
        
          const props = defineProps(['otherId','initMessageId','messageGenerator','messagesType','isOwner','members'])
          const emit = defineEmits(['reachedStart', 'reachedEnd'])
          const allDatas=defineModel('allDatas')

          const sheet=ref(false);
          // const image=ref('')
          const selectedImageUrl=ref('')
          const selectedImages=ref({})
          const clickedImageId=ref('')
          const imageVisibility=ref(true)

          const imageObserver = new IntersectionObserver(
            (e)=>{if(e.filter(i=>i.isIntersecting)?.[0]?.target.id)selectedImageUrl.value=e.filter(i=>i.isIntersecting)?.[0]?.target.id;},
            {root:document.getElementById('imagesScrollable'), threshold:[.5,1]}
          )

          function attachImageObserver(id){
            imageObserver.observe(document.getElementById(id))
            scrolleToClickedImage()
          }

          function scrolleToClickedImage(){
            imageVisibility.value=false;
            setTimeout(()=>{
              try{
                document.getElementById(clickedImageId.value)?.scrollIntoView?.({inline:'center'})
              }catch{}finally{imageVisibility.value=true;setTimeout(()=>{selectedImageUrl.value=clickedImageId.value},100)}
            },500)
            // document.getElementById(clickedImageId.value)?.scrollIntoView?.({inline:'center'})
          }
    
    
    
          const scrollable = ref()
          // let updateCause='both'
          let initialized=false;
          let startScrollTop=0;
          let firstUpdate=true;
          let startEnabled=true;
          let endEnabled=true;
          let topCard;
          let bottomCard;
          const showGoToBottom=ref(false)
          const showDateChips=ref(false)

          const topChipDate=ref()
          let timerId;

          let jumpEnabled=true;
          let previousCard;
          let scrollableHeight=0;

          let glowingTimeout;
          
          let previousScrollHeight;
          let previousClientHeight;
          let previousScrollTop;

          const glowingMessageId=ref()
    
          if(!allDatas.value.get(props.otherId).cacheNewMessages && !allDatas.value.get(props.otherId).messages.length){
            await props.messageGenerator.initializeMessages()
          }
    
    
    
    
    
    
          async function updateLastSeen(date){
            if(new Date(allDatas.value.get(props.otherId).lastSeen) < new Date(date)){
                allDatas.value.get(props.otherId).lastSeen=date;
                if(props.messagesType=='chat'){
                  pb.collection('rels').update(allDatas.value.get(props.otherId).relId,{lastseen:date})
                }else if(props.messagesType=='group'){
                  pb.collection('groupMembers').update(allDatas.value.get(props.otherId).groupRelId,{lastseen:date})
                }else if(props.messagesType=='channel'){
                  pb.collection('channelMembers').update(allDatas.value.get(props.otherId).channelRelId,{lastseen:date})
                }
          }
          }
        
        
    
            const dateObserver = new IntersectionObserver(
              async(e)=>{
    
                const target=e.filter(i=>i.isIntersecting).at(-1)?.target
    
    
                if(!target)return;
                const date = target.getAttribute('created')
                // const date = allDatas.value.get(props.otherId).messages.find(msg=>msg.id==target.id).created
                dateObserver.unobserve(target);
                await updateLastSeen(date);
              },
              {root:document.getElementById('scrollable')}
            )

            const dateChipObserver = new IntersectionObserver(
              (e)=>{
                try{
                  const target = e.filter(i=>i.boundingClientRect.top <=10)[0]?.target
                  if(target.dataset.date)topChipDate.value=target.dataset.date
                }
                catch{}
              },
              {root:document.getElementById('scrollable')}
            )
    
            const startObserver = new IntersectionObserver(
              e=>getPreviousMessages(e),
              {root:document.getElementById('scrollable'), rootMargin:'50%', threshold:Array.from({length:1001},(_,i)=>i*.001)}
            )
    
    
    
    
    
            const endObserver = new IntersectionObserver(
              e=>getNextMessages(e),
              {root:document.getElementById('scrollable'), rootMargin:'50%', threshold:Array.from({length:1001},(_,i)=>i*.001)}
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



            function attachDateChipObserver(id){
              try{
                dateChipObserver.observe(document.getElementById(id))
              }catch{}
            }
            


    
      async function getPreviousMessages(e){
        if(!initialized || !startEnabled)return;
        if(e[0].isIntersecting && e[0].target.id == allDatas.value.get(props.otherId).messages[0].id){
          showProgressBar()
          if(previousCard === undefined)previousCard = document.getElementById(e[0].target.id)
    
          startEnabled = await props.messageGenerator.getPreviousMessages()
          hideProgressBar()
          await nextTick()
          if(previousCard && previousCard.getBoundingClientRect().y - 500 > scrollableHeight)previousCard.scrollIntoView({block:'nearest'})

          previousCard = null;
        }
    
    }
      
      async function getNextMessages(e){
        if(!initialized || !endEnabled || allDatas.value.get(props.otherId).cacheNewMessages)return;
        if(e.filter(i=>i.isIntersecting).at(-1)?.target?.id == allDatas.value.get(props.otherId).messages.at(-1).id){
          showProgressBar()
    
          endEnabled = await props.messageGenerator.getNextMessages()
          
          hideProgressBar()
        }
    
    }
                  
    
    
        
    
    
    
    
        async function goToBottom(){
          try{
            if(endEnabled){
            showProgressBar()
            await props.messageGenerator.goToBottom()
            endEnabled=false;
            // await nextTick()
            // attachStartObserver()
            // attachDateObserver()
          }
          }catch{}finally{
            document.getElementById('scrollable').scrollTop=document.getElementById('scrollable').scrollHeight;
            hideProgressBar()
          }
      }
    
      function cardInsertHandler(id){
        const card=document.getElementById(id)
        if(id == allDatas.value.get(props.otherId).messages[0].id){
          startObserver.observe(card)
        }else if(id == allDatas.value.get(props.otherId).messages.at(-1).id){
          endObserver.observe(card)
        }
        dateObserver.observe(card)

        const dateChips = document.getElementsByClassName('tg-date-chip')
        dateChipObserver.observe(card)
      }
    
    
    
    
    
    
      async function goToMessage(messageId){
        clearTimeout(glowingTimeout);
        glowingMessageId.value=messageId;
        let card=document.getElementById(messageId)
        if(!card){
          showProgressBar()
          await props.messageGenerator.getRepliedMessage(messageId)
          await nextTick()
          hideProgressBar()
          card=document.getElementById(messageId)
        }
        try{
          card.scrollIntoView({block:'center',behavior:'smooth'})
        }catch{
          setTimeout(() => {
            try{
              card=document.getElementById(messageId)
              card.scrollIntoView({behavior:'smooth'})
            }catch{
              setTimeout(() => {
                card=document.getElementById(messageId)
                card?.scrollIntoView?.()
              }, 500);
            }
          }, 200);
        }finally{
          glowingTimeout = setTimeout(() => {
            glowingMessageId.value=null;
          }, 3000);
        }
      }
    
    
    
    
    
    
      async function init(){
        setTimeout(() => {
          if(props.initMessageId){
            clearTimeout(glowingTimeout);
            glowingMessageId.value=props.initMessageId;
            try{
              document.getElementById(props.initMessageId)?.scrollIntoView({block:'center'});
            }catch{
              setTimeout(() => {
                try{
                  document.getElementById(props.initMessageId)?.scrollIntoView({block:'start'});
                }catch{
                  document.getElementById(props.initMessageId)?.scrollIntoView({block:'end'});
                }
              }, 500);
            }
          glowingTimeout = setTimeout(() => {
            glowingMessageId.value=null;
          }, 5000);
          }else{
            // document.getElementById('scrollable')?.scrollIntoView({block:'center'});
            document.querySelector(`[created="${allDatas.value.get(props.otherId).lastSeen}"]`)?.scrollIntoView({block:'center'});
          }
          
          document.getElementById('scrollable').addEventListener('scrollend',()=>{timerId = setTimeout(() => {
            showDateChips.value = false;
          }, 1000);})

          document.getElementById('scrollable').addEventListener('scroll',(e)=>{previousScrollHeight=e.target.scrollHeight;previousClientHeight=e.target.clientHeight;previousScrollTop=e.target.scrollTop;})
    
          document.getElementById('scrollable').addEventListener('scroll',(e)=>{if(previousCard === null)previousCard=undefined;clearTimeout(timerId);showDateChips.value = true;showGoToBottom.value = startScrollTop < e.target.scrollTop && ((e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) > e.target.clientHeight || endEnabled);startScrollTop=e.target.scrollTop;},{passive:true});
          if(document.getElementById('scrollable').scrollHeight==document.getElementById('scrollable').clientHeight){updateLastSeen(allDatas.value.get(props.otherId).messages?.at(-1)?.created)}

          previousScrollHeight=document.getElementById('scrollable').scrollHeight;
          previousClientHeight=document.getElementById('scrollable').clientHeight;
          previousScrollTop=document.getElementById('scrollable').scrollTop;
          
          scrollableHeight=document.getElementById('scrollable').clientHeight;

          initialized=true;
    
    
        }, 100);
          }



    
    onMounted(init)
    
          </script>