<template>
<div :style="{alignSelf : !(props.fromYou || props.fromOther) ? 'center' : (props.fromYou ? 'flex-end' : 'flex-start') }" style="border: solid;border-radius: .5rem;padding: .5rem;border-color: var(--tgBrown);margin: 1rem;max-width: 80%;margin-top: 1rem;margin-bottom: 3rem;width: min-content;">
  <v-card :created="props.time" :id="props.id" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;min-width: max-content;" :text="props.text" :title="props.name" :prepend-avatar="props.avatar">


    </v-card>

      <div v-if="props.files.filter(name=>getFileType(name)=='image').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='image')" :key="file">
          <img @click="$emit('imageSelect',`/api/files/chatMessages/${props.id}/${file}`)" style="border-radius: .3rem;margin: .5rem;height: 8rem;" :src="`/api/files/chatMessages/${props.id}/${file}`" onerror="this.style.display='none'">
        </template>
      </div>
      <div v-if="props.files.filter(name=>getFileType(name)=='video').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;margin-bottom: 1rem;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='video')" :key="file">
          <video controls preload="metadata" style="margin: .5rem;height: 8rem;border-radius: .3rem;" :src="`/api/files/chatMessages/${props.id}/${file}`" onerror="this.style.display='none'"></video>
        </template>
      </div>
      <div style="display: flex;align-items: center;flex-direction: column;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='audio')" :key="file">
          <audio preload="metadata" style="height: 1.5rem;margin: .25rem;width: calc(100% - 1rem);min-width: 15rem;" controls :src="`/api/files/chatMessages/${props.id}/${file}`"></audio>
        </template>
      </div>
      <div style="display: flex;overflow: scroll;white-space: nowrap;margin-top: .5rem;">
        <template  v-for="file in props.files.filter(name=>getFileType(name)=='misc')" :key="file">
          <div style="width: fit-content;">
            <tg-file-chip :link="`/api/files/chatMessages/${props.id}/${file}`" :fileName="file"></tg-file-chip>
          </div>
        </template>
      </div>

      <div style="padding: 1rem;display: flex;justify-content: space-between;opacity: .5;font-size: .5rem;font-weight: bold;">
        <span>{{new Date(props.time).toLocaleTimeString([],{ hour12: false })}}</span>
        <v-icon v-if="props.fromYou" :icon="props.seen ? 'mdi-check-all' : 'mdi-check'"></v-icon>
      </div>
</div>
</template>

<script setup>
import {getFileType} from '@/funcs/commonFuncs'
import tgFileChip from '@/components/tgFileChip.vue'

const props = defineProps(['seen','text','avatar','time','images','videos','audios','files','name','fromYou','fromOther','id'])

</script>