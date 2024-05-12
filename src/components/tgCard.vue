<template>
    <input multiple accept="*/*" ref="fileInput" @change="addFiles" type="file" hidden>


    <div v-click-outside="()=>{if(!editMode)showActions=false;}" @contextmenu.prevent="showActions=true" @dblclick="showActions=true" :created="props.time" :id="props.id" style="border: solid;border-radius: .5rem;padding: .5rem;max-width: 80%;margin: 1.5rem;margin-top: 1rem;margin-bottom: 3rem;width: min-content;position: relative;min-width: 13rem;display: flex;flex-direction: column;justify-content: space-between;gap: .5rem;" :style="{alignSelf : (props.messageType=='channel') ? 'center' : (props.fromYou ? 'flex-end' : 'flex-start'), borderColor: props.glow ?  'var(--tgPrimary)' : 'var(--tgBrown)', boxShadow: props.glow ? '.5rem .5rem .5rem var(--tgPrimary)' : 'unset' }" class="main" :class="{'expanded' : showActions && props.messageType=='group', 'collapsed' : !showActions}">
    
    
      <div v-if="props.messageType=='group'" @click="showName = !showName" @dblclick="$emit('userSelect',props.userId)" @contextmenu.prevent="$emit('userSelect',props.userId)" style="height: 3.2rem;margin-left: -2.1rem;margin-top: -2.1rem;background-color: var(--tgBg);border-radius: .5rem;margin-bottom: 1rem;border-style: solid;border-width: .2rem;width: fit-content;max-width: calc(80cqw - 3rem);display: flex;align-items: center;white-space: nowrap;" :style="{borderColor: props.glow ?  'var(--tgPrimary)' : 'var(--tgBrown)'}">
        <img style="height: 100%;width: 2.8rem;min-width: 2.8rem;object-fit: cover;border-radius: .3rem;" :src="props.avatar" :style="{borderTopRightRadius : (showName ? '0' : '.3rem'), borderBottomRightRadius : (showName ? '0' : '.3rem')}" alt="">
        <Transition name="width">
          <span v-show="showName" style="margin-left: 1rem;font-weight: bolder;margin-right: .5rem;overflow-x: hidden;">{{ props.name }}</span>
        </Transition>
      </div>
      



      <div v-if="props.messageType=='group' && showActions" style="display: flex;justify-content: end;flex-direction: column;position: absolute;bottom: .5rem;left: -1.65rem;justify-content: space-between;height: calc(100% - 2.5rem);">
                <div v-if="props.fromYou" style="display: flex;flex-direction: column;gap: 1rem;">
                  <v-btn @click="deleteGroupMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete-forever" rounded></v-btn>
        <div v-if="editMode">
          <v-btn @click="cancelEditing" size="1.5rem" variant="text" icon="mdi-close" style="display: block;" rounded></v-btn>
          <v-btn @click="editGroupMessage" size="1.5rem" variant="text" icon="mdi-check" color="primary" rounded></v-btn>
        </div>
        <v-btn v-else @click="goToEditMode" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
                </div>
                <div style="display: flex;flex-direction: column;gap: 1rem;margin-top: auto;">
                <v-btn @click="copy" size="1.5rem" variant="text" :color="copied ? 'success' : 'default'" :icon=" copied ? 'mdi-check' : 'mdi-content-copy'" rounded></v-btn>
                  <v-btn @click="reply" size="1.5rem" variant="text" icon="mdi-reply" rounded></v-btn>        
                </div>
      </div>
    
      <div v-if="props.messageType=='channel' && showActions" style="display: flex;position: absolute;top: -2rem;width: max-content;justify-content: space-between;width: calc(100% - 1rem);">
                <div v-if="props.isOwner" style="display: flex;gap: 1rem;">
                  <v-btn @click="deleteChannelMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete-forever" rounded></v-btn>
        <div v-if="editMode">
          <v-btn @click="cancelEditing" size="1.5rem" variant="text" icon="mdi-close" rounded></v-btn>
          <v-btn @click="editChannelMessage" size="1.5rem" variant="text" icon="mdi-check" color="primary" rounded></v-btn>
        </div>
        <v-btn v-else @click="goToEditMode" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
                </div>
                <div style="display: flex;gap: 1rem;margin-left: auto;">
                  <v-btn @click="copy" size="1.5rem" variant="text" :color="copied ? 'success' : 'default'" :icon=" copied ? 'mdi-check' : 'mdi-content-copy'" rounded></v-btn>    
                </div>
      </div>
    
      <div v-if="props.messageType=='chat' && showActions" style="display: flex;position: absolute;top: -2rem;width: max-content;justify-content: space-between;width: calc(100% - 1rem);">
        <div v-if="props.fromYou" style="display: flex;gap: 1rem;">
          <v-btn @click="deleteChatMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete-forever" rounded></v-btn>
        <div v-if="editMode">
          <v-btn @click="cancelEditing" size="1.5rem" variant="text" icon="mdi-close" rounded></v-btn>
          <v-btn @click="editChatMessage" size="1.5rem" variant="text" icon="mdi-check" color="primary" rounded></v-btn>
        </div>
        <v-btn v-else @click="goToEditMode" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
        </div>
        <div style="display: flex;gap: 1rem;margin-left: auto;">
          <v-btn @click="copy" size="1.5rem" variant="text" :color="copied ? 'success' : 'default'" :icon=" copied ? 'mdi-check' : 'mdi-content-copy'" rounded></v-btn>
          <v-btn @click="reply" size="1.5rem" variant="text" icon="mdi-reply" rounded></v-btn>    
        </div>
      </div>
    
      <v-textarea v-if="editMode"  v-model="msg"
              dir="auto"
              auto-grow
              variant="outlined"
              rows="1"
              shaped
              color="var(--tgBrown)"
              base-color="var(--tgBrown)"
      ></v-textarea>
      <div v-if="!editMode && text && !(shareChatId || shareGroupId || shareChannelId)" :dir="dir" style="width: 100%;">
        <v-card width="max-content" max-width="100%" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" hover>
        <template #text>
          <div :innerHTML="text"></div>
        </template>
        </v-card>
      </div>


      <div v-if="!editMode && shareChat" :dir="dir" style="width: 100%;">
        <v-card :prepend-avatar="getUserAvatarUrl(shareChat.id, shareChat.avatar)" :title="shareChat.name" width="max-content" max-width="100%" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" hover>
        <template #text>
          <div>{{ shareChat.bio }}</div>
          <div style="margin-top: 1rem;" v-if="text" :innerHTML="text"></div>
          <RouterLink class="link" :to="shareChatLink">see user</RouterLink>
        </template>
        </v-card>
      </div>

      <div v-if="!editMode && shareGroup" :dir="dir" style="width: 100%;">
        <v-card :prepend-avatar="getGroupAvatarUrl(shareGroup.id, shareGroup.avatar)" :title="shareGroup.name" width="max-content" max-width="100%" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" hover>
        <template #text>
          <div>{{ shareGroup.about }}</div>
          <div style="margin-top: 1rem;" v-if="text" :innerHTML="text"></div>
          <RouterLink class="link" :to="shareGroupLink">see group</RouterLink>
        </template>
        </v-card>
      </div>

      <div v-if="!editMode && shareChannel" :dir="dir" style="width: 100%;">
        <v-card :prepend-avatar="getChannelAvatarUrl(shareChannel.id, shareChannel.avatar)" :title="shareChannel.name" width="max-content" max-width="100%" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" hover>
        <template #text>
          <div>{{ shareChannel.about }}</div>
          <div style="margin-top: 1rem;" v-if="text" :innerHTML="text"></div>
          <RouterLink class="link" :to="shareChannelLink">see channel</RouterLink>
        </template>
        </v-card>
      </div>
      
    
          <div v-if="props.files.filter(name=>getFileType(name)=='image').length" style="display: flex;overflow: auto;white-space: nowrap;padding-bottom: 1rem;padding-top: 1rem;align-items: end;">
            <div style="display: flex;margin: .5rem;" v-for="file in props.files.filter(name=>getFileType(name)=='image')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" rounded variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1rem;"></v-btn>
              <img @click="$emit('imageSelect',{id:props.id, clickedImage:`/api/files/${props.messageType}Messages/${props.id}/${file}`, images:props.files.filter(name=>getFileType(name)=='image')})" style="border-radius: .3rem;height: 8rem;" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'">
            </div>
          </div>
          <div v-if="props.files.filter(name=>getFileType(name)=='video').length" style="display: flex;overflow: auto;white-space: nowrap;padding-bottom: 1rem;padding-top: 1rem;align-items: end;margin-bottom: 1rem;">
            <div v-for="file in props.files.filter(name=>getFileType(name)=='video')" :key="file" :id="file" style="text-align: center;flex-grow: 1;flex-shrink: 0;">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" rounded variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1rem;"></v-btn>
              <video controls preload="metadata" style="margin: .5rem;height: 8rem;border-radius: .3rem;width: calc(100% - 1rem);" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`"></video>
            </div>
          </div>
          <div v-if="props.files.filter(name=>getFileType(name)=='audio').length"  style="display: flex;align-items: center;flex-direction: column;">
            <div style="width: calc(100% - 1rem);display: flex;align-items: center;" v-for="file in props.files.filter(name=>getFileType(name)=='audio')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-right: .25rem;"></v-btn>
              <audio preload="metadata" style="flex-grow: 1;height: 1.5rem;margin: .25rem;min-width: 10rem;" controls :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`"></audio>
            </div>
          </div>
          <div v-if="props.files.filter(name=>getFileType(name)=='misc').length"  style="display: flex;padding: 0;overflow: auto;white-space: nowrap;margin: auto;width: calc(100% - 1.65rem);">
            <div style="display: flex;flex-direction: column;width: fit-content;margin-left: -.5rem;" v-for="file in props.files.filter(name=>getFileType(name)=='misc')" :key="file" :id="file">
                <tg-file-chip :link="`/api/files/${props.messageType}Messages/${props.id}/${file}`" :fileName="file"></tg-file-chip>
                <v-btn @click="pushDeletingFile(file)" v-if="editMode" variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1.125rem;"></v-btn>
            </div>
          </div>

          <a v-for="link in links" :href="link" target="_blank" style="all:unset;display:block;"><v-btn variant="text" prepend-icon="mdi-link" height="1rem" width="fit-content" style="font-size: .5rem;font-weight: bold;font-style: italic;overflow-x: clip;justify-content: flex-start;max-width: calc(100% - 1rem);">{{ link }}</v-btn></a>


          <div style="display: flex;align-items: center;justify-content: space-between;white-space: 100%;">
            <v-btn @click="fileInput.click()" v-if="editMode" variant="text" color="primary" icon="mdi-plus" rounded></v-btn>

            <div style="overflow: auto;white-space: nowrap;overflow-y: hidden;height: fit-content;padding-top: .2rem;">

              <v-chip v-for="file in addingFiles" :key="file"
              @click:close="removeFile(file)"
              class="ma-2"
              closable
              color="var(--tgBrown)"
              close-icon="mdi-delete"
              :prepend-icon="file.name=='voice.mp3' ? 'mdi-microphone' : getIcon(getFileType(file.name))"
              :model-value="true"
              >
              {{ file.name }}
              </v-chip>
            </div>
          </div>

    
          <div style="padding: 1rem;display: flex;opacity: .5;font-size: .5rem;font-weight: bold;" :style="{justifyContent : (props.messageType=='channel') ? 'center' :'space-between'}">
            <span>{{new Date(props.time).toLocaleTimeString([],{ hour12: false })}}</span>
            <div style="display: flex;gap: .25rem;margin-left: .5rem;">
              <v-icon v-if="props.edited" icon="mdi-pen"></v-icon>
              <v-icon @click="$emit('goToMessage', props.repliedMessageId)" v-if="props.repliedMessageId" icon="mdi-link"></v-icon>
              <v-icon v-if="props.fromYou && props.messageType=='chat'" :icon="props.seen ? 'mdi-check-all' : 'mdi-check'"></v-icon>
            </div>
          </div>

    </div>


    </template>

    <style scoped>
    .width-enter-active,
    .width-leave-active {
      transition: all 0.5s ease-in-out;
    }

    .width-enter-from,
    .width-leave-to {
      width: 0 !important;
      margin: 0 !important;
      transform: scaleX(0);
    }





    .main:not(.expanded){
      animation-name: collapse;
      /* animation-direction: reverse; */
      animation-duration: 1s;
      animation-timing-function:ease;
      animation-fill-mode: forwards;
    }

    .main.expanded{
      animation-name: expand;
      animation-duration: 1s;
      animation-timing-function:ease;
      animation-fill-mode: forwards;
    }


