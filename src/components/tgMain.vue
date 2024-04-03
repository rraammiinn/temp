<template>

        <v-card>
      <v-layout>
        <v-app-bar prominent style="position: fixed;padding-right: .5rem;">
          <slot name="appBar"></slot>
          <v-progress-linear
      width="100vw"
      color="var(--tgBrown)"
      indeterminate
      style="z-index: 99999;position: absolute;top: unset;bottom: 0;"
      v-show="progressBarVisibility"
    ></v-progress-linear>
        </v-app-bar>
  
        <v-navigation-drawer
          v-model="drawer"
          location="left"
          temporary
          style="position: fixed;height: 100%;padding-bottom: 3rem;"
        >
          <v-list>
            <slot name="sideBarItems"><tg-side-bar-items></tg-side-bar-items></slot>
        </v-list>
        </v-navigation-drawer>
  
        <v-main style="height: 100dvh;overflow:auto;">
          <slot name="main"></slot>
        </v-main>
      </v-layout>
    </v-card>

  </template>
  
  <script setup>
    import { inject } from 'vue';
    import { storeToRefs } from 'pinia';

    import tgSideBarItems from './tgSideBarItems.vue';

    import { useOtherStore } from '@/store/otherStore';

    const {progressBarVisibility} = storeToRefs(useOtherStore())
    const {showProgressBar, hideProgressBar}=useOtherStore()

    const drawer=inject('drawer')
  </script>
  
