<template>


<!-- 
<div ref="scrollable" style="width: 90vw; height: 100dvh;position: fixed;bottom: 0;overflow-y: scroll;">
    <div style="padding-top: 5rem;padding-bottom: 5rem;display: flex;flex-direction: column;">
    <template v-for="message,i in props.allMessages[props.otherId].messages" :key="message.id">
      <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(props.allMessages[props.otherId].messages[i-1]?.created).toLocaleDateString()" style="width: fit-content;margin: auto;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>



      <tg-card @imageSelect="(selectedImage)=>{sheet = !sheet;image=selectedImage}" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :time="message.created" :id="message.id" :name="((message.from==pb.authStore.model.id) ? pb.authStore.model : props.allMessages[props.otherId].other).name" :text="message.text" :avatar="`/api/files/users/${message.from}/${((message.from==pb.authStore.model.id) ? pb.authStore.model : props.allMessages[props.otherId].other).avatar}`" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(props.allMessages[props.otherId].otherLastSeen).getTime()"></tg-card>


</template>
</div>
  </div>





 -->


    <v-infinite-scroll
      height="100%"
      side="both"
      @load="load"
    >
    <template v-for="message,i in props.allMessages[props.otherId].messages" :key="message.id">
      <v-chip v-if="new Date(message.created).toLocaleDateString() != new Date(props.allMessages[props.otherId].messages[i-1]?.created).toLocaleDateString()" style="min-height: 1.5rem;width: fit-content;margin: auto;position: sticky;top: 5rem;opacity: 1;z-index: 99999;background-color: var(--tgBg);border-top: solid;font-weight: bold;" color="var(--tgBrown)">{{ new Date(message.created).toLocaleDateString() }}</v-chip>



      <tg-card @imageSelect="(selectedImage)=>{sheet = !sheet;image=selectedImage}" :from-you="message.from==pb.authStore.model.id" :from-other="message.from!=pb.authStore.model.id" :time="message.created" :id="message.id" :name="((message.from==pb.authStore.model.id) ? pb.authStore.model : props.allMessages[props.otherId].other).name" :text="message.text" :avatar="`/api/files/users/${message.from}/${((message.from==pb.authStore.model.id) ? pb.authStore.model : props.allMessages[props.otherId].other).avatar}`" :images="message.images" :videos="message.videos" :audios="message.audios" :files="message.files" :seen="new Date(message.created).getTime() <= new Date(props.allMessages[props.otherId].otherLastSeen).getTime()"></tg-card>


    </template>

    <template v-slot:loading>
        <div></div>
    </template>
    </v-infinite-scroll>
  </template>
  
  <script setup>
  import tgCard from './tgCard.vue';
  import pb from '@/main';
  import { computed } from 'vue';


  const props = defineProps(['allMessages', 'otherId', 'getPreviousMessages', 'getNextMessages', 'startEnabled', 'endEnabled'])
  const emit = defineEmits(['reachedStart', 'reachedEnd'])
  const direction = computed(()=>{if(props.startEnabled && props.endEnabled) return 'both'; else if (props.endEnabled) return 'end'; else if(props.endEnabled) return 'start'; else return null;})



  import { ref } from 'vue';
        async function load ({ side, done }) {
            console.log('dir : '+direction.value)
            if (side == 'start' && (direction.value == 'both' || direction.value == 'start')) {
                console.log('-----> start')
            //   emit('reachedStart')
            await props.getPreviousMessages({done})
            } else if (side == 'end' && (direction.value == 'both' || direction.value == 'end')) {
                console.log('-----> end')
                // emit('reachedEnd')
                await props.getNextMessages({done})
            }
  
            // done('ok')
            
            else {if(direction.value)done('ok');};

          }
  </script>