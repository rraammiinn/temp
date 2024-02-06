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


const {getTheme}=storeToRefs(useSettingsStore())

</script>
