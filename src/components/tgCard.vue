<template>
    <input multiple accept="*/*" ref="fileInput" @change="addFiles" type="file" hidden>


    <div v-click-outside="()=>{if(!editMode)showActions=false;}" @contextmenu.prevent="showActions=true" @dblclick="showActions=true" :created="props.time" :id="props.id" :style="{alignSelf : (props.messageType=='channel') ? 'center' : (props.fromYou ? 'flex-end' : 'flex-start') }" style="border: solid;border-radius: .5rem;padding: .5rem;border-color: var(--tgBrown);max-width: 80%;margin: 1.5rem;margin-top: 1rem;margin-bottom: 3rem;width: min-content;position: relative;min-width: 13rem;display: flex;flex-direction: column;justify-content: space-between;min-height: 15rem;">
    
    
      <div v-if="props.messageType=='group'" @click="showName = !showName" @dblclick="$emit('userSelect',props.userId)" @contextmenu.prevent="$emit('userSelect',props.userId)" style="height: 3rem;margin-left: -2rem;margin-top: -2rem;background-color: var(--tgBg);border-radius: .5rem;margin-bottom: 1rem;border-style: solid;border-color: var(--tgBrown);border-width: .2rem;width: fit-content;max-width: calc(80cqw - 3rem);display: flex;align-items: center;white-space: nowrap;">
        <img style="height: 100%;width: 2.6rem;min-width: 2.6rem;object-fit: cover;border-radius: .3rem;" :src="props.avatar" :style="{borderTopRightRadius : (showName ? '0' : '.3rem'), borderBottomRightRadius : (showName ? '0' : '.3rem')}" alt="">
        <Transition name="width">
          <span v-show="showName" style="margin-left: 1rem;font-weight: bolder;margin-right: .5rem;overflow-x: hidden;">{{ props.name }}</span>
        </Transition>
      </div>
      



      <div v-if="props.messageType=='group' && showActions" style="display: flex;justify-content: end;flex-direction: column;position: absolute;bottom: .5rem;left: -1.8rem;justify-content: space-between;height: calc(100% - 2.5rem);">
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
                  <!-- <v-btn style="margin-top: auto;" @click="reply" size="1.5rem" variant="text" icon="mdi-reply" rounded></v-btn>     -->
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
      <div v-else v-show="text" :dir="dir" style="width: 100%;">
        <v-card width="max-content" max-width="100%" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" hover>
        <template #text>
          <div :innerHTML="text"></div>
          <!-- <span dir="auto" style="display: block;min-height: 1rem;" v-for="(line,index) in textLines" :id="`${props.id}-line-${index+1}`">{{ line }}</span> -->
        </template>
        </v-card>
      </div>
      
    
          <div v-if="props.files.filter(name=>getFileType(name)=='image').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;">
            <div style="display: flex;margin: .5rem;" v-for="file in props.files.filter(name=>getFileType(name)=='image')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" rounded variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1rem;"></v-btn>
              <img @click="$emit('imageSelect',`/api/files/${props.messageType}Messages/${props.id}/${file}`)" style="border-radius: .3rem;height: 8rem;" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'">
            </div>
          </div>
          <div v-if="props.files.filter(name=>getFileType(name)=='video').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;margin-bottom: 1rem;">
            <div v-for="file in props.files.filter(name=>getFileType(name)=='video')" :key="file" :id="file" style="text-align: center;flex-grow: 1;flex-shrink: 0;">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" rounded variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1rem;"></v-btn>
              <video controls preload="metadata" style="margin: .5rem;height: 8rem;border-radius: .3rem;width: calc(100% - 1rem);" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'"></video>
            </div>
          </div>
          <div style="display: flex;align-items: center;flex-direction: column;">
            <div style="width: calc(100% - 1rem);display: flex;align-items: center;" v-for="file in props.files.filter(name=>getFileType(name)=='audio')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-right: .25rem;"></v-btn>
              <audio preload="metadata" style="flex-grow: 1;height: 1.5rem;margin: .25rem;min-width: 10rem;" controls :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`"></audio>
            </div>
          </div>
          <div style="display: flex;padding: 0;overflow: scroll;white-space: nowrap;margin: auto;width: calc(100% - 1.65rem);">
            <div style="display: flex;flex-direction: column;width: fit-content;margin-left: -.5rem;" v-for="file in props.files.filter(name=>getFileType(name)=='misc')" :key="file" :id="file">
              <!-- <div style="width: fit-content;"> -->
                <tg-file-chip :link="`/api/files/${props.messageType}Messages/${props.id}/${file}`" :fileName="file"></tg-file-chip>
                <v-btn @click="pushDeletingFile(file)" v-if="editMode" variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1.125rem;"></v-btn>
              <!-- </div> -->
            </div>
          </div>

          <a v-for="link in links" :href="link" style="all:unset;display:block;"><v-btn variant="text" prepend-icon="mdi-link" height="1rem" width="fit-content" style="font-size: .5rem;font-weight: bold;font-style: italic;overflow-x: clip;justify-content: flex-start;max-width: calc(100% - 1rem);">{{ link }}</v-btn></a>


          <div style="display: flex;align-items: center;justify-content: space-between;white-space: 100%;">
            <v-btn @click="fileInput.click()" v-if="editMode" variant="text" color="primary" icon="mdi-plus" rounded></v-btn>

            <div style="overflow: auto;white-space: nowrap;overflow-y: hidden;height: 3.5rem;padding-top: .2rem;">

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
    </style>
    
    
    <script setup>
    import {getFileType,getIcon} from '@/funcs/commonFuncs'
    import tgFileChip from '@/components/tgFileChip.vue'
    import {ref, onMounted, computed, onUpdated} from 'vue'
    import pb from '@/main';
    
    import {useOtherStore} from '@/store/otherStore'

    const showActions=ref(false)

    const {showError} = useOtherStore()

    
    const showName=ref(false)

    const props = defineProps(['seen','text','avatar','time','images','videos','audios','files','name','fromYou','fromOther','id','messageType','userId','isOwner','repliedMessageId'])
    const emit = defineEmits(['insert','reply'])

    const editMode=ref(false)
    const msg=ref(props.text)
    const addingFiles=ref([]);
    const deletingFiles=ref([]);
    const fileInput=ref()

    const copied = ref(false)

    var links = []

      var text = props.text;
      Array.from(text.matchAll(new RegExp(/https?:\/\/[^\s]+/,'g'))).forEach(link => text= text.replaceAll(link[0],`<a class="link" href="${link[0]}">${link[0]}</a>`));
      text = text.split('\n').map((line, index)=>`<span id="${props.id}-line-${index+1}" dir="auto" style="display: block;min-height: 1rem;">${line}</span>`).join('');
      if(props.text.replaceAll(new RegExp(/https?:\/\/[^\s]+/,'g'),'').trim() == ''){links=props.text.split('\n').map(link=>link.trim()).filter(link=>link);text=null;}
    const textLines = computed(()=>props.text.split('\n'))
    const dir = ref('auto')
    
    // onUpdated(()=>{dir.value=getComputedStyle(document.getElementById('line-1')).direction})


    function removeFile(file){
    addingFiles.value = addingFiles.value.filter(h => h != file)
  }

    function addFiles(){
    for (var i=0;i<fileInput.value.files.length;i++){
      addingFiles.value.push(fileInput.value.files[i])
    }
    fileInput.value.value=null
  }

  function pushDeletingFile(fileName){
    deletingFiles.value.push(fileName)
    document.getElementById(fileName).style.display='none'
  }

    
    async function deleteChatMessage(){
      try{
        await pb.collection('chatMessages').delete(props.id)
      }catch{showError('deleting message failed.')}
    }
    async function editChatMessage(){
      try{
        var formData = new FormData();
      fillFormData(formData)
      const record = await pb.collection('chatMessages').update(props.id,formData);
      }catch{showError('editing message failed.')}
      exitFromEditMode()
    }
    
    async function deleteGroupMessage(){
      try{
        await pb.collection('groupMessages').delete(props.id)
      }catch{showError('deleting message failed.')}
    }
    async function editGroupMessage(){
      try{
        var formData = new FormData();
      fillFormData(formData)
      const record = await pb.collection('groupMessages').update(props.id,formData);
      }catch{showError('editing message failed.')}
      exitFromEditMode()    }
    
    async function deleteChannelMessage(){
      try{
        await pb.collection('channelMessages').delete(props.id)
      }catch{showError('deleting message failed.')}
    }
    async function editChannelMessage(){
      try{
        var formData = new FormData();
      fillFormData(formData)
      const record = await pb.collection('channelMessages').update(props.id,formData);
      }catch{showError('editing message failed.')}
      exitFromEditMode()
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
      fileInput.value.value=null
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

    onMounted(()=>{emit('insert',props.id);dir.value=getComputedStyle(document.getElementById(`${props.id}-line-1`)).direction;})
    
    </script>