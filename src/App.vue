<template>

  <v-app :class="getTheme" :theme="getTheme">
    <v-main>


      <suspense>

      <tg-wrapper>
        <suspense>
          <router-view></router-view>
        </suspense>
      </tg-wrapper>


</suspense>




<v-snackbar timeout="3000" color="error" variant="tonal" location="top" width="90vw" style="margin-top: 5rem;"
      v-model="errorVisibility"
    >
      {{ errorMessage }}

      <template v-slot:actions>
        <v-btn
          icon="mdi-close"
          color="error"
          variant="text"
          @click="errorVisibility = false"
        >
        </v-btn>
      </template>
    </v-snackbar>
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

const {errorVisibility,errorMessage} = storeToRefs(useOtherStore())



const {getTheme}=storeToRefs(useSettingsStore())

</script>
