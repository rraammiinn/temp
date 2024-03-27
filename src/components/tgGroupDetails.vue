<template>

    <div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4.1rem;">
        <div class="main">
            <img style="width: 100%;" :src="getGroupAvatarUrl(props.group.id, props.group.avatar)" alt="">
            <div style="width: 100%;margin-bottom: 1rem;display: flex;justify-content: space-between;padding: 1rem;margin-top: -3rem;align-items: center;">
            <div style="display: flex;justify-content: space-between;gap: 1rem;align-items: center;">
                <v-btn @click="shareType='group';shareId=props.group.id;showShareSheet=true;" icon="mdi-share-all" style="width: 1.5rem;height: 1.5rem;font-size: .5rem"></v-btn>
                <v-btn @click="copyLink" :color="copied ? 'success' : 'default'" :icon=" copied ? 'mdi-check' : 'mdi-content-copy'" style="width: 1.5rem;height: 1.5rem;font-size: .5rem"></v-btn>
            </div>
            <v-btn @click="showGroup=false;showUser=false;" icon="mdi-message"></v-btn>
        </div>
            <v-col style="padding: 1rem;">
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.group.name}}</h3><h5 style="opacity: .5;">group name</h5>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex;justify-content: space-between;">
                        <h3>{{props.owner.name}}</h3>
                        <v-avatar @click="$router.push({name:'chat', params:{otherId:props.owner.id},query:{initMessageId:'',showUser:true}})" :image="getUserAvatarUrl(props.owner.id, props.owner.avatar)"></v-avatar>
                    </div>
                    <h5 style="opacity: .5;">owner</h5>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.group.about}}</h3><h5 style="opacity: .5;">about</h5>
                </div>
            </v-col>
        </div>




        <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">members</h3>
            <template v-for="member in props.members">
              <v-list-item v-if="member.id != pb.authStore.model.id" @click="$router.push({name:'chat', params:{otherId:member.id},query:{initMessageId:'',showUser:true}})" :key="member.id" class="listItem"
              :prepend-avatar="getUserAvatarUrl(member.id, member.avatar)"
              :title="member.name"
              :subtitle="member.username"
            >
            <template v-slot:append>
              <v-btn v-if="props.blockList.includes(member.id)"
              color="error"
              icon="mdi-power-off"
              variant="text"
              @click.stop="async()=>{await unBlockMember(props.group.id,member.id);props.blockList=props.blockList.filter(memberId=>memberId != member.id);}"
            ></v-btn>
            <v-btn v-else
              color="success"
              icon="mdi-power"
              variant="text"
              @click.stop="async()=>{await blockMember(props.group.id,member.id);props.blockList=[...props.blockList,member.id];}"
            ></v-btn>


            <v-btn v-if="Object.keys(contacts).includes(member.id)"
              color="error"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteContact(contacts[member.id].contactId)"
            ></v-btn>
            <v-btn v-else
              color="primary"
              icon="mdi-plus"
              variant="text"
              @click.stop="addContact(member.id)"
            ></v-btn>
          </template>

          </v-list-item>
            <v-divider v-if="member.id != pb.authStore.model.id"></v-divider>
          </template>
          <div style="height: 3.25rem;"></div>

          <v-btn @click="leave(props.group.id)" v-if="props.joined" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="error">leave</v-btn>
          <v-btn @click="async()=>{await join(props.group.id);$emit('join')}" v-else style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="primary">join</v-btn>

    </div>
    
    </template>
    
    <style scoped>
    .main{
        max-width: 50rem;
        margin: auto;
    }
    .listItem:hover{
      color: var(--tgPrimary);
      background-color:var(--tgPrimaryHover);
  }
    </style>
    
    <script setup>
    import { inject, ref } from 'vue';
    import { storeToRefs } from "pinia";

    import pb from '@/main';
  
    import { useDataStore } from "@/store/dataStore";
    import {addContact,deleteContact} from '@/funcs/contactFunc';
    import { join,leave,blockMember,unBlockMember } from '@/funcs/groupFuncs';

    import {useOtherStore} from '@/store/otherStore'

    import {getUserAvatarUrl, getGroupAvatarUrl} from '@/funcs/commonFuncs';



    const {showShareSheet, shareId, shareType} = storeToRefs(useOtherStore())



    const {showError, showProgressBar, hideProgressBar} = useOtherStore()

    const{contacts}=storeToRefs(useDataStore())
    
    const props=defineProps(['group','owner','members','joined','blockList'])
    const showGroup=inject('showGroup')
    const showUser=inject('showUser')

    const copied = ref(false)

    async function copyLink(){
          try{
            await navigator.clipboard.writeText(window.location);
            copied.value=true;
            setTimeout(() => {
              copied.value=false;
            }, 3000);
          }catch{}
        }
    
    
    </script>