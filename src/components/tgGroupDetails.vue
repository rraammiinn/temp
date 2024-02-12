<template>

    <div style="width: 100vw;height: 100dvh;background-color: var(--tgBg);z-index: 900;position: fixed;bottom: 0;overflow-y: scroll;padding-top: 4rem;">
        <div class="main">
            <img style="width: 100%;" :src="`/api/files/groups/${props.group.id}/${props.group.avatar}`" alt="">
            <div style="width: 100%;margin-bottom: 1rem;">
                <v-btn @click="showGroup=false;showUser=false;" icon="mdi-message" style="width: 3rem; height: 3rem;margin-right: 1rem;margin-left: auto;display: block;margin-top: -2rem;border-radius: 50%;"></v-btn>
            </div>
            <v-col style="padding: 1rem;">
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.group.name}}</h3><h5 style="opacity: .5;">group name</h5>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex;justify-content: space-between;">
                        <h3>{{props.owner.name}}</h3>
                        <v-avatar @click="$router.push({name:'chat', params:{otherId:props.owner.id},query:{initMessageId:'',showUser:true}})" :image="`/api/files/users/${props.owner.id}/${props.owner.avatar}`"></v-avatar>
                    </div>
                    <h5 style="opacity: .5;">owner</h5>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <h3>{{props.group.about}}</h3><h5 style="opacity: .5;">about</h5>
                </div>
            </v-col>
        </div>




        <h3 style="font-weight: bold;margin-left: 1rem;margin-top: 3rem;margin-bottom: 1rem;">members</h3>
            <div v-for="member in props.members" @click="$router.push({name:'chat', params:{otherId:member.id},query:{initMessageId:'',showUser:true}})" :key="member.id">
              <v-list-item class="listItem"
              :prepend-avatar="`/api/files/users/${member.id}/${member.avatar}`"
              :title="member.name"
              :subtitle="member.username"
            >
            <template v-slot:append>
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
            <v-divider></v-divider>
          </div>
          <div style="height: 3.25rem;"></div>

          <v-btn @click="leave(props.group.id)" v-if="props.joined" style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="error">leave</v-btn>
          <v-btn @click="join(props.group.id)" v-else style="position: fixed;bottom:0;margin: .5rem;" width="calc(100% - 1rem)" color="primary">join</v-btn>

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
  
    import { useDataStore } from "@/store/dataStore";
    import {addContact,deleteContact} from '@/funcs/contactFunc';
    import { join,leave } from '@/funcs/groupFuncs';

    const{contacts}=storeToRefs(useDataStore())
    
    const props=defineProps(['group','owner','members','joined'])
    const showGroup=inject('showGroup')
    const showUser=inject('showUser')
    
    
    </script>