@keyframes expand {
  from {min-height: 0;}
  to {min-height: 15rem;}
}

@keyframes collapse {
  from {min-height: 15rem;}
  to {min-height: 0;}
}

    </style>
    
    
    <script setup>
    import {getFileType,getIcon} from '@/funcs/commonFuncs'
    import tgFileChip from '@/components/tgFileChip.vue'
    import {ref, onMounted, computed, onUpdated} from 'vue'
    import {pb} from '@/funcs/pb'
    
    import {useOtherStore} from '@/store/otherStore'

    import { getUserAvatarUrl, getGroupAvatarUrl, getChannelAvatarUrl } from '@/funcs/commonFuncs';

    const showActions=ref(false)

    const {showError, showProgressBar, hideProgressBar} = useOtherStore()

    
    const showName=ref(false)

    const props = defineProps(['seen','text','avatar','time','images','videos','audios','files','name','fromYou','fromOther','id','messageType','userId','isOwner','repliedMessageId','glow', 'edited'])
    const emit = defineEmits(['insert','reply'])

    const editMode=ref(false)
    const msg=ref(props.text)
    const addingFiles=ref([]);
    const deletingFiles=ref([]);
    const fileInput=ref()

    const copied = ref(false)

    let links = []


      let text = props.text;

      const shareChatLink = text.match(new RegExp(/tg-chat-link\/[^\s]+/), text)?.[0]?.replace?.('tg-chat-link','')
      const shareGroupLink = text.match(new RegExp(/tg-group-link\/[^\s]+/), text)?.[0]?.replace?.('tg-group-link','')
      const shareChannelLink = text.match(new RegExp(/tg-channel-link\/[^\s]+/), text)?.[0]?.replace?.('tg-channel-link','')
      
      const shareChatId = shareChatLink?.split?.('?')?.[0]?.split?.('/')?.at?.(-1)
      const shareGroupId = shareGroupLink?.split?.('?')?.[0]?.split?.('/')?.at?.(-1)
      const shareChannelId = shareChannelLink?.split?.('?')?.[0]?.split?.('/')?.at?.(-1)

      const shareChat = (shareChatId ? await pb.collection('users').getOne(shareChatId,{$autoCancel:false}) : null)
      const shareGroup = (shareGroupId ? await pb.collection('groups').getOne(shareGroupId,{$autoCancel:false}) : null)
      const shareChannel = (shareChannelId ? await pb.collection('channels').getOne(shareChannelId,{$autoCancel:false}) : null)


      text = text.replace('tg-chat-link','')
      text = text.replace('tg-group-link','')
      text = text.replace('tg-channel-link','')
      
      text = text.replace(shareChatLink,'')
      text = text.replace(shareGroupLink,'')
      text = text.replace(shareChannelLink,'')

      text = text.trim()






      Array.from(text.matchAll(new RegExp(/https?:\/\/[^\s]+/,'g'))).forEach(link => text= text.replaceAll(link[0],`<a target="_blank" class="link" href="${link[0]}">${link[0]}</a>`));
      text = text.split('\n').map((line, index)=>`<span id="${props.id}-line-${index+1}" dir="auto" style="display: block;min-height: 1rem;">${line}</span>`).join('');
      if(props.text.replaceAll(new RegExp(/https?:\/\/[^\s]+/,'g'),'').trim() == ''){links=props.text.split('\n').map(link=>link.trim()).filter(link=>link);text=null;}
    const textLines = computed(()=>props.text.split('\n'))
    const dir = ref('auto')
    


    function removeFile(file){
    addingFiles.value = addingFiles.value.filter(h => h != file)
  }

    function addFiles(){
    for (let i=0;i<fileInput.value.files.length;i++){
      addingFiles.value.push(fileInput.value.files[i])
    }
    fileInput.value.value=null
  }

  function pushDeletingFile(fileName){
    deletingFiles.value.push(fileName)
    document.getElementById(fileName).style.display='none'
  }

    
    async function deleteChatMessage(){
      showProgressBar()
      try{
        await pb.collection('chatMessages').delete(props.id)
      }catch{showError('deleting message failed.')}
      hideProgressBar()
    }
    async function editChatMessage(){
      showProgressBar()
      try{
        let formData = new FormData();
      fillFormData(formData)
      const record = await pb.collection('chatMessages').update(props.id,formData);
      }catch{showError('editing message failed.')}
      exitFromEditMode()
      hideProgressBar()
    }
    
    async function deleteGroupMessage(){
      showProgressBar()
      try{
        await pb.collection('groupMessages').delete(props.id)
      }catch{showError('deleting message failed.')}
      hideProgressBar()
    }
    async function editGroupMessage(){
      showProgressBar()
      try{
        let formData = new FormData();
      fillFormData(formData)
      const record = await pb.collection('groupMessages').update(props.id,formData);
      }catch{showError('editing message failed.')}
      exitFromEditMode()
    hideProgressBar()
  }
    
    async function deleteChannelMessage(){
      showProgressBar()
      try{
        await pb.collection('channelMessages').delete(props.id)
      }catch{showError('deleting message failed.')}
      hideProgressBar()
    }
    async function editChannelMessage(){
      showProgressBar()
      try{
        let formData = new FormData();
      fillFormData(formData)
      const record = await pb.collection('channelMessages').update(props.id,formData);
      }catch{showError('editing message failed.')}
      exitFromEditMode()
      hideProgressBar()
    }
    
    function goToEditMode(){
      editMode.value=true;

    }

    function cancelEditing(){
      deletingFiles.value.forEach(fileName=>document.getElementById(fileName).style.display='flex')
      exitFromEditMode()
    }

    function exitFromEditMode(){
      msg.value=props.text
      addingFiles.value=[]
      deletingFiles.value=[]
      fileInput.value=null
      editMode.value=false
    }
    
    function fillFormData(formData){
      formData.append('text', msg.value)
      formData.append('files-', JSON.stringify(deletingFiles.value))
      for (const file of addingFiles.value){
        formData.append('files', file)
      }
    }

    async function copy(){
      try{
        await navigator.clipboard.writeText(props.text);
        copied.value=true;
        setTimeout(() => {
          copied.value=false;
        }, 3000);
      }catch{}
    }

    function reply(){
      emit('reply',props.id,props.avatar,props.text)
    }

    onMounted(()=>{emit('insert',props.id);
    try{
      dir.value=getComputedStyle(document.getElementById(`${props.id}-line-1`)).direction;  
    }catch{}
    })
    
    </script>