<template>
    <input multiple accept="*/*" ref="fileInput" @change="addFiles" type="file" hidden>


    <div :created="props.time" :id="props.id" :style="{alignSelf : (props.messageType=='channel') ? 'center' : (props.fromYou ? 'flex-end' : 'flex-start') }" style="border: solid;border-radius: .5rem;padding: .5rem;border-color: var(--tgBrown);max-width: 80%;margin: 1.5rem;margin-top: 1rem;margin-bottom: 3rem;width: min-content;position: relative;">
    
    
      <div v-if="props.messageType=='group'" @click="showName = !showName" @dblclick="$emit('userSelect',props.userId)" style="height: 3rem;margin-left: -2rem;margin-top: -2rem;background-color: var(--tgBg);border-radius: .5rem;margin-bottom: 1rem;border-style: solid;border-color: var(--tgBrown);border-width: .2rem;width: fit-content;max-width: calc(80cqw - 3rem);display: flex;align-items: center;white-space: nowrap;">
        <img style="height: 100%;width: 2.6rem;object-fit: cover;border-radius: .3rem;" :src="props.avatar" :style="{borderTopRightRadius : (showName ? '0' : '.3rem'), borderBottomRightRadius : (showName ? '0' : '.3rem')}" alt="">
        <span v-show="showName" style="margin-left: 1rem;font-weight: bolder;margin-right: .5rem;overflow-x: hidden;">{{ props.name }}</span>
      </div>
      



      <div v-if="props.messageType=='group' && props.fromYou" style="display: flex;justify-content: end;flex-direction: column;position: absolute;bottom: .5rem;left: -1.8rem;gap: 1rem;">
        <v-btn @click="deleteGroupMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete-forever" rounded></v-btn>
        <div v-if="editMode">
          <v-btn @click="cancelEditing" size="1.5rem" variant="text" icon="mdi-close" style="display: block;" rounded></v-btn>
          <v-btn @click="editGroupMessage" size="1.5rem" variant="text" icon="mdi-check" color="primary" rounded></v-btn>
        </div>
        <v-btn v-else @click="goToEditMode" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
      </div>
    
      <div v-if="props.messageType=='channel' && props.isOwner" style="display: flex;position: absolute;top: -2rem;width: max-content;gap: 1rem;">
        <v-btn @click="deleteChannelMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete-forever" rounded></v-btn>
        <div v-if="editMode">
          <v-btn @click="cancelEditing" size="1.5rem" variant="text" icon="mdi-close" rounded></v-btn>
          <v-btn @click="editChannelMessage" size="1.5rem" variant="text" icon="mdi-check" color="primary" rounded></v-btn>
        </div>
        <v-btn v-else @click="goToEditMode" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
      </div>
    
      <div v-if="props.messageType=='chat' && props.fromYou" style="display: flex;position: absolute;top: -2rem;width: max-content;gap: 1rem;">
        <v-btn @click="deleteChatMessage" size="1.5rem" color="error" variant="text" icon="mdi-delete-forever" rounded></v-btn>
        <div v-if="editMode">
          <v-btn @click="cancelEditing" size="1.5rem" variant="text" icon="mdi-close" rounded></v-btn>
          <v-btn @click="editChatMessage" size="1.5rem" variant="text" icon="mdi-check" color="primary" rounded></v-btn>
        </div>
        <v-btn v-else @click="goToEditMode" size="1.5rem" variant="text" icon="mdi-pen" rounded></v-btn>
      </div>
    
      <v-textarea v-if="editMode"  v-model="msg"
              auto-grow
              variant="outlined"
              rows="1"
              shaped
              color="var(--tgBrown)"
              base-color="var(--tgBrown)"
      ></v-textarea>
      <v-card v-else v-show="props.text" width="max-content" max-width="100%" elevation="10" color="var(--tgBrown)" style="margin-bottom: 1.5rem;border-radius: .35rem;" :text="props.text">
    
    
        </v-card>
    
          <div v-if="props.files.filter(name=>getFileType(name)=='image').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;">
            <div style="display: flex;margin: .5rem;" v-for="file in props.files.filter(name=>getFileType(name)=='image')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" rounded variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1rem;"></v-btn>
              <img @click="$emit('imageSelect',`/api/files/${props.messageType}Messages/${props.id}/${file}`)" style="border-radius: .3rem;height: 8rem;" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'">
            </div>
          </div>
          <div v-if="props.files.filter(name=>getFileType(name)=='video').length" style="display: flex;overflow: auto;white-space: nowrap;height: 10rem;align-items: end;margin-bottom: 1rem;">
            <div v-for="file in props.files.filter(name=>getFileType(name)=='video')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" rounded variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-left: 1rem;"></v-btn>
              <video controls preload="metadata" style="margin: .5rem;height: 8rem;border-radius: .3rem;" :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`" onerror="this.style.display='none'"></video>
            </div>
          </div>
          <div style="display: flex;align-items: center;flex-direction: column;">
            <div style="width: calc(100% - 1rem);display: flex;align-items: center;" v-for="file in props.files.filter(name=>getFileType(name)=='audio')" :key="file" :id="file">
              <v-btn @click="pushDeletingFile(file)" v-if="editMode" variant="text" color="error" icon="mdi-close" size="1.5rem" style="margin-right: .25rem;"></v-btn>
              <audio preload="metadata" style="flex-grow: 1;height: 1.5rem;margin: .25rem;min-width: 15rem;" controls :src="`/api/files/${props.messageType}Messages/${props.id}/${file}`"></audio>
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
            <v-icon style="margin-left: .5rem;" v-if="props.fromYou && props.messageType=='chat'" :icon="props.seen ? 'mdi-check-all' : 'mdi-check'"></v-icon>
          </div>

    </div>

    </template>
    
    
    <script setup>
    import {getFileType,getIcon} from '@/funcs/commonFuncs'
    import tgFileChip from '@/components/tgFileChip.vue'
    import {ref, onMounted} from 'vue'
    import pb from '@/main';
    
    import {useOtherStore} from '@/store/otherStore'

    const {showError} = useOtherStore()

    
    const showName=ref(false)

    const props = defineProps(['seen','text','avatar','time','images','videos','audios','files','name','fromYou','fromOther','id','messageType','userId','isOwner'])
    const emit = defineEmits(['insert'])

    const editMode=ref(false)
    const msg=ref(props.text)
    const addingFiles=ref([]);
    const deletingFiles=ref([]);
    const fileInput=ref()

    function removeFile(file){
    console.log(addingFiles.value)
    addingFiles.value = addingFiles.value.filter(h => h != file)
    console.log(addingFiles.value)
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

    onMounted(()=>{emit('insert',props.id)})
    
    </script>