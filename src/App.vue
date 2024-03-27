<template>

  <v-app :class="getTheme" :theme="getTheme">
    <v-main>


      <suspense>

      <tg-wrapper>
        <suspense>
          <router-view v-slot="{ Component, route }">
            <transition name="slide-right">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </suspense>
      </tg-wrapper>


</suspense>




  <v-snackbar v-show="errorVisibility" timeout="3000" color="error" variant="elevated" location="top" width="90vw" style="margin-top: 5rem;"
      v-model="errorVisibility"
    >
      {{ errorMessage }}

      <template v-slot:actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="errorVisibility = false"
        >
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-show="alertVisibility" timeout="3000" :color="alertType" variant="elevated" location="top" width="90vw" style="margin-top: 5rem;"
      v-model="alertVisibility"
    >
      {{ alertMessage }}

      <template v-slot:actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="alertVisibility = false"
        >
        </v-btn>
      </template>
    </v-snackbar>




    <v-bottom-sheet class="share-sheet" v-model="showShareSheet">
        <div style="width: 100%;">
          <v-list max-height="50dvh" style="border-top-left-radius: 1rem;border-top-right-radius: 1rem;">

            <template v-for="sendable in allSendables.filter(i => i.id != shareId)">
              <v-list-item :prepend-avatar="getAvatarUrl(sendable.id,sendable.subject.avatar,sendable.receiverType)" :title="sendable.subject.name">
                <template v-slot:append><v-checkbox :value="sendable" v-model="shareSelectedList"></v-checkbox></template>
              </v-list-item>
            </template>

          </v-list>
          <v-textarea v-model="shareMessage" class="share-text" variant="outlined" dir="auto" no-resize bg-color="var(--tgBg)" rows="1" :rounded="false" base-color="var(--tgBrown)" label="message" shaped style="border-radius: 0;background-color: var(--tgBg);"></v-textarea>
        <v-btn style="border-radius: 0;" width="50%" prepend-icon="mdi-close" color="error" @click="showShareSheet=false;shareSelectedList=[];shareMessage='';">close</v-btn>
        <v-btn style="border-radius: 0;" width="50%" prepend-icon="mdi-share-all" color="primary" @click="async()=>{showShareSheet=false;await share();shareSelectedList=[];shareMessage='';}">share</v-btn>
        </div>
  </v-bottom-sheet>

    </v-main>
  </v-app>


</template>

<script setup>

import { ref, provide, onMounted } from 'vue';

import tgWrapper from '@/tgWrapper.vue'


const drawer= ref(false);

provide('drawer', drawer)



import {storeToRefs} from 'pinia'
import {useSettingsStore} from '@/store/settingsStore'
import {useOtherStore} from '@/store/otherStore'

import {useDataStore} from '@/store/dataStore'


import {getAvatarUrl} from '@/funcs/commonFuncs';


const {errorVisibility,errorMessage,alertVisibility,alertMessage,alertType, showShareSheet, shareId, shareType, shareMessage, shareSelectedList} = storeToRefs(useOtherStore())
const {share} = useOtherStore()
const{allSendables}=storeToRefs(useDataStore())



const {getTheme}=storeToRefs(useSettingsStore())

</script>
