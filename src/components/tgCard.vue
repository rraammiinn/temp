<template>
<div :style="{alignSelf : (props.messageType=='channel') ? 'center' : (props.fromYou ? 'flex-end' : 'flex-start') }" style="border: solid;border-radius: .5rem;padding: .5rem;border-color: var(--tgBrown);max-width: 80%;margin: 1.5rem;margin-top: 1rem;margin-bottom: 3rem;width: min-content;position: relative;">


  <div v-if="props.messageType=='group'" @click="showName = !showName" @dblclick="$emit('userSelect',props.userId)" style="height: 3rem;margin-left: -2rem;margin-top: -2rem;background-color: var(--tgBg);border-radius: .5rem;margin-bottom: 1rem;border-style: solid;border-color: var(--tgBrown);border-width: .2rem;width: fit-content;max-width: calc(80cqw - 3rem);display: flex;align-items: center;white-space: nowrap;">
    <img style="height: 100%;width: 2.6rem;object-fit: cover;border-radius: .3rem;" :src="props.avatar" :style="{borderTopRightRadius : (showName ? '0' : '.3rem'), borderBottomRightRadius : (showName ? '0' : '.3rem')}" alt="">
    <span v-show="showName" style="margin-left: 1rem;font-weight: bolder;margin-right: .5rem;overflow-x: hidden;">{{ props.name }}</span>
  </div>
  
  <div v-if="props.messageType=='group' && props.fromYou" style="display: flex;justify-content: end;flex-direction: column;position: absolute;bottom: .5rem;left: -1.65rem;gap: .5rem;">
    <v-btn @click="editGroupMessage" size="1.5rem" variant="text" icon="mdi-pen" rounded=""></v-btn>
    <v-btn @click="deleteGroupMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete" rounded=""></v-btn>
  </div>

  <div v-if="props.messageType=='channel' && props.isOwner" style="display: flex;position: absolute;top: -2rem;width: 100%;gap: 1rem;">
    <v-btn @click="deleteChannelMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete" rounded></v-btn>
    <v-btn @click="editChannelMessage" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
  </div>

  <div v-if="props.messageType=='chat' && props.fromYou" style="display: flex;position: absolute;top: -2rem;width: 100%;gap: 1rem;">
    <v-btn @click="deleteChatMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete" rounded></v-btn>
    <v-btn @click="editChatMessage" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
  </div>

  <v-card v-show="props.text" :created="props.time" :id="props.id" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" :text="props.text">


    </v-card>

      <div v-if="props.files.filter(name=>getFileType(name)=='image').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='image')" :key="file">
          <img @click="$emit('imageSelect',`/api/files/${props.messageType}Messages/${props.id}/${file}`)" style="border-radius: .3rem;margin: .5rem;height: 8rem;" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'">
        </template>
      </div>
      <div v-if="props.files.filter(name=>getFileType(name)=='video').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;margin-bottom: 1rem;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='video')" :key="file">
          <video controls preload="metadata" style="margin: .5rem;height: 8rem;border-radius: .3rem;" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'"></video>
        </template>
      </div>
      <div style="display: flex;align-items: center;flex-direction: column;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='audio')" :key="file">
          <audio preload="metadata" style="height: 1.5rem;margin: .25rem;width: calc(100% - 1rem);min-width: 15rem;" controls :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`"></audio>
        </template>
      </div>
      <div style="display: flex;overflow: scroll;white-space: nowrap;margin-top: .5rem;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='misc')" :key="file">
          <div style="width: fit-content;">
            <tg-file-chip :link="`/api/files/${props.messageType}Messages/${props.id}/${file}`" :fileName="file"></tg-file-chip>
          </div>
        </template>
      </div>

      <div style="padding: 1rem;display: flex;opacity: .5;font-size: .5rem;font-weight: bold;" :style="{justifyContent : (props.messageType=='channel') ? 'center' :'space-between'}">
        <span>{{new Date(props.time).toLocaleTimeString([],{ hour12: false })}}</span>
        <v-icon style="margin-left: .5rem;" v-if="props.fromYou && props.messageType=='chat'" :icon="props.seen ? 'mdi-check-all' : 'mdi-check'"></v-icon>
      </div>
</div>
</template>


<script setup>
import {getFileType} from '@/funcs/commonFuncs'
import tgFileChip from '@/components/tgFileChip.vue'
import {ref} from 'vue'
import pb from '@/main';

const showName=ref(false)
const props = defineProps(['seen','text','avatar','time','images','videos','audios','files','name','fromYou','fromOther','id','messageType','userId','isOwner'])

async function deleteChatMessage(){
  pb.collection('chatMessages').delete(props.id)
}
async function editChatMessage(){
  
}

async function deleteGroupMessage(){
  pb.collection('groupMessages').delete(props.id)
}
async function editGroupMessage(){
  
}

async function deleteChannelMessage(){
  pb.collection('channelMessages').delete(props.id)
}
async function editChannelMessage(){
  
}

</script>